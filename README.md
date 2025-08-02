# 🎭 The Fitting Room - AI Virtual Try-On Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688.svg)](https://fastapi.tiangolo.com/)
[![ComfyUI](https://img.shields.io/badge/ComfyUI-Compatible-purple.svg)](https://github.com/comfyanonymous/ComfyUI)

> **Transform your style instantly with AI-powered virtual try-on technology**

The Fitting Room is a cutting-edge virtual try-on application that uses advanced AI models to seamlessly blend clothing items onto person images. Upload a photo of yourself and any clothing item, and watch as our AI stylist creates a realistic preview of how you'd look wearing that outfit.

## ✨ Features

### 🎨 **Intelligent Virtual Try-On**
- **AI-Powered Segmentation**: Automatically detects and segments clothing types using Groq's Llama vision model
- **Realistic Rendering**: Uses FLUX diffusion models with LoRA fine-tuning for photorealistic results
- **Smart Masking**: Intelligent body part detection for accurate clothing placement
- **Multiple Clothing Types**: Supports dresses, shirts, pants, skirts, and more

### 🖥️ **Modern Web Interface**
- **Elegant UI**: Beautiful, responsive design with 3D animations and smooth transitions
- **Drag & Drop**: Easy file upload with visual feedback
- **Real-time Preview**: Instant image previews and upload status
- **Mobile Friendly**: Fully responsive design that works on all devices

### ⚡ **High Performance**
- **Cloud Integration**: Seamless Cloudinary integration for image hosting
- **Fast Processing**: Optimized ComfyUI workflow for quick results
- **Batch Processing**: Support for multiple output variations
- **Caching**: Smart caching system for improved performance

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   ComfyUI       │
│   (Vanilla JS)  │◄──►│   (FastAPI)      │◄──►│   Workflow      │
│                 │    │                  │    │                 │
│ • Image Upload  │    │ • API Endpoints  │    │ • FLUX Models   │
│ • UI/UX         │    │ • Image Processing│    │ • Segmentation  │
│ • Cloudinary    │    │ • AI Integration │    │ • Diffusion     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 🧠 **AI Pipeline**
1. **Image Analysis**: Groq Llama vision model analyzes clothing types
2. **Segmentation**: Intelligent body part and clothing detection
3. **Preprocessing**: Image resizing, cropping, and mask generation
4. **Generation**: FLUX diffusion model creates the try-on result
5. **Post-processing**: Upscaling and final image optimization

## 🚀 Quick Start

### Prerequisites
- Docker (recommended) OR Python 3.8+
- Node.js (for frontend development)
- RunPod account for ComfyUI backend
- Cloudinary account (optional)
- Groq API key

### 1. Clone the Repository
```bash
git clone https://github.com/YashBhamare123/the-fitting-room.git
cd the-fitting-room
```

### 2. 🐳 ComfyUI Backend Setup (RunPod)

#### Option A: Use Pre-built Docker Image (Recommended) 🐳
```bash
# Pull the pre-built Docker image
docker pull yashbhamare123/tryon:runpod
```

#### Option B: Build Docker Image Yourself 🔨
```bash
cd TryOnBackend

# Build the Docker image
docker build -t tryon-backend .
```

#### Deploy to RunPod
1. **Create a RunPod account** at [runpod.io](https://runpod.io)
2. **Deploy a new pod** using one of these methods:
   - **Pre-built image**: Use `yashbhamare123/tryon:runpod`
   - **Custom build**: Upload your built image
3. **Configure the pod**:
   - Choose GPU: RTX 4090 or better recommended
   - Set container disk: 50GB minimum (required for models)
   - Expose HTTP port: 8188
4. **Start the pod** and note the **RunPod Proxy URL**
5. **Download required models** (first-time setup):
   ```bash
   # SSH into your RunPod instance and run:
   python hf_models_tryon.py
   ```
   This will download all necessary AI models to their respective folders (~50GB total)

### 3. Backend Setup (Local)
```bash
cd TryOnBackend

# Install dependencies (if running locally)
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Configure your environment variables
nano .env
```

### 4. Environment Configuration
Create a `.env` file in the `TryOnBackend` directory:
```env
# RunPod ComfyUI Server Configuration
runpod_server=https://your-runpod-proxy-url.runpod.net

# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Optional: Additional configurations
DEBUG=true
```

**Important**: Replace `your-runpod-proxy-url.runpod.net` with your actual RunPod proxy URL from step 2.

### 5. Frontend Setup
```bash
cd ../TryOnFrontend

# Configure Cloudinary (optional)
# Edit config.js with your Cloudinary credentials
nano config.js
```

### 6. Run the Application
```bash
# Start the backend server (local)
cd TryOnBackend
python main.py

# Serve the frontend (using any web server)
cd ../TryOnFrontend
python -m http.server 8080
# or use Live Server in VS Code
```

### 7. Access the Application
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:8100`
- API Documentation: `http://localhost:8100/docs`
- RunPod ComfyUI: Your RunPod proxy URL

## 📁 Project Structure

```
the-fitting-room/
├── 📂 TryOnBackend/
│   ├── 🐍 main.py                 # FastAPI application entry point
│   ├── 🔧 comfy_behind_api.py     # ComfyUI workflow orchestration
│   ├── 🧠 intellisegment.py       # AI-powered image segmentation
│   ├── 🗺️ node_id_map.py          # ComfyUI node ID mappings
│   ├── 📋 requirements.txt        # Python dependencies
│   ├── 🎯 prompt.txt              # AI segmentation prompts
│   └── 📊 Best_TryOn_V7.json      # ComfyUI workflow definition
├── 📂 TryOnFrontend/
│   ├── 🏠 index.html              # Main application interface
│   ├── 🎨 style.css               # Styling and animations
│   ├── ⚡ script.js               # Core application logic
│   ├── 📤 image-upload.js         # Image upload handling
│   ├── ⚙️ config.js               # Configuration settings
│   └── 🔗 temp-url-service.js     # Temporary URL generation
├── 📄 README.md                   # This file
└── 📜 LICENSE                     # MIT License
```

## 🔧 Configuration

### Backend Configuration
The backend can be configured through environment variables:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `runpod_server` | RunPod ComfyUI proxy URL | ✅ | `https://abc123-8188.proxy.runpod.net` |
| `GROQ_API_KEY` | Groq API key for AI segmentation | ✅ | `gsk_...` |
| `DEBUG` | Enable debug logging | ❌ | `true` |

**Getting your RunPod URL:**
1. Start your RunPod pod with the ComfyUI image
2. Go to "My Pods" in RunPod dashboard
3. Click "Connect" on your running pod
4. Copy the "HTTP Service [Port 8188]" URL
5. Use this URL as your `runpod_server` value

### Frontend Configuration
Edit `TryOnFrontend/config.js` to configure:

- **Cloudinary**: Image hosting and optimization
- **File Validation**: Supported formats and size limits
- **UI Settings**: Preview options and upload behavior
- **Debug Options**: Logging and error reporting

## 🎯 API Endpoints

### `GET /output`
Generate a virtual try-on image.

**Parameters:**
- `subject_url` (string): URL of the person's image
- `clothes_url` (string): URL of the clothing item image

**Response:**
```json
{
  "imageUrl": [
    "https://cloudinary-url-1.jpg",
    "https://cloudinary-url-2.jpg"
  ]
}
```

## 🧪 Usage Examples

### Basic Try-On
```javascript
// Frontend JavaScript
const response = await fetch(`http://localhost:8100/output?subject_url=${subjectUrl}&clothes_url=${clothesUrl}`);
const result = await response.json();
console.log('Generated images:', result.imageUrl);
```

### Python API Usage
```python
import requests

response = requests.get('http://localhost:8100/output', params={
    'subject_url': 'https://example.com/person.jpg',
    'clothes_url': 'https://example.com/shirt.jpg'
})

result = response.json()
print('Generated images:', result['imageUrl'])
```

## 🎨 Supported Clothing Types

The AI can intelligently detect and process:

- **Upper Body**: Shirts, blouses, jackets, sweaters
- **Lower Body**: Pants, jeans, shorts, skirts
- **Full Body**: Dresses, jumpsuits, overalls
- **Accessories**: Belts (when part of dresses)

## 🔍 How It Works

### 1. Image Upload & Validation
- Users upload subject and clothing images
- Frontend validates file types and sizes
- Images are uploaded to Cloudinary for hosting

### 2. AI-Powered Analysis
- Groq's Llama vision model analyzes both images
- Determines clothing type and required segmentation
- Generates segmentation parameters automatically

### 3. ComfyUI Processing
- Images are sent to ComfyUI server
- FLUX diffusion model processes the try-on
- Multiple variations are generated

### 4. Result Delivery
- Processed images are uploaded to Cloudinary
- URLs are returned to the frontend
- Users can preview and download results

## 🛠️ Development

### Adding New Features
1. **Backend**: Extend `main.py` with new endpoints
2. **Frontend**: Add UI components in `index.html` and logic in `script.js`
3. **AI Models**: Modify `Best_TryOn_V7.json` workflow as needed

### Testing
```bash
# Test backend endpoints
curl "http://localhost:8100/output?subject_url=test1.jpg&clothes_url=test2.jpg"

# Frontend testing
# Use browser developer tools and check console logs
```

### Debugging
- Enable debug mode in `config.js`
- Check browser console for frontend issues
- Monitor backend logs for API errors
- Verify ComfyUI server connectivity

## 🚨 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if all dependencies are installed: `pip install -r requirements.txt`
- Verify environment variables in `.env` file
- Ensure RunPod ComfyUI server is accessible and running

**Models not found errors:**
- Run the model download script: `python hf_models_tryon.py`
- Ensure 50GB+ disk space is available
- Check RunPod pod storage configuration

**Images not processing:**
- Verify Groq API key is valid
- Check RunPod ComfyUI server status
- Ensure image URLs are accessible
- Confirm all models are downloaded properly

**Frontend upload issues:**
- Check Cloudinary configuration in `config.js`
- Verify CORS settings in backend
- Check browser console for errors

**Slow processing:**
- RunPod server performance depends on GPU selection
- RTX 4090 or better recommended for optimal speed
- Check network connectivity to RunPod server
- Ensure models are fully loaded (first run may be slower)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ComfyUI**: For the powerful diffusion model workflow system
- **FLUX**: For state-of-the-art diffusion models
- **Groq**: For fast AI inference capabilities
- **Cloudinary**: For reliable image hosting and optimization

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YashBhamare123/the-fitting-room/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YashBhamare123/the-fitting-room/discussions)
- **Email**: [Contact the maintainer](mailto:your-email@example.com)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/YashBhamare123">AIML009</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>