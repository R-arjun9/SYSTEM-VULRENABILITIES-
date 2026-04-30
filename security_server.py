from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import sys
import os

app = Flask(__name__)
CORS(app)

def run_python_script(script_name):
    """Executes a python script and returns its JSON output."""
    try:
        # Try 'python' then 'python3'
        cmd = ["python", script_name]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        # Fallback to python3
        try:
            cmd = ["python3", script_name]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return result.stdout
        except Exception as ex:
            return f'{{"error": "Execution failed: {str(ex)}"}}'
    except Exception as e:
        return f'{{"error": "Execution failed: {str(e)}"}}'

@app.route('/api/scan', methods=['GET', 'OPTIONS'])
def scan():
    output = run_python_script("scanner.py")
    try:
        import json
        return jsonify(json.loads(output))
    except:
        return output, 500

@app.route('/api/taskmgr', methods=['GET', 'OPTIONS'])
def taskmgr():
    output = run_python_script("taskmgr.py")
    try:
        import json
        return jsonify(json.loads(output))
    except:
        return output, 500

if __name__ == '__main__':
    port = 8080
    try:
        print(f"Starting Python Security Server on port {port}...")
        app.run(host='0.0.0.0', port=port, debug=False)
    except Exception as e:
        print(f"Port {port} busy, trying 8081...")
        app.run(host='0.0.0.0', port=8081, debug=False)
