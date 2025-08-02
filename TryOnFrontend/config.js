/**
 * Image Upload Configuration
 * Configure your image hosting services here
 */
window.IMAGE_UPLOAD_CONFIG = {
    // Cloudinary Configuration (Recommended)
    cloudinary: {
        cloudName: 'dukgi26uv',        // Replace with your Cloudinary cloud name
        uploadPreset: 'try-on-not-secure',  // Replace with your upload preset name
        enabled: true,                       // Set to true to enable Cloudinary uploads
        folder: 'tryon-images',             // Optional: organize uploads in folders
        maxFileSize: 10 * 1024 * 1024,      // 10MB max file size
        transformation: {
            quality: 'auto',                 // Automatic quality optimization
            fetch_format: 'auto'            // Automatic format optimization
        }
    },

    // Custom Backend Configuration (Alternative)
    customBackend: {
        enabled: false,                      // Set to true to use custom backend
        endpoint: 'http://localhost:8000/upload', // Your backend upload endpoint
        maxFileSize: 10 * 1024 * 1024       // 10MB max file size
    },

    // Imgur Configuration (Alternative)
    imgur: {
        enabled: false,                      // Set to true to use Imgur
        clientId: 'YOUR_IMGUR_CLIENT_ID',   // Replace with your Imgur client ID
        maxFileSize: 10 * 1024 * 1024       // 10MB max file size
    },

    // File Validation Settings
    validation: {
        allowedTypes: [
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/gif',
            'image/webp'
        ],
        maxFileSize: 10 * 1024 * 1024,      // 10MB in bytes
        minWidth: 100,                       // Minimum image width
        minHeight: 100,                      // Minimum image height
        maxWidth: 4000,                      // Maximum image width
        maxHeight: 4000                      // Maximum image height
    },

    // UI Configuration
    ui: {
        showPreview: true,                   // Show image previews after selection
        showUploadedUrl: true,              // Show uploaded URLs in UI
        showProgress: true,                  // Show upload progress
        autoUpload: false                    // Upload immediately on file selection
    },

    // Debug Configuration
    debug: {
        enabled: true,                       // Enable debug logging
        logUploads: true,                   // Log upload events
        logErrors: true,                    // Log error events
        logValidation: false                // Log validation events
    },

    // Fallback Configuration
    fallback: {
        enabled: true,                      // Enable fallback to temporary hosting
        service: 'temp-url'                 // Fallback service name
    }
};

// Helper function to check if Cloudinary is properly configured
window.isCloudinaryConfigured = function() {
    const config = window.IMAGE_UPLOAD_CONFIG.cloudinary;
    return config.enabled && 
           config.cloudName && 
           config.cloudName !== 'YOUR_CLOUD_NAME' &&
           config.uploadPreset && 
           config.uploadPreset !== 'YOUR_UPLOAD_PRESET';
};

// Helper function to get current upload service
window.getCurrentUploadService = function() {
    if (window.isCloudinaryConfigured()) {
        return 'cloudinary';
    } else if (window.IMAGE_UPLOAD_CONFIG.customBackend.enabled) {
        return 'custom-backend';
    } else if (window.IMAGE_UPLOAD_CONFIG.imgur.enabled) {
        return 'imgur';
    } else if (window.IMAGE_UPLOAD_CONFIG.fallback.enabled) {
        return 'fallback';
    }
    return 'none';
};

console.log('Image upload configuration loaded. Current service:', window.getCurrentUploadService());