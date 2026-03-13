from diffusers import StableDiffusionPipeline
import torch

# 加载轻量级模型
model_id = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")

# 生成头像的prompt
prompt = "minimalist cartoon golden paw avatar, blue tech glow effect, transparent background, flat design, cute and professional, suitable for tech bot avatar, high resolution, clean design"
negative_prompt = "ugly, blurry, low quality, deformed, extra limbs, text, watermark"

# 生成图片
image = pipe(prompt, negative_prompt=negative_prompt, num_inference_steps=30, guidance_scale=7.5).images[0]

# 保存图片
image.save("/root/.openclaw/workspace/avatar.png")
print("✅ 头像已生成，保存到 /root/.openclaw/workspace/avatar.png")
