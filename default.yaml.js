proxy:
 service:
   type: ClusterIP

ingress:
  enabled: true
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: 256M
  hosts:
    - dive.cs.cityu.edu.hk
  pathType: Prefix 

hub:
  baseUrl: /cs1302_23a
  nodeSelector:
    kubernetes.io/hostname: dive
  image:
    name: localhost:32000/hub
    tag: 0.0.2a
  config:
    Authenticator:
      admin_users:
        - ccha23
        - ruoqitang2
    JupyterHub:
      admin_access: true
  extraConfig:
    01-multi-auth: |
      import subprocess
      import sqlite3
      from shlex import quote
      from jupyterhub.utils import maybe_future      
      from jupyterhub.auth import Authenticator, PAMAuthenticator
      from ltiauthenticator.lti11.auth import LTI11Authenticator

      def db_user_exists(user):
        con = sqlite3.connect('/srv/jupyterhub/jupyterhub.sqlite')
        cur = con.cursor()
        cur.execute("SELECT * FROM 'users' WHERE name=?", (str(user), ))
        row = cur.fetchone()
        con.close()
        return row

      class MyPAM(PAMAuthenticator):
        # Create JupyterHub users automatically
        create_hub_users = False

        async def authenticate(self, handler, data):
          user = await maybe_future(super().authenticate(handler, data))
          if user is None or not self.create_hub_users and db_user_exists(user) is None:
              return None
          return user

        def system_user_exists(self, user):
          cmd = 'getent passwd {}'.format(quote(user.name))
          try:
            subprocess.check_output(cmd, shell=True).decode("utf-8").strip()
          except subprocess.CalledProcessError as e:
            return False
          else:
            return True

      class MyAuthenticator(Authenticator):

        authenticators = [
          (MyPAM, '/', {}),
          (LTI11Authenticator, '/', {
            'consumers': { "cs1302_23a": {{ secret['LTI_SHARED_SECRET'] }} },
            'uri_scheme': "https",
            'username_key': "custom_canvas_user_login_id",
            'config_icon': "https://dive.cs.cityu.edu.hk/cs1302_23a/hub/logo",
          })
        ]

        def __init__(self, *arg, **kwargs):
          super().__init__(*arg, **kwargs)
          self._authenticators = []
          for auth_cls, url_scope, conf in self.authenticators:
            c = self.trait_values()
            c.update(conf)
            self._authenticators.append({
              'instance': auth_cls(**c),
              'url_scope': url_scope
            })

        def get_handlers(self, app):
          routes = []
          for _authenticator in self._authenticators:
            for path, handler in _authenticator['instance'].get_handlers(app):
              class SubHandler(handler):
                authenticator = _authenticator['instance']
              routes.append((f'{_authenticator["url_scope"]}{path}', SubHandler))
          return routes



      c.JupyterHub.authenticator_class = MyAuthenticator
    02-collab-group: |
      c.JupyterHub.load_groups = {
          # collaborative accounts get added to this group
          # so it's easy to see which accounts are collaboration accounts
          "collaborative": [
            "grader-cs1302",
            "all-cs1302"
          ],
          "grader": [
            "grader-cs1302",
          ],
          "formgrade-cs1302": []
      }

      c.JupyterHub.load_roles = [
        {
          "name": "access-grader-cs1302",
          "scopes": [
              "access:servers!user=grader-cs1302",
              "admin:servers!user=grader-cs1302",
              "admin-ui",
              "list:users!user=grader-cs1302",
              "access:servers!user=all-cs1302",
              "admin:servers!user=all-cs1302",
              "list:users!user=all-cs1302",              
          ],
          "groups": ["formgrade-cs1302"],
        },
        {
          "name": "user",
          "scopes": [
              "self",
              "access:servers!user=all-cs1302",
          ],
        }        
      ]

      def pre_spawn_hook(spawner):
        group_names = {group.name for group in spawner.user.groups}

        if "grader" in group_names:
          spawner.log.info(f"Changing UID for {spawner.user.name}")
          spawner.uid = 2000
          spawner.gid = 100

        exchange = {
          'name': 'volume-grader-2dcs1302',
          'persistentVolumeClaim': {
            'claimName': 'claim-grader-2dcs1302'
          },
          'mountPath': '/opt/conda/srv/exchange',
          'subPath': 'exchange',
          'home': '/home/nbgrader'
        }

        if spawner.user.name != "grader-cs1302":
          spawner.volumes.extend([
            {
              'name': exchange['name'],
              'persistentVolumeClaim': exchange['persistentVolumeClaim']
            }         
          ])
        else:
          # spawner.environment['NB_USER'] = 'nbgrader'
          # spawner.notebook_dir = '/home/nbgrader'
          spawner.volume_mounts.extend([
            {
              'name': exchange['name'],
              'mountPath': exchange['home']
            }        
          ])
        spawner.volume_mounts.extend([
          {
            'name': exchange['name'],
            'mountPath': exchange['mountPath'],
            'subPath': exchange['subPath']
          }        
        ])

      c.Spawner.pre_spawn_hook = pre_spawn_hook

    03-custom-profile-list: |
      # https://github.com/jupyterhub/jupyterhub/issues/2390

      from kubespawner import KubeSpawner

      class MyKubeSpawner(KubeSpawner):
        async def options_form(self, spawner):
          group_names = {group.name for group in spawner.user.groups}

          if "collaborative" in group_names:
            spawner.log.info(f"Enabling RTC for user {spawner.user.name}")
            for profile in spawner.profile_list:
              profile['default'] = False
            spawner.profile_list.extend(
              [
                  {
                      'display_name': 'Collaborative',
                      'description': 'Jupyter server with jupyterlab-collaboration.',
                      'kubespawner_override': {
                          'image': 'localhost:32000/cs1302nb__collab:0.1.2a',
                      },
                      'default': True,                      
                  },
              ]
            )
          return spawner._options_form_default()

      c.JupyterHub.spawner_class = MyKubeSpawner



cull:
  enabled: true
  adminUsers: false
  timeout: 14400
  every: 120
  concurrency: 60
  maxAge: 21600

singleuser:
  cmd: start-singleuser.sh
  image: 
    name: jupyter/minimal-notebook
    tag: latest
  storage:
    capacity: 10Gi
    homeMountPath: /home/jovyan
    dynamic:
      pvcNameTemplate: claim-{username}
      volumeNameTemplate: volume-{username}      
      storageClass: home-dive0-nfs
  memory:
    limit: 8G
    guarantee: 1G
  cpu:
    limit: 4
    guarantee: 0.25
  networkPolicy:
    egressAllowRules:
      privateIPs: true
  extraNodeAffinity:
    preferred:
    - weight: 1
      preference:
        matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - dkw1
          - dkw2
  profileList:
    - default: true
      display_name: Default
      description: |
        Default jupyter server run on Ubuntu.
      kubespawner_override:
        image: localhost:32000/cs1302nb:0.1.2a
    - display_name: Alpine
      description: |
        Lightweight jupyter server run on Alpine Linux. It may run faster but has less features.
      kubespawner_override:
        image: localhost:32000/cs1302nb_alpine:0.1.2a     
    # - display_name: bugbook
    #   description: |
    #     *** UNDER DEVELOPMENT ***
    #   kubespawner_override:
    #     image: localhost:32000/cs5489-notebook:0.0.2a

