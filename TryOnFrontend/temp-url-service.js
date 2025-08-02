/**
 * Temporary URL Service
 * Provides fallback image hosting when other services are not configured
 */
class TempUrlService {
    constructor() {
        this.uploadedImages = new Map();
        this.baseUrl = 'data:image/';
    }

    /**
     * Convert file to data URL (base64)
     */
    async uploadImage(file, type = 'image') {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    const dataUrl = e.target.result;
                    
                    // Store the data URL
                    this.uploadedImages.set(type, dataUrl);
                    
                    console.log(`[TempUrlService] Created temporary URL for ${type}`);
                    
                    resolve({
                        url: dataUrl,
                        type: type,
                        size: file.size,
                        name: file.name,
                        temporary: true
                    });
                };
                
                reader.onerror = () => {
                    reject(new Error('Failed to read file'));
                };
                
                reader.readAsDataURL(file);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Upload with progress simulation
     */
    async uploadImageWithProgress(file, type = 'image', onProgress = null) {
        // Simulate progress for consistency with other services
        if (onProgress) {
            const intervals = [20, 40, 60, 80, 100];
            for (let i = 0; i < intervals.length; i++) {
                setTimeout(() => {
                    onProgress(intervals[i]);
                }, i * 100);
            }
        }
        
        return this.uploadImage(file, type);
    }

    /**
     * Get uploaded URLs
     */
    getUploadedUrls() {
        return {
            subjectImageUrl: this.uploadedImages.get('subject') || null,
            clothingImageUrl: this.uploadedImages.get('clothing') || null
        };
    }

    /**
     * Clear uploaded images
     */
    clearUploadedImages() {
        this.uploadedImages.clear();
        console.log('[TempUrlService] Cleared temporary URLs');
    }

    /**
     * Check if service is available
     */
    isAvailable() {
        return true; // Always available as fallback
    }
}

// Make service available globally
window.TempUrlService = TempUrlService;

/**
 * Enhanced ImageUploadService with fallback support
 */
class EnhancedImageUploadService extends ImageUploadService {
    constructor() {
        super();
        this.tempUrlService = new TempUrlService();
        this.currentService = this.determineService();
        
        console.log(`[EnhancedImageUploadService] Using service: ${this.currentService}`);
    }

    determineService() {
        if (this.isConfigured) {
            return 'cloudinary';
        } else if (window.IMAGE_UPLOAD_CONFIG?.customBackend?.enabled) {
            return 'custom-backend';
        } else if (window.IMAGE_UPLOAD_CONFIG?.imgur?.enabled) {
            return 'imgur';
        } else {
            return 'temp-url';
        }
    }

    async uploadImage(file, type = 'image') {
        try {
            // Try primary service first
            if (this.currentService === 'cloudinary' && this.isConfigured) {
                return await super.uploadImage(file, type);
            } else if (this.currentService === 'custom-backend') {
                return await this.uploadToCustomBackend(file, type);
            } else if (this.currentService === 'imgur') {
                return await this.uploadToImgur(file, type);
            } else {
                // Fallback to temporary URLs
                console.warn('[EnhancedImageUploadService] Using temporary URLs as fallback');
                return await this.tempUrlService.uploadImage(file, type);
            }
        } catch (error) {
            console.warn('[EnhancedImageUploadService] Primary service failed, falling back to temp URLs:', error.message);
            return await this.tempUrlService.uploadImage(file, type);
        }
    }

    async uploadImageWithProgress(file, type = 'image', onProgress = null) {
        try {
            if (this.currentService === 'cloudinary' && this.isConfigured) {
                return await super.uploadImageWithProgress(file, type, onProgress);
            } else {
                return await this.tempUrlService.uploadImageWithProgress(file, type, onProgress);
            }
        } catch (error) {
            console.warn('[EnhancedImageUploadService] Primary service failed, falling back to temp URLs:', error.message);
            return await this.tempUrlService.uploadImageWithProgress(file, type, onProgress);
        }
    }

    async uploadToCustomBackend(file, type) {
        const config = window.IMAGE_UPLOAD_CONFIG.customBackend;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await fetch(config.endpoint, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Custom backend upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return {
            url: result.url,
            type: type,
            service: 'custom-backend'
        };
    }

    async uploadToImgur(file, type) {
        const config = window.IMAGE_UPLOAD_CONFIG.imgur;
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${config.clientId}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Imgur upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return {
            url: result.data.link,
            type: type,
            service: 'imgur'
        };
    }

    getServiceStatus() {
        return {
            current: this.currentService,
            cloudinaryConfigured: this.isConfigured,
            fallbackAvailable: this.tempUrlService.isAvailable()
        };
    }
}

// Replace the global ImageUploadService with enhanced version
window.ImageUploadService = EnhancedImageUploadService;