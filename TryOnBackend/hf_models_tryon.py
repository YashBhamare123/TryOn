from concurrent.futures.thread import ThreadPoolExecutor

from huggingface_hub import hf_hub_download

# Flux Fill FP8
hf_hub_download(repo_id= "boricuapab/flux1-fill-dev-fp8", filename= "flux1-fill-dev-fp8.safetensors", local_dir= './models/diffusion_models')

# Flux VAE
hf_hub_download(repo_id= "black-forest-labs/FLUX.1-Fill-dev" , filename= "ae.safetensors", local_dir="./models/vae")

# T5 xxl Encoder FP8
hf_hub_download(repo_id="fmoraes2k/t5xxl_fp8_e4m3fn.safetensors" , filename= "t5xxl_fp8_e4m3fn.safetensors", local_dir="./models/text_encoders")

# ViT-L-4
hf_hub_download(repo_id="zer0int/CLIP-GmP-ViT-L-14" , filename="ViT-L-14-TEXT-detail-improved-hiT-GmP-TE-only-HF.safetensors", local_dir="./models/text_encoders")

# Flux Redux
hf_hub_download(repo_id="black-forest-labs/FLUX.1-Redux-dev" , filename="flux1-redux-dev.safetensors", local_dir="./models/style_models")

# ACE ++ Lora
hf_hub_download(repo_id="ali-vilab/ACE_Plus" , filename="subject/comfyui_subject_lora16.safetensors", local_dir='./models/loras')

# Flux Turbo Lora
hf_hub_download(repo_id="alimama-creative/FLUX.1-Turbo-Alpha" , filename="diffusion_pytorch_model.safetensors", local_dir="./models/loras")

# Real ESR GAN
hf_hub_download(repo_id="ai-forever/Real-ESRGAN" , filename="RealESRGAN_x2.pth", local_dir="./models/upscale_models")

# Seformer Clothes
hf_hub_download(repo_id="mattmdjaga/segformer_b2_clothes", local_dir= "./models/segformer_b2_clothes")
