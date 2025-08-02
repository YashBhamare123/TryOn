/**
 * Cloudinary Image Upload Service
 * Handles image uploads to Cloudinary and returns URLs
 */
class ImageUploadService {
    constructor() {
        this.config = window.IMAGE_UPLOAD_CONFIG || {};
        this.cloudinaryConfig = this.config.cloudinary || {};
        this.isConfigured = false;
        this.uploadedImages = {
            subjectImageUrl: null,
            clothingImageUrl: null
        };
        
        this.init();
    }

    init() {
        // Check if Cloudinary is enabled and configured
        if (this.cloudinaryConfig.enabled && 
            this.cloudinaryConfig.cloudName && 
            this.cloudinaryConfig.cloudName !== 'YOUR_CLOUD_NAME' &&
            this.cloudinaryConfig.uploadPreset && 
            this.cloudinaryConfig.uploadPreset !== 'YOUR_UPLOAD_PRESET') {
            this.isConfigured = true;
            this.log('Cloudinary service initialized successfully');
        } else {
            this.log('Cloudinary not configured. Please update config.js with your credentials.');
        }
    }

    /**
     * Configure Cloudinary credentials programmatically
     */
    configureCloudinary(cloudName, uploadPreset) {
        this.cloudinaryConfig.cloudName = cloudName;
        this.cloudinaryConfig.uploadPreset = uploadPreset;
        this.cloudinaryConfig.enabled = true;
        this.isConfigured = true;
        this.log(`Cloudinary configured: ${cloudName}/${uploadPreset}`);
    }

    /**
     * Validate image file before upload
     */
    validateImageFile(file) {
        const validation = this.config.validation || {};
        
        // Check file type
        const allowedTypes = validation.allowedTypes || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
        }

        // Check file size
        const maxSize = validation.maxFileSize || 10 * 1024 * 1024; // 10MB default
        if (file.size > maxSize) {
            throw new Error(`File too large. Maximum size: ${this.formatFileSize(maxSize)}`);
        }

        return true;
    }

    /**
     * Upload image to Cloudinary
     */
    async uploadImage(file, type = 'image') {
        try {
            // Validate file first
            this.validateImageFile(file);

            if (!this.isConfigured) {
                throw new Error('Cloudinary not configured. Please set up your credentials in config.js');
            }

            this.log(`Starting upload for ${type}:`, file.name);

            // Create FormData for Cloudinary upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);
            
            // Optional: Add folder organization
            if (this.cloudinaryConfig.folder) {
                formData.append('folder', this.cloudinaryConfig.folder);
            }

            // Optional: Add transformation parameters
            if (this.cloudinaryConfig.transformation) {
                const transformation = this.cloudinaryConfig.transformation;
                if (transformation.quality) {
                    formData.append('quality', transformation.quality);
                }
                if (transformation.fetch_format) {
                    formData.append('fetch_format', transformation.fetch_format);
                }
            }

            // Add tags for organization
            formData.append('tags', `tryon,${type},frontend-upload`);

            // Upload to Cloudinary
            const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`;
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
            }

            const result = await response.json();
            
            // Store the uploaded URL
            if (type === 'subject') {
                this.uploadedImages.subjectImageUrl = result.secure_url;
            } else if (type === 'clothing') {
                this.uploadedImages.clothingImageUrl = result.secure_url;
            }

            this.log(`Upload successful for ${type}:`, result.secure_url);
            
            return {
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
                type: type
            };

        } catch (error) {
            this.logError(`Upload failed for ${type}:`, error);
            throw error;
        }
    }

    /**
     * Upload image with progress tracking
     */
    async uploadImageWithProgress(file, type = 'image', onProgress = null) {
        try {
            this.validateImageFile(file);

            if (!this.isConfigured) {
                throw new Error('Cloudinary not configured. Please set up your credentials in config.js');
            }

            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);
                
                if (this.cloudinaryConfig.folder) {
                    formData.append('folder', this.cloudinaryConfig.folder);
                }
                
                formData.append('tags', `tryon,${type},frontend-upload`);

                const xhr = new XMLHttpRequest();
                
                // Track upload progress
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable && onProgress) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress(percentComplete, e.loaded, e.total);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        try {
                            const result = JSON.parse(xhr.responseText);
                            
                            // Store the uploaded URL
                            if (type === 'subject') {
                                this.uploadedImages.subjectImageUrl = result.secure_url;
                            } else if (type === 'clothing') {
                                this.uploadedImages.clothingImageUrl = result.secure_url;
                            }

                            this.log(`Upload successful for ${type}:`, result.secure_url);
                            
                            resolve({
                                url: result.secure_url,
                                publicId: result.public_id,
                                width: result.width,
                                height: result.height,
                                format: result.format,
                                bytes: result.bytes,
                                type: type
                            });
                        } catch (parseError) {
                            reject(new Error('Failed to parse upload response'));
                        }
                    } else {
                        reject(new Error(`Upload failed with status: ${xhr.status}`));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Upload failed due to network error'));
                });

                const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`;
                xhr.open('POST', uploadUrl);
                xhr.send(formData);
            });

        } catch (error) {
            this.logError(`Upload failed for ${type}:`, error);
            throw error;
        }
    }

    /**
     * Get uploaded image URLs
     */
    getUploadedUrls() {
        return { ...this.uploadedImages };
    }

    /**
     * Clear uploaded images
     */
    clearUploadedImages() {
        this.uploadedImages = {
            subjectImageUrl: null,
            clothingImageUrl: null
        };
        this.log('Uploaded images cleared');
    }

    /**
     * Generate optimized URL with transformations
     */
    getOptimizedUrl(publicId, options = {}) {
        if (!this.isConfigured) {
            throw new Error('Cloudinary not configured');
        }

        const baseUrl = `https://res.cloudinary.com/${this.cloudinaryConfig.cloudName}/image/upload`;
        
        const transformations = [];
        
        if (options.width) transformations.push(`w_${options.width}`);
        if (options.height) transformations.push(`h_${options.height}`);
        if (options.crop) transformations.push(`c_${options.crop}`);
        if (options.quality) transformations.push(`q_${options.quality}`);
        if (options.format) transformations.push(`f_${options.format}`);
        
        const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';
        
        return `${baseUrl}/${transformString}${publicId}`;
    }

    /**
     * Utility functions
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    log(...args) {
        if (this.config.debug?.enabled && this.config.debug?.logUploads) {
            console.log('[ImageUploadService]', ...args);
        }
    }

    logError(...args) {
        if (this.config.debug?.enabled && this.config.debug?.logErrors) {
            console.error('[ImageUploadService]', ...args);
        }
    }
}

// Make service available globally
window.ImageUploadService = ImageUploadService;