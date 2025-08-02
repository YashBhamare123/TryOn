from groq import Groq
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import json
import base64
import mimetypes
import requests

def get_uri(image_url: str):
    response = requests.get(image_url)
    response.raise_for_status()
    image_bytes = response.content
    image_encoded = base64.b64encode(image_bytes).decode('utf-8')

    image_ext, _ = mimetypes.guess_type(image_url)
    data_uri = f"data:{image_ext};base64,{image_encoded}" 
    return data_uri

def get_segments(subject_url: str, clothes_url : str):
    load_dotenv()
    client = Groq(api_key = os.environ.get("GROQ_API_KEY"))

    subject_uri = get_uri(subject_url)
    clothes_uri = get_uri(clothes_url)

    with open("./prompt.txt", 'r') as f:
        system_prompt = f.read()

    class SegmentChoices(BaseModel):
        subject_clothes_type : str
        clothes_type : str
        left_arm : bool
        right_arm : bool
        left_leg : bool
        right_leg : bool
        upper_clothes : bool
        skirt : bool
        pants : bool
        dress : bool

    completion = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role" : "system",
                "content" : system_prompt,
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "This is my subject image"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": subject_uri
                        }
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "In my previous message was the subject image. This is my clothes/person wearing clothes image. What all will I need to segment in my subject image that was given to you previously?"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": clothes_uri
                        }
                    }
                ]
            }
        ],
        temperature=1,
        stop=None,
        response_format= {
            "type" : "json_schema",
            "json_schema" : {
                "name" : "segmentation_choices",
                "schema" : SegmentChoices.model_json_schema()
            }
        }
    )

    segments = json.loads(completion.choices[0].message.content)
    return segments


if __name__ == "__main__":
    subject_url = 'https://gcdnb.pbrd.co/images/AdGXJITwmNUX.jpg'
    clothes_url = 'https://gcdnb.pbrd.co/images/zRpNZBcFwkZz.webp'
    print(get_segments(subject_url , clothes_url))