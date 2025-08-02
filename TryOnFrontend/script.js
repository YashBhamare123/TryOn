function updateScrollAnimations() {
    const shape = document.getElementById('floatingShape');
    const curtainLeft = document.querySelector('.curtain-left');
    const curtainRight = document.querySelector('.curtain-right');
    const backgroundLayer = document.getElementById('backgroundLayer');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (!shape || !curtainLeft || !curtainRight || !backgroundLayer || !heroContent || !scrollIndicator) return;

    const scrollY = window.scrollY;

    if (scrollY > 0) {
        shape.style.animation = 'none';
    } else {
        shape.style.animation = 'float 6s ease-in-out infinite';
    }

    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / pageHeight;

    // Animate floating shape - make it wider as we scroll
    const rotationX = scrollProgress * 360;
    const rotationY = scrollProgress * 180;
    const scale = 1 + (scrollProgress * 0.5);
    const scaleX = 1 + (scrollProgress * 2); // Make it wider on X axis
    const scaleY = 1 + (scrollProgress * 0.3); // Slightly taller on Y axis
    
    // Calculate opacity fade-out based on scroll progress
    // Cube starts fading at 0% scroll and is fully transparent at 100% scroll
    const opacity = Math.max(0, 1 - scrollProgress);
    
    shape.style.transform = `
        translate(-50%, -50%)
        rotateX(${rotationX}deg)
        rotateY(${rotationY}deg)
        scale3d(${Math.min(scaleX, 3)}, ${Math.min(scaleY, 1.8)}, ${Math.min(scale, 1.5)})
    `;
    
    // Apply opacity to each face individually to maintain 3D effect
    const faces = shape.querySelectorAll('.shape-face');
    faces.forEach(face => {
        face.style.opacity = opacity;
    });

    // Animate curtains - start opening immediately when scrolling
    const animationEndScroll = 500; // Pixels to scroll to fully open curtains
    let curtainScale = 1 - (scrollY / animationEndScroll);
    curtainScale = Math.max(0, Math.min(1, curtainScale)); // Clamp between 0 and 1

    curtainLeft.style.transform = `scaleX(${curtainScale})`;
    curtainRight.style.transform = `scaleX(${curtainScale})`;

    if (curtainScale === 0) {
        backgroundLayer.classList.add('visible');
    } else {
        backgroundLayer.classList.remove('visible');
    }

    // Animate hero content fade out
    const heroFadeStart = 100; // Start fading out after 100px scroll
    const heroFadeEnd = 300; // Fully faded out by 300px scroll

    if (scrollY > heroFadeStart) {
        const fadeProgress = Math.min(1, (scrollY - heroFadeStart) / (heroFadeEnd - heroFadeStart));
        heroContent.style.opacity = 1 - fadeProgress;
        heroContent.style.transform = `translateY(${-50 * fadeProgress}px)`;
        scrollIndicator.style.opacity = 1 - fadeProgress;
        scrollIndicator.style.transform = `translateX(-50%) translateY(${-20 * fadeProgress}px)`;
    } else {
        heroContent.style.opacity = 1;
        heroContent.style.transform = 'translateY(0px)';
        scrollIndicator.style.opacity = 1;
        scrollIndicator.style.transform = 'translateX(-50%) translateY(0px)';
    }
}

// Scroll-based fade-in animations for fixed sections
function setupScrollAnimations() {
    const inputSection = document.getElementById('inputSection');
    const outputSection = document.getElementById('outputSection');
    
    if (inputSection && outputSection) {
        // Start with sections invisible
        inputSection.style.opacity = '0';
        outputSection.style.opacity = '0';
        inputSection.style.transition = 'opacity 1.5s ease-out';
        outputSection.style.transition = 'opacity 1.5s ease-out';
    }
}

// Function to handle scroll-based fade-in based on cube opacity
function handleScrollFadeIn() {
    const inputSection = document.getElementById('inputSection');
    const outputSection = document.getElementById('outputSection');
    const generateBtn = document.getElementById('generateBtn');
    const shape = document.getElementById('floatingShape');
    
    if (!inputSection || !outputSection || !generateBtn || !shape) return;
    
    // Calculate cube opacity (same logic as in updateScrollAnimations)
    const scrollY = window.scrollY;
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / pageHeight;
    const cubeOpacity = Math.max(0, 1 - scrollProgress);
    
    // Only start showing containers when cube opacity drops below threshold
    const cubeOpacityThreshold = 0.1; // Lower threshold - containers appear when cube is almost gone
    
    if (cubeOpacity <= cubeOpacityThreshold) {
        // Calculate how much the cube has faded beyond the threshold
        const fadeProgress = (cubeOpacityThreshold - cubeOpacity) / cubeOpacityThreshold;
        
        // Fade in input section first
        const inputOpacity = Math.min(1, fadeProgress * 1.5);
        inputSection.style.opacity = inputOpacity;
        const inputX = window.innerWidth * -0.06; // Input horizontal position - MODIFY THIS (-0.1 = 10% left)
        const inputY = window.innerHeight * 0.25; // Input vertical offset - MODIFY THIS
        inputSection.style.transform = `translateX(${inputX}px) translateY(${inputY}px)`;
        
        // Fade in output section with a slight delay
        const outputFadeProgress = Math.max(0, fadeProgress - 0.3);
        const outputOpacity = Math.min(1, outputFadeProgress * 1.5);
        outputSection.style.opacity = outputOpacity;
        const outputX = window.innerWidth * 0.057; // Output horizontal position - MODIFY THIS (0.1 = 10% right)
        const outputY = window.innerHeight * 0.25; // Output vertical offset - MODIFY THIS
        outputSection.style.transform = `translateX(${outputX}px) translateY(${outputY}px)`;
        
        // Position the "Try It On" button
        const buttonOpacity = Math.min(1, fadeProgress * 1.2);
        generateBtn.style.opacity = buttonOpacity;
        const buttonX = window.innerWidth * 0; // Button horizontal position - MODIFY THIS (0 = center)
        const buttonY = window.innerHeight * 0.06; // Button vertical position - MODIFY THIS (0.2 = 20% down)
        generateBtn.style.transform = `translateX(${buttonX}px) translateY(${buttonY}px)`;
    } else {
        // Keep sections invisible and positioned
        inputSection.style.opacity = '0';
        const inputX = window.innerWidth * -0.1; // Same horizontal position when hidden
        const inputY = 0; // Same vertical offset when hidden
        inputSection.style.transform = `translateX(${inputX}px) translateY(${inputY}px)`;
        
        outputSection.style.opacity = '0';
        const outputX = window.innerWidth * 0.1; // Same horizontal position when hidden
        const outputY = 0; // Same vertical offset when hidden
        outputSection.style.transform = `translateX(${outputX}px) translateY(${outputY}px)`;
        
        // Keep button hidden and positioned
        generateBtn.style.opacity = '0';
        const buttonX = window.innerWidth * 0; // Same horizontal position when hidden
        const buttonY = window.innerHeight * 0.2; // Same vertical position when hidden
        generateBtn.style.transform = `translateX(${buttonX}px) translateY(${buttonY}px)`;
    }
}

// Mock image generation
async function generateImage() {
    const fileInput = document.getElementById('file-input');
    const fileInputClothing = document.getElementById('file-input-clothing');
    const generateBtn = document.getElementById('generateBtn');
    const placeholder = document.getElementById('placeholder');
    const loadingAnimation = document.getElementById('loadingAnimation');
    const imageContainer = document.getElementById('imageContainer');
    const downloadBtn = document.getElementById('downloadBtn');
    const stylistNotes = document.getElementById('stylistNotes');

    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please upload your photo first.');
        return;
    }

    if (!fileInputClothing.files || fileInputClothing.files.length === 0) {
        alert('Please upload a clothing item first.');
        return;
    }

    // Start loading state
    generateBtn.textContent = 'Uploading...';
    generateBtn.classList.add('loading');
    generateBtn.disabled = true;
    placeholder.style.display = 'none';
    loadingAnimation.classList.add('active');
    downloadBtn.classList.remove('visible');
    stylistNotes.classList.remove('visible');

    const existingImg = imageContainer.querySelector('.generated-image');
    if (existingImg) {
        existingImg.remove();
    }

    try {
        // Initialize Cloudinary image upload service
        const imageUploadService = new ImageUploadService();
        window.imageUploadService = imageUploadService; // Store globally for access
        
        const userImageFile = fileInput.files[0];
        const clothingImageFile = fileInputClothing.files[0];

        generateBtn.textContent = 'Uploading your photo to Cloudinary...';
        const userImageResult = await imageUploadService.uploadImageWithProgress(
            userImageFile, 
            'subject',
            (progress) => {
                generateBtn.textContent = `Uploading photo... ${Math.round(progress)}%`;
            }
        );
        
        generateBtn.textContent = 'Uploading clothing item to Cloudinary...';
        const clothingImageResult = await imageUploadService.uploadImageWithProgress(
            clothingImageFile, 
            'clothing',
            (progress) => {
                generateBtn.textContent = `Uploading clothing... ${Math.round(progress)}%`;
            }
        );

        console.log('User image Cloudinary URL:', userImageResult.url);
        console.log('Clothing image Cloudinary URL:', clothingImageResult.url);
        
        // Store URLs globally for access
        window.uploadedImages = {
            subjectImageUrl: userImageResult.url,
            clothingImageUrl: clothingImageResult.url
        };

        // Show uploaded URLs in UI
        showUploadedUrl(userImageResult.url, 'subject');
        showUploadedUrl(clothingImageResult.url, 'clothing');

        generateBtn.textContent = 'Sending to try-on service...';
        
        // Encode URLs for GET request parameters
        const encodedSubjectUrl = encodeURIComponent(userImageResult.url);
        const encodedClothesUrl = encodeURIComponent(clothingImageResult.url);
        
        // Send GET request to your main.py backend
        const backendUrl = `http://127.0.0.1:8100/output?subject_url=${encodedSubjectUrl}&clothes_url=${encodedClothesUrl}`;
        
        console.log('Sending request to backend:', backendUrl);
        
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Backend request failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        const resultImageUrls = result.imageUrl;

        console.log('Received image URLs from backend:', resultImageUrls);
        
        // Handle both single URL (string) and multiple URLs (array)
        const imageUrls = Array.isArray(resultImageUrls) ? resultImageUrls : [resultImageUrls];
        
        if (!imageUrls.length || !imageUrls.every(url => {
            const cleanUrl = url.replace(/^"|"$/g, '');
            return cleanUrl && cleanUrl.startsWith('http');
        })) {
            throw new Error('Invalid image URLs received from backend');
        }

        // Store all generated image URLs globally
        window.generatedImageUrls = imageUrls.map(url => url.replace(/^"|"$/g, ''));
        
        loadingAnimation.classList.remove('active');
        
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = ''; 
        
        // Create grid container for multiple images
        const gridContainer = document.createElement('div');
        gridContainer.className = 'image-grid';
        
        let loadedImages = 0;
        const totalImages = imageUrls.length;
        
        imageUrls.forEach((imageUrl, index) => {
            const cleanImageUrl = imageUrl.replace(/^"|"$/g, '');
            
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            
            const img = document.createElement('img');
            img.src = cleanImageUrl;
            img.className = 'generated-image';
            img.alt = `Virtually styled look ${index + 1}`;
            
            const downloadButton = document.createElement('button');
            downloadButton.className = 'image-download-btn';
            downloadButton.innerHTML = '&darr;';
            downloadButton.title = `Download image ${index + 1}`;
            downloadButton.onclick = () => downloadSingleImage(cleanImageUrl, index + 1);
            
            imageItem.appendChild(img);
            imageItem.appendChild(downloadButton);
            gridContainer.appendChild(imageItem);
            
            img.onload = () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    // All images loaded
                    const note = `${totalImages} custom look${totalImages > 1 ? 's have' : ' has'} been generated using AI try-on technology!`;
                    stylistNotes.textContent = note;
                    stylistNotes.classList.add('visible');

                    // Update download button text based on number of images
                    const downloadBtnElement = document.getElementById('downloadBtn');
                    if (totalImages > 1) {
                        downloadBtnElement.textContent = `Save All ${totalImages} Looks`;
                    } else {
                        downloadBtnElement.textContent = 'Save Look';
                    }
                    
                    downloadBtn.classList.add('visible');

                    generateBtn.textContent = 'Try It On';
                    generateBtn.classList.remove('loading');
                    generateBtn.disabled = false;
                    
                    console.log('All images successfully uploaded to Cloudinary and processed');
                }
            };
            
            img.onerror = () => {
                console.error(`Failed to load image ${index + 1}:`, cleanImageUrl);
            };
        });
        
        imageContainer.appendChild(gridContainer);
    } catch (error) {
        console.error('Try-on processing failed:', error);
        alert(`Try-on processing failed: ${error.message}. Please try again.`);
        
        // Log error for debugging
        console.error('Cloudinary upload or processing error:', error);
        
        // Reset UI state
        generateBtn.textContent = 'Try It On';
        generateBtn.classList.remove('loading');
        generateBtn.disabled = false;
        loadingAnimation.classList.remove('active');
        placeholder.style.display = 'block';
    }
}

// Download single image function
function downloadSingleImage(imageUrl, index) {
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `my-new-look-${index}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(() => alert('Could not download the image.'));
}

// Download all images function
function downloadImage() {
    if (window.generatedImageUrls && window.generatedImageUrls.length > 0) {
        if (window.generatedImageUrls.length === 1) {
            // Single image - download directly
            downloadSingleImage(window.generatedImageUrls[0], 1);
        } else {
            // Multiple images - download all
            window.generatedImageUrls.forEach((imageUrl, index) => {
                setTimeout(() => {
                    downloadSingleImage(imageUrl, index + 1);
                }, index * 500); // Stagger downloads by 500ms
            });
        }
    } else if (window.generatedImageData) {
        // Fallback for backward compatibility
        fetch(window.generatedImageData)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'my-new-look.jpg';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(() => alert('Could not download the image.'));
    }
}

// Handle file input appearance
function setupFileInput() {
    const fileInput = document.getElementById('file-input');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileUploadText = document.getElementById('fileUploadText');

    const fileInputClothing = document.getElementById('file-input-clothing');
    const fileUploadAreaClothing = document.getElementById('fileUploadAreaClothing');
    const fileUploadTextClothing = document.getElementById('fileUploadTextClothing');

    fileInput.addEventListener('change', async () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const imageUploadService = new ImageUploadService();
            
            try {
                // Validate file
                imageUploadService.validateImageFile(file);
                
                fileUploadText.textContent = `File selected: ${file.name} (${imageUploadService.formatFileSize(file.size)})`;
                fileUploadArea.classList.add('has-file');
                
                // Show preview
                showImagePreview(file, 'subject');
                
            } catch (error) {
                fileUploadText.textContent = `Error: ${error.message}`;
                fileUploadArea.classList.remove('has-file');
                hideImagePreview('subject');
            }
        } else {
            fileUploadText.textContent = 'Click or drag to upload';
            fileUploadArea.classList.remove('has-file');
            hideImagePreview('subject');
        }
    });

    fileInputClothing.addEventListener('change', async () => {
        if (fileInputClothing.files.length > 0) {
            const file = fileInputClothing.files[0];
            const imageUploadService = new ImageUploadService();
            
            try {
                // Validate file
                imageUploadService.validateImageFile(file);
                
                fileUploadTextClothing.textContent = `File selected: ${file.name} (${imageUploadService.formatFileSize(file.size)})`;
                fileUploadAreaClothing.classList.add('has-file');
                
                // Show preview
                showImagePreview(file, 'clothing');
                
            } catch (error) {
                fileUploadTextClothing.textContent = `Error: ${error.message}`;
                fileUploadAreaClothing.classList.remove('has-file');
                hideImagePreview('clothing');
            }
        } else {
            fileUploadTextClothing.textContent = 'Click or drag to upload';
            fileUploadAreaClothing.classList.remove('has-file');
            hideImagePreview('clothing');
        }
    });
}

// Initialize all animations and interactions
document.addEventListener('DOMContentLoaded', function() {
    setupScrollAnimations();
    setupFileInput();

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollAnimations();
                handleScrollFadeIn();
                ticking = false;
            });
            ticking = true;
        }
    });
});

// Image preview functions
function showImagePreview(file, type) {
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create or update preview
        let previewId = `preview-${type}`;
        let existingPreview = document.getElementById(previewId);
        
        if (existingPreview) {
            existingPreview.remove();
        }
        
        const preview = document.createElement('div');
        preview.id = previewId;
        preview.className = 'image-preview';
        preview.innerHTML = `
            <img src="${e.target.result}" alt="${type} preview" style="max-width: 100px; max-height: 100px; border-radius: 8px; margin-top: 10px; object-fit: cover;">
            <p style="font-size: 12px; color: #666; margin: 5px 0;">Preview</p>
        `;
        
        const uploadArea = type === 'subject' ? 
            document.getElementById('fileUploadArea') : 
            document.getElementById('fileUploadAreaClothing');
        
        uploadArea.appendChild(preview);
    };
    reader.readAsDataURL(file);
}

function hideImagePreview(type) {
    const previewId = `preview-${type}`;
    const existingPreview = document.getElementById(previewId);
    if (existingPreview) {
        existingPreview.remove();
    }
}

function showUploadedUrl(url, type) {
    console.log(`${type} image URL:`, url);
    
    // Add UI element to show the URL
    const urlDisplay = document.createElement('div');
    urlDisplay.className = 'url-display';
    urlDisplay.innerHTML = `
        <p style="font-size: 11px; color: #007bff; margin: 5px 0; word-break: break-all; background: #f8f9fa; padding: 5px; border-radius: 4px;">
            <strong>Uploaded:</strong> <a href="${url}" target="_blank" style="color: #007bff;">${url.substring(0, 50)}...</a>
        </p>
    `;
    
    const uploadArea = type === 'subject' ? 
        document.getElementById('fileUploadArea') : 
        document.getElementById('fileUploadAreaClothing');
    
    // Remove existing URL display
    const existing = uploadArea.querySelector('.url-display');
    if (existing) existing.remove();
    
    uploadArea.appendChild(urlDisplay);
}

// Function to get uploaded image URLs
function getUploadedImageUrls() {
    return window.uploadedImages || {
        subjectImageUrl: null,
        clothingImageUrl: null
    };
}

// Function to clear uploaded images
function clearUploadedImages() {
    window.uploadedImages = {
        subjectImageUrl: null,
        clothingImageUrl: null
    };
    
    // Clear previews
    hideImagePreview('subject');
    hideImagePreview('clothing');
    
    // Clear URL displays
    const urlDisplays = document.querySelectorAll('.url-display');
    urlDisplays.forEach(display => display.remove());
}