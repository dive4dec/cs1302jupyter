#!/opt/conda/bin/python3.10
import nbformat as nbf
import glob

if __name__ == '__main__':
    for fn in glob.glob("_output/files/*/*.ipynb"):
        nb = nbf.read(fn, 4)
        nb['metadata']['kernelspec'] = {
            "name": "python",
            "display_name": "Python (Pyodide)",
            "language": "python"
        }
        with open(fn, 'w') as f:
            nbf.write(nb, f)
