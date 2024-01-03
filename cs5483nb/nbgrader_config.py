import os

c=get_config()
c.Exchange.root = os.path.join(os.environ['CONDA_DIR'], "srv", "exchange")

# Add the following line to let students access courses without configuration
# For more information, read Notes for Instructors in the documentation
c.CourseDirectory.course_id = 'cs5483_23b'
c.Exchange.path_includes_course = True
c.Exchange.timezone = 'Hongkong'
c.Validator.ignore_checksums = True