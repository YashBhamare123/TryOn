from fastapi import FastAPI
import uvicorn
from comfy_behind_api import get_output
import requests
from urllib.parse import quote
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:5500",
    "null"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/output")
def complete_run(subject_url : str, clothes_url : str):

    cloud_name = 'dukgi26uv'
    upload_preset = 'try-on-not-secure'
    upload_url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
    payload = {
        "upload_preset": upload_preset,
        "tags": "unsigned, from_script"
    }

    image_bytes = get_output(subject_url, clothes_url)
    image_urls = []

    for image in image_bytes:
        files = {
            "file": image
        }
        response = requests.post(upload_url, files = files, data = payload)
        result = response.json()
        image_urls.append(result['secure_url'])
    return {"imageUrl": image_urls}

if __name__ == "__main__":
    uvicorn.run(app, host = "127.0.0.1", port = 8100)