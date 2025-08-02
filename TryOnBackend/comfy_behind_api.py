import websocket
import uuid
import json
import random
import urllib.parse
import urllib.request
from PIL import Image
import io
import mimetypes
from dotenv import load_dotenv
import os
from intellisegment import get_segments
from node_id_map import NodeIDs
load_dotenv()

nodes = NodeIDs()

base_url = os.environ.get('runpod_server')
server_address = base_url.split('/')[-1]
client_id = str(uuid.uuid4())

headers={
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
}

headers_request = {
        'User-Agent': 'Mozilla/5.0'
    }

# POST Request to send the workflow to ComfyUI server
def queue_prompt(prompt : dict):
    workflow = {"prompt" : prompt, "client_id" : client_id}
    data = json.dumps(workflow).encode('utf-8')
    request = urllib.request.Request(f"{base_url}/prompt", data = data, headers= headers)
    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read())                                                                     
        return result["prompt_id"] 

# GET Request to get the output image from the server   
def get_image(filename : str, subfolder : str, type: str):
    image_path = {"filename" : filename, "subfolder" : subfolder, "folder_type" : type}
    request = urllib.parse.urlencode(image_path)
    url = f"{base_url}/view?{request}"
    request = urllib.request.Request(url, headers= headers)
    with urllib.request.urlopen(request) as response:
        return response.read()

# GET Request to get the prompt history
def get_history(prompt_id):
    url = f"{base_url}/history/{prompt_id}"
    request = urllib.request.Request(url, headers= headers)
    with urllib.request.urlopen(request) as response:
        history = response.read()
        history = json.loads(history)
        return history
    

# POST Request to upload image file 
def upload_image(filename, image_bytes, mimetype):
    # Create multipart form data manually
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    
    body = []
    body.append(f'--{boundary}'.encode())
    body.append(f'Content-Disposition: form-data; name="image"; filename="{filename}"'.encode())
    body.append(f'Content-Type: {mimetype}'.encode())
    body.append(b'')
    body.append(image_bytes)
    body.append(f'--{boundary}'.encode())
    body.append(b'Content-Disposition: form-data; name="overwrite"')
    body.append(b'')
    body.append(b'true')
    body.append(f'--{boundary}--'.encode())
    
    body_bytes = b'\r\n'.join(body)
    
    upload_headers = {
        'Content-Type': f'multipart/form-data; boundary={boundary}',
        'User-Agent': 'Mozilla/5.0'
    }
    
    request = urllib.request.Request(f"{base_url}/upload/image", data=body_bytes, headers=upload_headers)
    
    with urllib.request.urlopen(request) as response:
        return response.read().decode('utf-8')


# Orcastrating Function
def run(ws, prompt, node_id):
    prompt_id = queue_prompt(prompt)
    while True:
        out = ws.recv()
        if isinstance(out, str):
            message = json.loads(out)
            if message['type'] == 'executing':
                data = message['data']
                if data['node'] is None and data['prompt_id'] == prompt_id:
                    break
        else:
            continue 
    
    image_outputs = []
    image_list = get_history(prompt_id)[prompt_id]['outputs'][node_id]['images']
    for image in image_list:
        image_outputs.append(get_image(**image))
    status = get_history(prompt_id)[prompt_id]['status']
    return image_outputs


# Prompt Generation
def get_output(subject_image_url, clothes_image_url):
    subject_name = subject_image_url.split('/')[-1]
    clothes_name = clothes_image_url.split('/')[-1]

    with urllib.request.urlopen(subject_image_url) as response:
        subject_image_bytes = response.read()
    with urllib.request.urlopen(clothes_image_url) as response:
        clothes_image_bytes = response.read()
    
    with open('./Best_TryOn_V7.json', 'r') as f:
        workflow = json.load(f)
    workflow[nodes.subject_image_loader]['inputs']['image'] = subject_name
    workflow[nodes.clothes_image_loader]['inputs']['image'] = clothes_name

    mime_type_subject, _ = mimetypes.guess_type(subject_image_url)
    mime_type_clothes, _ = mimetypes.guess_type(clothes_image_url)

    print(upload_image(subject_name, subject_image_bytes, mime_type_subject))
    print(upload_image(clothes_name, clothes_image_bytes, mime_type_clothes))

    segment_choices = get_segments(clothes_image_url)

    widget_values = {
    "face": False,
    "hair": False,
    "hat": False,
    "sunglass": False,
    "left_arm": segment_choices['left_arm'],
    "right_arm": segment_choices['right_arm'],
    "left_leg": segment_choices['left_leg'],
    "right_leg": segment_choices['right_leg'],
    "upper_clothes": segment_choices['upper_clothes'],
    "skirt": segment_choices['skirt'],
    "pants": segment_choices['pants'],
    "dress": segment_choices['dress'],
    "belt": segment_choices['dress'] == True,
    "shoe": False,
    "bag": False,
    "scarf": False
    }


    workflow[nodes.subject_clothes_segmenter]['inputs'].update(widget_values)
    print(workflow[nodes.subject_clothes_segmenter]['inputs'])
    workflow[nodes.k_sampler_advanced]['inputs']['noise_seed'] = random.randint(1, 768376246485590)
    ws = websocket.WebSocket()
    ws.connect(f"wss://{server_address}/ws?clientId={client_id}")
    image_bytes = run(ws, workflow, nodes.save_final_image)
    for image in image_bytes:
        image = Image.open(io.BytesIO(image))
        image.show()
    ws.close()
    return image_bytes


if __name__ == "__main__":
    clothes_image = 'https://gcdnb.pbrd.co/images/oZWmMxjXbncq.jpg'
    subject_image = 'https://gcdnb.pbrd.co/images/0ULVb11AUzcp.jpg'
    get_output(subject_image, clothes_image)
 