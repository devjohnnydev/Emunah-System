import os
import subprocess
import time
import signal
import sys
from flask import Flask, request, Response
import requests

app = Flask(__name__)

node_process = None
node_port = 5001

def start_node_server():
    global node_process
    env = os.environ.copy()
    env['PORT'] = str(node_port)
    node_process = subprocess.Popen(
        ['npm', 'run', 'dev'],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    
    def log_output():
        for line in node_process.stdout:
            print(f"[Node.js] {line}", end='', flush=True)
    
    import threading
    thread = threading.Thread(target=log_output, daemon=True)
    thread.start()
    
    time.sleep(3)
    print(f"Node.js server started on port {node_port}", flush=True)

def cleanup(signum, frame):
    global node_process
    if node_process:
        node_process.terminate()
        node_process.wait()
    sys.exit(0)

signal.signal(signal.SIGTERM, cleanup)
signal.signal(signal.SIGINT, cleanup)

start_node_server()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
def proxy(path):
    url = f'http://localhost:{node_port}/{path}'
    
    if request.query_string:
        url += f'?{request.query_string.decode()}'
    
    try:
        resp = requests.request(
            method=request.method,
            url=url,
            headers={key: value for key, value in request.headers if key.lower() != 'host'},
            data=request.get_data(),
            cookies=request.cookies,
            allow_redirects=False,
            stream=True
        )
        
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for name, value in resp.raw.headers.items()
                   if name.lower() not in excluded_headers]
        
        return Response(resp.content, resp.status_code, headers)
    except Exception as e:
        print(f"Proxy error: {e}", flush=True)
        return Response(f"Proxy error: {str(e)}", status=502)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
