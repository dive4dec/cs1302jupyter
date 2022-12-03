#!/usr/bin/python
import sys
import nbformat as nbf

if __name__ == '__main__':
    for i in range(1, len(sys.argv)):
        fn = sys.argv[i]
        nb = nbf.read(fn, 4)
        nb['metadata']['kernelspec'] = {
            "name": "xeus-python",
            "display_name": "Python (XPython)",
            "language": "python"
        }
        with open(fn, 'w') as f:
            nbf.write(nb, f)