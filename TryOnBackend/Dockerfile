FROM nvidia/cuda:12.4.0-devel-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive \
    TZ='Asia/Kolkata' \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    make build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev git-lfs \
    ffmpeg libsm6 libxext6 cmake libgl1-mesa-glx \
    python3.10 \
    python3-pip \
    && git lfs install \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git clone --depth 1 https://github.com/comfyanonymous/ComfyUI.git && \
    cd ComfyUI && \
    pip3 install --no-cache-dir -r requirements.txt && \
    cd custom_nodes && \
    git clone --depth 1 https://github.com/Comfy-Org/ComfyUI-Manager.git && \
    git clone --depth 1 https://github.com/lldacing/ComfyUI_Patches_ll.git && \
    git clone --depth 1 https://github.com/MinorBoy/ComfyUI_essentials_mb.git && \
    git clone --depth 1 https://github.com/WASasquatch/was-node-suite-comfyui/ && \
    git clone --depth 1 https://github.com/Acly/comfyui-inpaint-nodes.git && \
    git clone --depth 1 https://github.com/kijai/ComfyUI-KJNodes.git && \
    git clone --depth 1 https://github.com/yolain/ComfyUI-Easy-Use.git && \
    git clone --depth 1 https://github.com/rgthree/rgthree-comfy.git && \
    pip3 install --no-cache-dir \
        -r was-node-suite-comfyui/requirements.txt \
        -r ComfyUI-KJNodes/requirements.txt \
        -r ComfyUI-Easy-Use/requirements.txt \
        opencv-python && \
    find /ComfyUI -name ".git" -type d -exec rm -rf {} + 2>/dev/null || true

WORKDIR /ComfyUI

COPY ./hf_models_tryon.py .

EXPOSE 8188







