from dataclasses import dataclass

@dataclass
class NodeIDs:
    # --- Image Loading & Preprocessing ---
    subject_image_loader: str = "15"
    clothes_image_loader: str = "14"
    yolo_cropper: str = "123"
    subject_clothes_segmenter: str = "76"
    garment_segmenter: str = "77"
    inpaint_masked_fill: str = "61"
    concat_preprocessed_images: str = "49"

    # --- Masking Logic ---
    resize_subject_mask: str = "25"
    grow_subject_mask: str = "17"
    mask_to_image: str = "43"
    rotate_mask_image: str = "53"
    empty_image: str = "44"
    concatenate_mask_and_empty: str = "46"
    final_image_to_mask: str = "47"
    invert_garment_mask: str = "62"

    # --- Model & Core Components ---
    unet_loader: str = "2"
    dual_clip_loader: str = "4"
    power_lora_loader: str = "3"
    style_model_loader: str = "9"
    clip_vision_loader: str = "10"
    vae_loader: str = "28"
    upscale_model_loader: str = "78"
    flux_forward_overrider: str = "5"
    apply_tea_cache_patch: str = "7"
    differential_diffusion: str = "8"

    # --- Conditioning & Encoding ---
    clip_text_encode: str = "83"
    clip_vision_encode: str = "12"
    style_model_apply: str = "11"
    flux_guidance: str = "38"
    conditioning_zero_out: str = "37"
    inpaint_model_conditioning: str = "26"

    # --- Caching ---
    cache_text_conditioning: str = "103"
    load_cached_conditioning: str = "104"

    # --- Sampling & Decoding ---
    k_sampler_advanced: str = "30"
    vae_decode: str = "31"
    vae_reroute: str = "101"

    # --- Image Resizing & Manipulation ---
    image_resizer_for_inpainting: str = "50"
    image_resizer_for_subject: str = "16"
    image_upscaler: str = "79"
    image_cropper_final: str = "125"
    get_original_image_size: str = "127"
    resize_to_original_size: str = "126"
    resize_output_image: str = "36"
    width_reroute: str = "128"
    height_reroute: str = "129"
    rotate_empty_image: str = "52"

    # --- Output & Previews ---
    preview_concatenated_mask: str = "48"
    preview_inpainted_setup: str = "63"
    preview_final_preprocessed: str = "51"
    preview_cropped_subject: str = "124"
    preview_final_resized: str = "32"
    preview_final_output: str = "130"
    save_final_image: str = "132"