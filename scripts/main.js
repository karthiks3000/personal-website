// Main JavaScript file for Personal Website Template

// Contact form handler - Sends form data to AWS Lambda
// Lambda URL is now configured in data.js contactConfig
let LAMBDA_URL = '';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Personal Website Template - Initializing...');
    
    // Load configuration from data.js
    loadTemplateConfiguration();
    
    // Add error boundary
    setupErrorBoundary();
    
    // Check for JavaScript support
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
    
    // Initialize AI feature detection handling
    initAIFeatureHandling();
    
    // Initialize AI chat message handling
    initAIChatHandling();
    
    // Initialize personal card modal handling
    initPersonalCardModal();
    
    // Initialize performance-aware components
    initializeWithPerformanceCheck();
});

// Load template configuration from data.js
function loadTemplateConfiguration() {
    // Load contact form configuration
    if (typeof contactConfig !== 'undefined') {
        LAMBDA_URL = contactConfig.lambdaUrl || '';
        
        // Update message field max length if configured
        const messageField = document.getElementById('message');
        if (messageField && contactConfig.maxMessageLength) {
            messageField.setAttribute('maxlength', contactConfig.maxMessageLength);
        }
        
        console.log('✅ Contact form configuration loaded');
    } else {
        console.warn('⚠️ contactConfig not found in data.js - contact form may not work properly');
    }
    
    // Validate required configuration
    if (!LAMBDA_URL && typeof contactConfig !== 'undefined' && contactConfig.enableContactForm) {
        console.warn('⚠️ Contact form is enabled but no Lambda URL provided');
    }
}

// Initialize components with performance considerations
function initializeWithPerformanceCheck() {
    // Wait for performance optimizer to be ready
    const initComponents = () => {
        const isLowEndDevice = window.PerformanceOptimizer?.isLowEndDevice || false;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Initialize accessibility features first (always)
        initAccessibilityFeatures();
        
        // Initialize core functionality
        initMobileMenu();
        initContactForm();
        initThemeToggle();
        initLogoTypewriter();
        initHeroSection();
        updateCopyrightYear();
        
        // Initialize content sections
        initAboutSection();
        initExperienceTimeline();
        initProjectsSection();
        initSkillsSection();
        initArticlesSection();
        initContactSection();
        
        // Initialize animations based on device capabilities
        if (!isLowEndDevice && !prefersReducedMotion) {
            // Full animation experience
            if (window.AnimationUtils) {
                window.AnimationUtils.initAllAnimations();
                window.AnimationUtils.addHoverEffects();
                window.AnimationUtils.initMicroInteractions();
            }
            
            // Initialize AOS (Animate On Scroll)
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: true,
                    offset: 100,
                    disable: function() {
                        return window.innerWidth < 768;
                    }
                });
            }
        } else {
            // Reduced animation experience
            if (window.AnimationUtils) {
                window.AnimationUtils.initBasicAnimations();
            }
            
            // Initialize AOS with reduced settings
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 300,
                    easing: 'ease-out',
                    once: true,
                    offset: 50,
                    disable: true // Disable on low-end devices
                });
            }
        }
        
        // Initialize responsive optimizations
        initResponsiveOptimizations();
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log('Website initialization complete!');
    };
    
    // Check if performance optimizer is ready
    if (window.PerformanceOptimizer) {
        initComponents();
    } else {
        // Wait a bit for performance optimizer to load
        setTimeout(initComponents, 100);
    }
}

// Setup error boundary for graceful error handling
function setupErrorBoundary() {
    // Global error handler
    window.addEventListener('error', function(e) {
        // Only handle meaningful errors
        if (e.error && e.message && e.message !== 'Script error.' && e.filename) {
            console.error('JavaScript error:', e.error);
            showErrorBoundary('JavaScript Error', e.message, e.filename, e.lineno);
        }
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        if (e.reason) {
            console.error('Unhandled promise rejection:', e.reason);
            const reasonText = typeof e.reason === 'string' ? e.reason : 'Promise rejection occurred';
            showErrorBoundary('Promise Rejection', reasonText);
        }
    });
}

// Show error boundary UI
function showErrorBoundary(type, message, filename = '', lineno = '') {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-boundary';
    errorContainer.innerHTML = `
        <h3>Something went wrong</h3>
        <p>We encountered an error while loading the page. The site should still be functional.</p>
        <details style="margin: 1rem 0; text-align: left;">
            <summary style="cursor: pointer; color: #7f1d1d;">Error Details</summary>
            <pre style="margin-top: 0.5rem; font-size: 12px; color: #7f1d1d;">
Type: ${type}
Message: ${message}
${filename ? `File: ${filename}` : ''}
${lineno ? `Line: ${lineno}` : ''}
            </pre>
        </details>
        <button onclick="this.parentElement.remove()">Dismiss</button>
    `;
    
    // Insert at the top of the page
    const main = document.getElementById('main-content') || document.body;
    main.insertBefore(errorContainer, main.firstChild);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (errorContainer.parentNode) {
            errorContainer.remove();
        }
    }, 10000);
}

// Mobile Menu Toggle with Enhanced Accessibility
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        // Get hamburger and close icons
        const hamburgerIcon = mobileMenuButton.querySelector('svg:first-of-type');
        const closeIcon = mobileMenuButton.querySelector('svg:last-of-type');
        
        // Store focusable elements for focus trapping
        const focusableElements = mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        function openMenu() {
            // Only open menu on mobile devices
            if (window.innerWidth >= 768) {
                return;
            }
            
            mobileMenu.classList.add('show');
            mobileMenu.classList.remove('opacity-0', 'scale-95', '-translate-y-2', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'scale-100', 'translate-y-0');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
            
            // Switch icons
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            
            // Focus first menu item for keyboard users
            setTimeout(() => {
                if (firstFocusableElement) {
                    firstFocusableElement.focus();
                }
            }, 100);
        }
        
        function closeMenu() {
            mobileMenu.classList.remove('show');
            mobileMenu.classList.add('opacity-0', 'scale-95', '-translate-y-2', 'pointer-events-none');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            
            // Switch icons back
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            
            // Return focus to menu button
            mobileMenuButton.focus();
        }
        
        mobileMenuButton.addEventListener('click', function() {
            // Only handle clicks on mobile devices
            if (window.innerWidth >= 768) {
                return;
            }
            
            const isOpen = mobileMenu.classList.contains('show');
            
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Enhanced keyboard navigation for mobile menu
        mobileMenu.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeMenu();
                return;
            }
            
            // Focus trapping
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusableElement) {
                        event.preventDefault();
                        lastFocusableElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusableElement) {
                        event.preventDefault();
                        firstFocusableElement.focus();
                    }
                }
            }
            
            // Arrow key navigation
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
                let nextIndex;
                
                if (event.key === 'ArrowDown') {
                    nextIndex = currentIndex + 1;
                    if (nextIndex >= focusableElements.length) {
                        nextIndex = 0;
                    }
                } else {
                    nextIndex = currentIndex - 1;
                    if (nextIndex < 0) {
                        nextIndex = focusableElements.length - 1;
                    }
                }
                
                focusableElements[nextIndex].focus();
            }
        });
        
        // Close mobile menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                if (mobileMenu.classList.contains('show')) {
                    closeMenu();
                }
            }
        });
        
        // Handle escape key globally
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mobileMenu.classList.contains('show')) {
                closeMenu();
            }
        });
        
        // Close mobile menu when resizing to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768 && mobileMenu.classList.contains('show')) {
                closeMenu();
            }
        });
    }
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        console.log('Initializing contact form...');
        
        // Get form elements
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        const submitBtn = document.getElementById('contact-submit-btn');
        const formMessage = document.getElementById('form-message');
        const messageCounter = document.getElementById('message-counter');
        const messageCount = document.getElementById('message-count');
        
        // Initialize character counter for message field
        if (messageField && messageCounter) {
            messageField.addEventListener('input', function() {
                const count = this.value.length;
                const maxLength = parseInt(this.getAttribute('maxlength'));
                
                messageCount.textContent = count;
                
                // Update counter styling based on character count
                messageCounter.classList.remove('warning', 'danger');
                if (count > maxLength * 0.9) {
                    messageCounter.classList.add('danger');
                } else if (count > maxLength * 0.8) {
                    messageCounter.classList.add('warning');
                }
            });
        }
        
        // Add real-time validation
        [nameField, emailField, messageField].forEach(field => {
            if (field) {
                field.addEventListener('blur', () => validateContactField(field));
                field.addEventListener('input', () => clearContactFieldError(field));
            }
        });
        
        // Handle form submission
        contactForm.addEventListener('submit', handleContactFormSubmission);
        
        console.log('Contact form initialized successfully');
    }
}

// Initialize form validation
function initFormValidation() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(group => {
        const input = group.querySelector('.form-input');
        const errorElement = group.querySelector('.form-error');
        
        if (input && errorElement) {
            // Add validation on blur
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            // Clear errors on input
            input.addEventListener('input', () => {
                clearFieldError(input);
            });
        }
    });
}

// Validate individual field with enhanced accessibility
function validateField(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    const errorMessage = errorElement.querySelector('.error-message');
    
    let isValid = true;
    let message = '';
    
    // Check if field is required and empty
    if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        message = `Please enter ${input.name === 'name' ? 'your name' : 
                                 input.name === 'email' ? 'your email address' : 
                                 input.name === 'subject' ? 'a subject' : 
                                 'your message'}`;
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    }
    
    // Message length validation
    if (input.name === 'message' && input.value.trim() && input.value.trim().length < 10) {
        isValid = false;
        message = 'Message must be at least 10 characters long';
    }
    
    // Update field state and ARIA attributes
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        input.setAttribute('aria-invalid', 'false');
        formGroup.classList.remove('invalid');
        formGroup.classList.add('valid');
        errorElement.classList.add('hidden');
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        formGroup.classList.remove('valid');
        formGroup.classList.add('invalid');
        errorMessage.textContent = message;
        errorElement.classList.remove('hidden');
        
        // Announce error to screen readers
        announceToScreenReader(`Error in ${input.name} field: ${message}`);
    }
    
    return isValid;
}

// Clear field error state with accessibility updates
function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    if (input.value.trim()) {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');
        formGroup.classList.remove('invalid');
        errorElement.classList.add('hidden');
    }
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('#contact-submit');
    const submitText = submitButton.querySelector('.submit-text');
    const submitIcon = submitButton.querySelector('.submit-icon');
    const submitSpinner = submitButton.querySelector('.submit-spinner');
    
    // Validate all fields
    const formInputs = form.querySelectorAll('.form-input');
    let isFormValid = true;
    
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showFormMessage('Please correct the errors above.', 'error');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.classList.add('submit-button-loading');
    submitText.textContent = 'Sending...';
    submitIcon.classList.add('hidden');
    submitSpinner.classList.remove('hidden');
    
    // Get form data
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    // Simulate form submission (replace with actual form handling)
    // In a real implementation, you would send this to your backend
    setTimeout(() => {
        // Reset button state
        submitButton.disabled = false;
        submitButton.classList.remove('submit-button-loading');
        submitText.textContent = 'Send Message';
        submitIcon.classList.remove('hidden');
        submitSpinner.classList.add('hidden');
        
        // Show success message
        showFormMessage('success');
        
        // Reset form
        form.reset();
        
        // Clear all validation states
        formInputs.forEach(input => {
            input.classList.remove('success', 'error');
            const formGroup = input.closest('.form-group');
            formGroup.classList.remove('valid', 'invalid');
            const errorElement = formGroup.querySelector('.form-error');
            errorElement.classList.add('hidden');
        });
        
        // Log form data (for development)
        console.log('Contact form submitted:', contactData);
        
    }, 2000);
}

// Show form messages
function showFormMessage(type) {
    const successElement = document.getElementById('form-success');
    const errorElement = document.getElementById('form-error');
    
    // Hide both messages first
    successElement.classList.add('hidden');
    errorElement.classList.add('hidden');
    
    // Show appropriate message
    if (type === 'success') {
        successElement.classList.remove('hidden');
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
            successElement.classList.add('hidden');
        }, 5000);
    } else {
        errorElement.classList.remove('hidden');
        
        // Auto-hide error message after 5 seconds
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 5000);
    }
}

// Populate contact social links
function populateContactSocialLinks() {
    const socialLinksContainer = document.getElementById('contact-social-links');
    
    if (socialLinksContainer && typeof socialLinks !== 'undefined') {
        socialLinksContainer.innerHTML = socialLinks.map(link => `
            <a href="${link.url}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="contact-social-link ${link.platform.toLowerCase()}"
               aria-label="Connect on ${link.platform}"
               title="Connect on ${link.platform}">
                <div class="flex flex-col items-center space-y-2">
                    <div class="w-10 h-10 flex items-center justify-center">
                        <i data-lucide="${link.icon}" class="w-6 h-6"></i>
                    </div>
                    <span class="text-sm font-medium">${link.platform}</span>
                </div>
            </a>
        `).join('');
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Contact Form Validation Functions
function validateContactField(field) {
    if (!field) return false;
    
    const fieldName = field.getAttribute('name');
    const fieldValue = field.value.trim();
    const fieldType = field.getAttribute('type');
    const isRequired = field.hasAttribute('required');
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (isRequired && !fieldValue) {
        isValid = false;
        errorMessage = `Please enter ${
            fieldName === 'name' ? 'your name' :
            fieldName === 'email' ? 'your email address' :
            fieldName === 'message' ? 'your message' : fieldName
        }`;
    }
    // Email validation
    else if (fieldType === 'email' && fieldValue && !isValidEmail(fieldValue)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    // Name validation (only letters, spaces, hyphens, apostrophes)
    else if (fieldName === 'name' && fieldValue && !/^[a-zA-Z\s\-']+$/.test(fieldValue)) {
        isValid = false;
        errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    // Name length validation
    else if (fieldName === 'name' && fieldValue && fieldValue.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long';
    }
    // Message length validation
    else if (fieldName === 'message' && fieldValue && fieldValue.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
    }
    
    // Update field error display
    updateFieldError(field, isValid, errorMessage);
    
    return isValid;
}

function clearContactFieldError(field) {
    if (!field) return;
    
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (field.value.trim()) {
        // Clear error styling
        field.classList.remove('border-red-400');
        field.setAttribute('aria-invalid', 'false');
        
        // Hide error message
        if (errorElement) {
            errorElement.classList.add('hidden');
            errorElement.textContent = '';
        }
    }
}

function updateFieldError(field, isValid, errorMessage) {
    if (!field) return;
    
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (isValid) {
        // Remove error styling
        field.classList.remove('border-red-400');
        field.classList.add('border-green-400');
        field.setAttribute('aria-invalid', 'false');
        
        // Hide error message
        if (errorElement) {
            errorElement.classList.add('hidden');
            errorElement.textContent = '';
        }
    } else {
        // Add error styling
        field.classList.remove('border-green-400');
        field.classList.add('border-red-400');
        field.setAttribute('aria-invalid', 'true');
        
        // Show error message
        if (errorElement) {
            errorElement.classList.remove('hidden');
            errorElement.textContent = errorMessage;
        }
        
        // Announce error to screen readers
        announceToScreenReader(`Error in ${field.getAttribute('name')} field: ${errorMessage}`, 'assertive');
    }
}

async function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('contact-submit-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitIcon = submitBtn.querySelector('.submit-icon');
    const loadingSpinner = submitBtn.querySelector('.loading-spinner');
    const formMessage = document.getElementById('form-message');
    const submitStatus = document.getElementById('submit-status');
    
    // Get form fields
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    
    // Validate all fields
    let isFormValid = true;
    const fieldsToValidate = [nameField, emailField, messageField].filter(Boolean);
    
    fieldsToValidate.forEach(field => {
        if (!validateContactField(field)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showContactFormMessage('Please correct the errors above and try again.', 'error');
        announceToScreenReader('Form contains errors. Please correct them and try again.', 'assertive');
        return;
    }
    
    // Show loading state
    setSubmitButtonLoading(true);
    announceToScreenReader('Sending message...', 'polite');
    
    // Collect form data
    const formData = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        message: messageField.value.trim(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    try {
        // Send form data to AWS Lambda
        const response = await fetch(LAMBDA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Success state
            setSubmitButtonLoading(false);
            showContactFormMessage(
                'Message sent successfully! Thank you for reaching out.',
                'success'
            );
        } else {
            throw new Error('Failed to send message. Please try again.');
        }
        
        // Reset form
        form.reset();
        
        // Clear character counter
        const messageCount = document.getElementById('message-count');
        if (messageCount) {
            messageCount.textContent = '0';
        }
        
        // Clear validation states
        fieldsToValidate.forEach(field => {
            field.classList.remove('border-red-400', 'border-green-400');
            field.setAttribute('aria-invalid', 'false');
            const errorElement = document.getElementById(`${field.id}-error`);
            if (errorElement) {
                errorElement.classList.add('hidden');
                errorElement.textContent = '';
            }
        });
        
        // Announce success
        announceToScreenReader('Message sent successfully! Thank you for contacting me.', 'polite');
        
        // Focus on the form message for screen readers
        if (formMessage) {
            formMessage.focus();
        }
        
        console.log('Contact form submitted successfully:', formData);
        
    } catch (error) {
        console.error('Contact form submission error:', error);
        
        const contactEmail = (typeof contactConfig !== 'undefined' && contactConfig.contactEmail) ? 
                            contactConfig.contactEmail : 
                            (typeof personalInfo !== 'undefined' && personalInfo.email) ? personalInfo.email : 'me';
        
        setSubmitButtonLoading(false);
        showContactFormMessage(
            `Sorry, there was an error sending your message. Please try again or contact me directly at ${contactEmail}`,
            'error'
        );
        announceToScreenReader('Error sending message. Please try again.', 'assertive');
    }
}

function setSubmitButtonLoading(isLoading) {
    const submitBtn = document.getElementById('contact-submit-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitIcon = submitBtn.querySelector('.submit-icon');
    const loadingSpinner = submitBtn.querySelector('.loading-spinner');
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitText.textContent = 'Sending...';
        
        if (submitIcon) submitIcon.classList.add('hidden');
        if (loadingSpinner) loadingSpinner.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitText.textContent = 'Send Message';
        
        if (submitIcon) submitIcon.classList.remove('hidden');
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
    }
}

function showContactFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (!formMessage) return;
    
    // Set message content and type
    formMessage.textContent = message;
    formMessage.className = `form-message ${type} mb-6`;
    formMessage.classList.remove('hidden');
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 8000);
}


// Enhanced accessibility announcements
function announceToScreenReader(message, priority = 'polite') {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.setAttribute('aria-live', priority);
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Form validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form messages (legacy support)
function showFormMessage(message, type) {
    showContactFormMessage(message, type);
}

// Theme Toggle with Enhanced Accessibility
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update ARIA states
        const isDark = newTheme === 'dark';
        const ariaLabel = `Switch to ${isDark ? 'light' : 'dark'} theme`;
        
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', isDark.toString());
            themeToggle.setAttribute('aria-label', ariaLabel);
        }
        if (mobileThemeToggle) {
            mobileThemeToggle.setAttribute('aria-pressed', isDark.toString());
            mobileThemeToggle.setAttribute('aria-label', ariaLabel);
        }
        
        // Update button icons if using Lucide icons
        if (typeof lucide !== 'undefined') {
            const icon = newTheme === 'dark' ? 'sun' : 'moon';
            
            if (themeToggle) {
                themeToggle.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5" aria-hidden="true"></i>`;
            }
            if (mobileThemeToggle) {
                mobileThemeToggle.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5 mr-2" aria-hidden="true"></i><span>Toggle Theme</span>`;
            }
            
            lucide.createIcons();
        }
        
        // Announce theme change to screen readers
        announceToScreenReader(`Switched to ${newTheme} theme`);
    }
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Initialize ARIA states and icons
    const isDark = currentTheme === 'dark';
    const ariaLabel = `Switch to ${isDark ? 'light' : 'dark'} theme`;
    
    if (typeof lucide !== 'undefined') {
        const icon = currentTheme === 'dark' ? 'sun' : 'moon';
        
        if (themeToggle) {
            themeToggle.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5" aria-hidden="true"></i>`;
            themeToggle.setAttribute('aria-pressed', isDark.toString());
            themeToggle.setAttribute('aria-label', ariaLabel);
        }
        if (mobileThemeToggle) {
            mobileThemeToggle.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5 mr-2" aria-hidden="true"></i><span>Toggle Theme</span>`;
            mobileThemeToggle.setAttribute('aria-pressed', isDark.toString());
            mobileThemeToggle.setAttribute('aria-label', ariaLabel);
        }
    }
    
    // Add event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        // Add keyboard support
        themeToggle.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleTheme();
            }
        });
    }
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
        // Add keyboard support
        mobileThemeToggle.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleTheme();
            }
        });
    }
}

// Initialize logo typewriter effect
function initLogoTypewriter() {
    const logoElement = document.getElementById('logo-typewriter');
    if (logoElement && window.AnimationUtils) {
        // Use dynamic name from personalInfo
        const userName = (typeof personalInfo !== 'undefined' && personalInfo.name) ? personalInfo.name : 'Your Name';
        // Add a slight delay before starting the typewriter effect
        setTimeout(() => {
            window.AnimationUtils.typewriterEffect(logoElement, userName, 80);
        }, 500);
    }
}

// Initialize word rotation animation
function initWordRotation() {
    const rotatingElement = document.getElementById('rotating-word');
    if (!rotatingElement) {
        console.warn('Rotating word element not found');
        return;
    }
    
    // Configuration
    const words = ['Javaphile', 'Tech Nerd', 'Drone Pilot'];
    const displayDuration = 2000; // How long each word is displayed (3 seconds)
    const transitionDuration = 500; // How long the fade transition takes (0.5 seconds)
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // For users who prefer reduced motion, just show the first word
        rotatingElement.textContent = words[0];
        rotatingElement.setAttribute('aria-label', `Professional title: ${words[0]}`);
        return;
    }
    
    let currentIndex = 0;
    let rotationInterval;
    let isPaused = false;
    
    // Set initial word
    rotatingElement.textContent = words[currentIndex];
    rotatingElement.setAttribute('aria-label', `Professional title: ${words[currentIndex]} (rotating)`);
    
    // Add CSS for smooth transitions
    rotatingElement.style.transition = `opacity ${transitionDuration}ms ease-in-out`;
    rotatingElement.style.display = 'inline-block';
    
    function changeWord() {
        if (isPaused) return;
        
        // Fade out current word
        rotatingElement.style.opacity = '0';
        
        setTimeout(() => {
            // Change to next word
            currentIndex = (currentIndex + 1) % words.length;
            rotatingElement.textContent = words[currentIndex];
            
            // Update accessibility info
            rotatingElement.setAttribute('aria-label', `Professional title: ${words[currentIndex]} (rotating)`);
            
            // Fade in new word
            rotatingElement.style.opacity = '1';
        }, transitionDuration / 2);
    }
    
    // Start the rotation
    function startRotation() {
        if (rotationInterval) clearInterval(rotationInterval);
        rotationInterval = setInterval(changeWord, displayDuration);
    }
    
    // Stop the rotation
    function stopRotation() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = null;
        }
    }
    
    // Pause/resume on hover for better UX
    rotatingElement.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    rotatingElement.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    // Pause/resume on focus for keyboard users
    rotatingElement.addEventListener('focus', () => {
        isPaused = true;
    });
    
    rotatingElement.addEventListener('blur', () => {
        isPaused = false;
    });
    
    // Handle visibility changes (pause when tab is not visible)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopRotation();
        } else {
            startRotation();
        }
    });
    
    // Start the animation
    startRotation();
    
    // Store cleanup function for potential future use
    window.stopWordRotation = stopRotation;
    
    console.log('Word rotation initialized with words:', words);
}

// Initialize hero section
function initHeroSection() {
    // Initialize particles
    if (window.AnimationUtils) {
        window.AnimationUtils.initParticles();
    }
    
    // Initialize word rotation
    initWordRotation();
    
    // Add smooth scroll behavior for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Add cursor pointer
        scrollIndicator.style.cursor = 'pointer';
    }
    
    // Add subtle parallax effect to hero content
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('#hero .relative.z-10');
        const particles = document.getElementById('particles-js');
        
        if (heroContent && scrolled < window.innerHeight) {
            const rate = scrolled * -0.5;
            heroContent.style.transform = `translateY(${rate}px)`;
        }
        
        if (particles && scrolled < window.innerHeight) {
            const rate = scrolled * -0.3;
            particles.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Update copyright year
function updateCopyrightYear() {
    const copyrightYear = document.getElementById('copyright-year');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }
}

// Utility function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Utility function to calculate reading time
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
        // This would require the web-vitals library
        // For now, we'll just log basic performance metrics
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        });
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// AI Feature Status Handling (simplified for centralized state management)
function initAIFeatureHandling() {
    console.log('🔍 AI feature handling initialized - using centralized state management');
    
    // Hide debug indicator since we're using inline teaser
    const statusIndicator = document.getElementById('ai-status-indicator');
    if (statusIndicator) {
        statusIndicator.classList.add('hidden');
    }
    
    // The actual AI detection is handled by AIStateManager
    // Legacy support for other parts of the code
    window.aiSupported = false; // Will be updated by state manager
}

// Helper function to create AI session using correct LanguageModel API
window.createAISession = async function(options = {}) {
    if (!window.aiSupported) {
        console.log('❌ AI not supported - cannot create session');
        return null;
    }
    
    try {
        console.log('🤖 Creating AI session...');
        
        // Use the AIFeatureDetector if available for proper session creation
        if (window.AIFeatureDetector && window.AIFeatureDetector.isAISupported()) {
            return await window.AIFeatureDetector.createSession(options);
        }
        
        // Fallback to direct LanguageModel API
        const sessionOptions = {};
        
        // Handle initial prompts
        if (options.initialPrompts) {
            sessionOptions.initialPrompts = options.initialPrompts;
        } else if (options.systemPrompt) {
            // Legacy support - convert to initialPrompts
            sessionOptions.initialPrompts = [
                { role: 'system', content: options.systemPrompt }
            ];
        }
        
        // Handle custom parameters (both must be specified together)
        if (options.topK !== undefined && options.temperature !== undefined && window.aiModelParams) {
            sessionOptions.topK = Math.min(Math.max(options.topK, 1), window.aiModelParams.maxTopK);
            sessionOptions.temperature = Math.min(Math.max(options.temperature, 0.0), window.aiModelParams.maxTemperature);
        }
        
        // Handle AbortSignal
        if (options.signal) {
            sessionOptions.signal = options.signal;
        }
        
        // Add download progress monitoring
        if (window.aiCapabilities?.available === 'downloadable' && !options.monitor) {
            sessionOptions.monitor = (m) => {
                m.addEventListener('downloadprogress', (e) => {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    console.log(`📥 AI Model Download: ${progress}%`);
                    
                    // Update UI if status indicator exists
                    const statusIndicator = document.getElementById('ai-status-indicator');
                    const statusText = document.getElementById('ai-status-text');
                    if (statusIndicator && statusText) {
                        statusIndicator.className = 'mt-4 p-3 rounded-lg border text-sm bg-blue-900/50 border-blue-500/50 text-blue-300';
                        statusText.innerHTML = `
                            <div class="flex items-center space-x-2">
                                <div class="animate-spin w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full"></div>
                                <span>Downloading AI Model: ${progress}%</span>
                            </div>
                            <div class="mt-2 w-full bg-blue-800/50 rounded-full h-2">
                                <div class="bg-blue-400 h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
                            </div>
                        `;
                    }
                });
            };
        }
        
        // Use correct LanguageModel API
        const session = await LanguageModel.create(sessionOptions);
        
        if (session) {
            console.log('✅ AI session created successfully');
            return session;
        } else {
            console.log('❌ Failed to create AI session');
            return null;
        }
        
    } catch (error) {
        console.log('❌ Error creating AI session:', error);
        return null;
    }
};

// Enhanced Accessibility Features
function initAccessibilityFeatures() {
    // Skip to main content functionality
    const skipLinks = document.querySelectorAll('a[href="#main-content"]');
    skipLinks.forEach(skipLink => {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Enhanced keyboard navigation for custom elements
    document.querySelectorAll('[role="button"]').forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add keyboard navigation for filter buttons
    initFilterButtonAccessibility();
    
    // Add ARIA live region for dynamic content updates
    createAriaLiveRegion();
    
    // Initialize focus management for modals and overlays
    initFocusManagement();
    
    // Add keyboard navigation for project cards
    initProjectCardAccessibility();
    
    // Detect and respect user preferences
    respectUserPreferences();
    
    // Initialize heading navigation
    initHeadingNavigation();
}

// Create ARIA live region for announcements
function createAriaLiveRegion() {
    if (!document.getElementById('aria-live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }
}

// Function to announce messages to screen readers
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        // Clear the message after a short delay
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Enhanced filter button accessibility
function initFilterButtonAccessibility() {
    const filterGroups = document.querySelectorAll('[role="group"]');
    
    filterGroups.forEach(group => {
        const buttons = group.querySelectorAll('button');
        
        buttons.forEach((button, index) => {
            // Add keyboard navigation
            button.addEventListener('keydown', function(event) {
                let targetIndex;
                
                switch(event.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        event.preventDefault();
                        targetIndex = index > 0 ? index - 1 : buttons.length - 1;
                        buttons[targetIndex].focus();
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        event.preventDefault();
                        targetIndex = index < buttons.length - 1 ? index + 1 : 0;
                        buttons[targetIndex].focus();
                        break;
                    case 'Home':
                        event.preventDefault();
                        buttons[0].focus();
                        break;
                    case 'End':
                        event.preventDefault();
                        buttons[buttons.length - 1].focus();
                        break;
                }
            });
            
            // Update ARIA states when clicked
            button.addEventListener('click', function() {
                buttons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
                this.setAttribute('aria-pressed', 'true');
                
                // Announce filter change
                const filterName = this.textContent.trim();
                announceToScreenReader(`Filter changed to ${filterName}`);
            });
        });
    });
}

// Focus management for modals and overlays
function initFocusManagement() {
    let lastFocusedElement = null;
    
    // Store focus when opening modals
    document.addEventListener('focusin', function(event) {
        if (!event.target.closest('.modal, #mobile-menu')) {
            lastFocusedElement = event.target;
        }
    });
    
    // Restore focus when closing modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal.show, #mobile-menu.show');
            if (openModal && lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }
    });
}

// Project card accessibility
function initProjectCardAccessibility() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Make cards focusable
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
        
        // Add keyboard interaction
        card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                // Find and click the primary link in the card
                const primaryLink = card.querySelector('a[href]');
                if (primaryLink) {
                    primaryLink.click();
                }
            }
        });
        
        // Add ARIA label if not present
        if (!card.hasAttribute('aria-label') && !card.hasAttribute('aria-labelledby')) {
            const title = card.querySelector('h3, .project-title');
            if (title) {
                card.setAttribute('aria-labelledby', title.id || 'project-' + Math.random().toString(36).substr(2, 9));
                if (!title.id) {
                    title.id = card.getAttribute('aria-labelledby');
                }
            }
        }
    });
}

// Respect user preferences
function respectUserPreferences() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion(mediaQuery) {
        if (mediaQuery.matches) {
            document.body.classList.add('reduced-motion');
            // Disable autoplay animations
            const autoplayElements = document.querySelectorAll('[autoplay]');
            autoplayElements.forEach(el => el.removeAttribute('autoplay'));
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }
    
    prefersReducedMotion.addListener(handleReducedMotion);
    handleReducedMotion(prefersReducedMotion);
    
    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    function handleHighContrast(mediaQuery) {
        if (mediaQuery.matches) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    
    prefersHighContrast.addListener(handleHighContrast);
    handleHighContrast(prefersHighContrast);
}

// Heading navigation for screen readers
function initHeadingNavigation() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headings.forEach((heading, index) => {
        // Ensure headings have proper IDs for navigation
        if (!heading.id) {
            const text = heading.textContent.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .trim();
            heading.id = text || `heading-${index}`;
        }
        
        // Add skip links between major sections
        if (heading.tagName === 'H2') {
            const skipLink = document.createElement('a');
            skipLink.href = `#${heading.id}`;
            skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50';
            skipLink.textContent = `Skip to ${heading.textContent}`;
            heading.parentNode.insertBefore(skipLink, heading);
        }
    });
}

// Active navigation highlighting
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-primary', 'bg-primary/10');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-primary', 'bg-primary/10');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// Initialize responsive optimizations
function initResponsiveOptimizations() {
    // Detect device capabilities
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isLowEndDevice = detectLowEndDevice();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Apply device-specific optimizations
    if (isTouchDevice) {
        initTouchOptimizations();
    }
    
    if (isLowEndDevice || prefersReducedMotion) {
        initPerformanceOptimizations();
    }
    
    // Initialize responsive breakpoint handling
    initBreakpointHandling();
    
    // Initialize touch gestures for mobile
    if (isTouchDevice) {
        initTouchGestures();
    }
    
    // Initialize viewport height fix for mobile browsers
    initViewportHeightFix();
    
    // Initialize responsive images
    initResponsiveImages();
    
    // Initialize mobile-specific interactions
    initMobileInteractions();
}

// Detect low-end devices
function detectLowEndDevice() {
    // Check for various indicators of low-end devices
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const deviceMemory = navigator.deviceMemory || 1;
    
    // Consider device low-end if:
    // - Less than 4 CPU cores
    // - Less than 2GB RAM
    // - Slow connection
    const isLowEnd = hardwareConcurrency < 4 || 
                     deviceMemory < 2 || 
                     (connection && connection.effectiveType && 
                      ['slow-2g', '2g', '3g'].includes(connection.effectiveType));
    
    return isLowEnd;
}

// Initialize touch-specific optimizations
function initTouchOptimizations() {
    document.body.classList.add('touch-device');
    
    // Add touch-friendly classes
    document.querySelectorAll('.btn-primary, .btn-secondary, .social-link, .nav-link').forEach(element => {
        element.classList.add('touch-optimized');
    });
    
    // Improve touch target sizes
    const touchTargets = document.querySelectorAll('button, a, [role="button"], input, textarea, select');
    touchTargets.forEach(target => {
        const computedStyle = window.getComputedStyle(target);
        const minSize = 44; // 44px minimum touch target size
        
        if (parseInt(computedStyle.height) < minSize || parseInt(computedStyle.width) < minSize) {
            target.style.minHeight = `${minSize}px`;
            target.style.minWidth = `${minSize}px`;
        }
    });
    
    // Add touch feedback
    addTouchFeedback();
    
    // Optimize scroll performance on touch devices
    optimizeTouchScrolling();
}

// Add touch feedback to interactive elements
function addTouchFeedback() {
    const interactiveElements = document.querySelectorAll('button, a, [role="button"], .project-card, .experience-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
}

// Optimize touch scrolling
function optimizeTouchScrolling() {
    // Add momentum scrolling for iOS
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Prevent scroll chaining on modal elements
    const modals = document.querySelectorAll('.modal, .mobile-menu');
    modals.forEach(modal => {
        modal.style.overscrollBehavior = 'contain';
    });
}

// Initialize performance optimizations for low-end devices
function initPerformanceOptimizations() {
    document.body.classList.add('reduced-motion');
    
    // Disable heavy animations
    const heavyAnimations = document.querySelectorAll('.floating-element, .timeline-node, .particle-animation');
    heavyAnimations.forEach(element => {
        element.style.animation = 'none';
    });
    
    // Reduce animation durations
    const style = document.createElement('style');
    style.textContent = `
        .reduced-motion * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
        }
        .reduced-motion .typewriter {
            animation: none !important;
            border-right: none !important;
        }
        .reduced-motion .fun-fact-card:hover .fun-fact-inner {
            transform: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Disable particles on low-end devices
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        particlesContainer.style.display = 'none';
    }
}

// Initialize breakpoint handling
function initBreakpointHandling() {
    const breakpoints = {
        mobile: '(max-width: 767px)',
        tablet: '(min-width: 768px) and (max-width: 1023px)',
        desktop: '(min-width: 1024px)'
    };
    
    Object.entries(breakpoints).forEach(([name, query]) => {
        const mediaQuery = window.matchMedia(query);
        
        function handleBreakpointChange(e) {
            if (e.matches) {
                document.body.classList.add(`breakpoint-${name}`);
                handleBreakpointSpecificLogic(name);
            } else {
                document.body.classList.remove(`breakpoint-${name}`);
            }
        }
        
        mediaQuery.addListener(handleBreakpointChange);
        handleBreakpointChange(mediaQuery); // Initial call
    });
}

// Handle breakpoint-specific logic
function handleBreakpointSpecificLogic(breakpoint) {
    switch (breakpoint) {
        case 'mobile':
            // Mobile-specific optimizations
            optimizeForMobile();
            break;
        case 'tablet':
            // Tablet-specific optimizations
            optimizeForTablet();
            break;
        case 'desktop':
            // Desktop-specific optimizations
            optimizeForDesktop();
            break;
    }
}

// Mobile-specific optimizations
function optimizeForMobile() {
    // Reduce the number of visible project cards initially
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        if (index > 2) { // Show only first 3 cards initially on mobile
            card.style.display = 'none';
            card.classList.add('hidden-mobile');
        }
    });
    
    // Add "Show More" button for projects on mobile
    addShowMoreButton();
    
    // Optimize timeline for mobile
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        // Simplify timeline animations on mobile
        item.style.transform = 'none';
    });
    
    // Reduce AOS animation offset for mobile
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Tablet-specific optimizations
function optimizeForTablet() {
    // Show more project cards on tablet
    const hiddenCards = document.querySelectorAll('.project-card.hidden-mobile');
    hiddenCards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('hidden-mobile');
    });
    
    // Remove mobile show more button
    const showMoreBtn = document.querySelector('.show-more-mobile');
    if (showMoreBtn) {
        showMoreBtn.remove();
    }
}

// Desktop-specific optimizations
function optimizeForDesktop() {
    // Enable all animations and effects
    const hiddenCards = document.querySelectorAll('.project-card.hidden-mobile');
    hiddenCards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('hidden-mobile');
    });
    
    // Remove mobile show more button
    const showMoreBtn = document.querySelector('.show-more-mobile');
    if (showMoreBtn) {
        showMoreBtn.remove();
    }
    
    // Enable advanced hover effects
    document.body.classList.add('desktop-hover-enabled');
}

// Add show more button for mobile
function addShowMoreButton() {
    const projectsGrid = document.getElementById('projects-grid');
    const existingButton = document.querySelector('.show-more-mobile');
    
    if (projectsGrid && !existingButton) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'show-more-mobile btn-primary mx-auto mt-6 px-6 py-3 rounded-lg font-medium';
        showMoreBtn.textContent = 'Show More Projects';
        showMoreBtn.setAttribute('aria-label', 'Show more projects');
        
        showMoreBtn.addEventListener('click', function() {
            const hiddenCards = document.querySelectorAll('.project-card.hidden-mobile');
            hiddenCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.display = 'block';
                    card.classList.remove('hidden-mobile');
                    card.classList.add('animate-in');
                }, index * 100);
            });
            
            this.remove();
        });
        
        projectsGrid.parentNode.insertBefore(showMoreBtn, projectsGrid.nextSibling);
    }
}

// Initialize touch gestures
function initTouchGestures() {
    let startX, startY, startTime;
    
    // Add swipe gesture for mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        mobileMenu.addEventListener('touchend', function(e) {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // Detect swipe up to close mobile menu
            if (Math.abs(deltaY) > Math.abs(deltaX) && 
                deltaY < -50 && 
                deltaTime < 300) {
                
                const mobileMenuButton = document.getElementById('mobile-menu-button');
                if (mobileMenuButton && mobileMenu.classList.contains('show')) {
                    mobileMenuButton.click();
                }
            }
            
            startX = startY = null;
        }, { passive: true });
    }
    
    // Add pull-to-refresh gesture (visual feedback only)
    let pullDistance = 0;
    const pullThreshold = 100;
    
    document.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (startY && window.scrollY === 0) {
            const currentY = e.touches[0].clientY;
            pullDistance = Math.max(0, currentY - startY);
            
            if (pullDistance > 0) {
                // Add visual feedback for pull gesture
                document.body.style.transform = `translateY(${Math.min(pullDistance * 0.5, 50)}px)`;
                document.body.style.transition = 'none';
            }
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        if (pullDistance > 0) {
            document.body.style.transform = '';
            document.body.style.transition = 'transform 0.3s ease';
            
            if (pullDistance > pullThreshold) {
                // Show refresh feedback
                showRefreshFeedback();
            }
        }
        
        startY = null;
        pullDistance = 0;
    }, { passive: true });
}

// Show refresh feedback
function showRefreshFeedback() {
    const feedback = document.createElement('div');
    feedback.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    feedback.textContent = 'Content refreshed!';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Initialize viewport height fix for mobile browsers
function initViewportHeightFix() {
    // Fix for mobile browsers that change viewport height when address bar shows/hides
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 100);
    });
}

// Initialize responsive images
function initResponsiveImages() {
    // Add loading="lazy" to images below the fold
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach((img, index) => {
        if (index > 2) { // Lazy load images after the first few
            img.loading = 'lazy';
        }
        
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}

// Initialize mobile-specific interactions
function initMobileInteractions() {
    // Add haptic feedback for supported devices
    if ('vibrate' in navigator) {
        const interactiveElements = document.querySelectorAll('button, .btn-primary, .btn-secondary');
        interactiveElements.forEach(element => {
            element.addEventListener('click', () => {
                navigator.vibrate(10); // Short vibration
            });
        });
    }
    
    // Optimize form inputs for mobile
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        // Add appropriate input modes
        if (input.type === 'email') {
            input.setAttribute('inputmode', 'email');
        } else if (input.type === 'tel') {
            input.setAttribute('inputmode', 'tel');
        } else if (input.type === 'url') {
            input.setAttribute('inputmode', 'url');
        }
        
        // Prevent zoom on focus for iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            input.addEventListener('focus', function() {
                if (parseFloat(window.getComputedStyle(this).fontSize) < 16) {
                    this.style.fontSize = '16px';
                }
            });
        }
    });
    
    // Add double-tap to zoom prevention where needed
    const preventDoubleTap = document.querySelectorAll('.btn-primary, .btn-secondary, .social-link');
    preventDoubleTap.forEach(element => {
        element.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        });
    });
}

// Initialize Experience Timeline
function initExperienceTimeline() {
    const timelineContainer = document.getElementById('experience-timeline');
    if (!timelineContainer) {
        console.warn('Experience timeline container not found');
        return;
    }
    
    if (typeof experience === 'undefined' || !Array.isArray(experience) || experience.length === 0) {
        console.warn('Experience data not available or empty');
        timelineContainer.innerHTML = `
            <div class="text-center py-12">
                <p class="text-slate-600">Experience information is currently being loaded...</p>
            </div>
        `;
        return;
    }

    // Generate timeline items with proper alternating layout
    timelineContainer.innerHTML = experience.map((job, index) => {
        const accentColor = index === 0 ? 'blue' : 
                           index === 1 ? 'emerald' : 
                           index === 2 ? 'orange' : 
                           index === 3 ? 'purple' : 
                           index === 4 ? 'pink' : 'blue';
        
        return `
            <!-- Experience Item ${index + 1} -->
            <div class="relative flex items-start experience-item">
                <!-- Timeline Flag Node -->
                <div class="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-900 rounded-full border-4 border-gray-900 z-10 timeline-flag-node flex items-center justify-center" title="${job.country}">
                    <span class="timeline-flag" aria-label="${job.country}">${job.flag}</span>
                </div>
                
                <!-- Content -->
                <div class="ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:ml-auto md:pl-8 md:text-left'}">
                    <div class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-${accentColor}-500/50 transition-all duration-300 group experience-card">
                        <div class="flex flex-col ${index % 2 === 0 ? 'md:items-end' : ''}">
                            <div class="text-sm text-${accentColor}-400 font-medium mb-2">${job.duration}</div>
                            <h3 class="text-xl font-semibold text-gray-100 mb-1">${job.position}</h3>
                            <div class="text-lg text-gray-300 mb-4">${job.company} • ${job.location}</div>
                            <p class="text-gray-400 text-sm mb-4 leading-relaxed">
                                ${job.description}
                            </p>
                            
                            <!-- Key Achievements -->
                            <div class="mb-4">
                                <h4 class="text-sm font-medium text-gray-200 mb-2">Key Achievements:</h4>
                                <ul class="text-sm text-gray-400 space-y-1 achievement-list">
                                    ${job.achievements.map(achievement => `
                                        <li class="flex items-start achievement-item">
                                            <span class="text-${accentColor}-400 mr-2 mt-1 achievement-bullet">•</span>
                                            <span>${achievement}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            
                            <!-- Technologies -->
                            <div class="flex flex-wrap gap-2 tech-tags">
                                ${job.technologies.map(tech => `
                                    <span class="px-3 py-1 bg-${accentColor}-500/10 text-${accentColor}-400 text-xs rounded-full border border-${accentColor}-500/20 tech-tag">${tech}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize timeline animations and interactions
    initTimelineAnimations();
    initTimelineKeyboardNavigation();
    initTimelineIntersectionObserver();
}

// Toggle experience card expansion
function toggleExperience(index) {
    const card = document.querySelector(`[data-job-index="${index}"]`);
    const expandButton = card.querySelector('.expand-button');
    const expandText = expandButton.querySelector('.expand-text');
    
    // Add loading state
    card.classList.add('loading');
    
    setTimeout(() => {
        card.classList.remove('loading');
        
        if (card.classList.contains('expanded')) {
            card.classList.remove('expanded');
            expandText.textContent = 'View Achievements';
            
            // Animate collapse
            if (typeof gsap !== 'undefined') {
                gsap.to(card.querySelectorAll('.achievement-card'), {
                    y: 20,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.05
                });
            }
        } else {
            // Close other expanded cards with animation
            document.querySelectorAll('.experience-card.expanded').forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                    otherCard.querySelector('.expand-text').textContent = 'View Achievements';
                    
                    if (typeof gsap !== 'undefined') {
                        gsap.to(otherCard.querySelectorAll('.achievement-card'), {
                            y: 20,
                            opacity: 0,
                            duration: 0.2,
                            stagger: 0.02
                        });
                    }
                }
            });
            
            card.classList.add('expanded');
            expandText.textContent = 'Hide Achievements';
            
            // Animate expansion
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(card.querySelectorAll('.achievement-card'), 
                    { y: 30, opacity: 0 },
                    { 
                        y: 0, 
                        opacity: 1, 
                        duration: 0.5, 
                        stagger: 0.1,
                        delay: 0.2,
                        ease: 'back.out(1.7)'
                    }
                );
            }
            
            // Scroll the expanded card into view
            setTimeout(() => {
                card.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        }
    }, 150); // Small delay for loading effect
}

// Add keyboard navigation for timeline
function initTimelineKeyboardNavigation() {
    const timelineItems = document.querySelectorAll('.experience-card');
    
    timelineItems.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');
        card.setAttribute('aria-label', `Expand details for ${experience[index].position} at ${experience[index].company}`);
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleExperience(index);
                card.setAttribute('aria-expanded', card.classList.contains('expanded'));
            }
        });
        
        // Update aria-expanded when card is toggled
        const observer = new MutationObserver(() => {
            card.setAttribute('aria-expanded', card.classList.contains('expanded'));
        });
        
        observer.observe(card, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    });
}

// Add timeline intersection observer for performance
function initTimelineIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const timelineItem = entry.target;
                timelineItem.classList.add('in-view');
                
                // Start node pulse animation when in view
                const node = timelineItem.querySelector('.timeline-node');
                if (node) {
                    node.style.animationPlayState = 'running';
                }
            } else {
                const timelineItem = entry.target;
                timelineItem.classList.remove('in-view');
                
                // Pause node animation when out of view for performance
                const node = timelineItem.querySelector('.timeline-node');
                if (node) {
                    node.style.animationPlayState = 'paused';
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '50px'
    });
    
    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });
}

// Initialize timeline scroll animations
function initTimelineAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Animate timeline line
    gsap.fromTo('.timeline-line', 
        { height: '0%' },
        {
            height: '100%',
            duration: 2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#experience-timeline',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Animate timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        const isEven = index % 2 === 0;
        
        gsap.fromTo(item,
            {
                opacity: 0,
                x: isEven ? -100 : 100,
                y: 50
            },
            {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                onComplete: () => {
                    item.classList.add('animate-in');
                }
            }
        );

        // Animate timeline nodes with a slight delay
        const node = item.querySelector('.timeline-node');
        gsap.fromTo(node,
            {
                scale: 0,
                rotation: -180
            },
            {
                scale: 1,
                rotation: 0,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: 0.3,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Animate career stats
    gsap.utils.toArray('#experience + div .text-3xl').forEach((stat, index) => {
        const finalValue = parseInt(stat.textContent.replace(/\D/g, ''));
        const suffix = stat.textContent.replace(/\d/g, '');
        
        gsap.fromTo(stat,
            { textContent: '0' + suffix },
            {
                textContent: finalValue + suffix,
                duration: 2,
                ease: 'power3.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat.closest('.grid'),
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}

// Utility function to calculate experience duration
function calculateDuration(durationString) {
    // Parse duration string like "Oct 2022 - Present" or "Mar 2022 - Oct 2022"
    const parts = durationString.split(' - ');
    if (parts.length !== 2) return '';
    
    const startDate = new Date(parts[0]);
    const endDate = parts[1] === 'Present' ? new Date() : new Date(parts[1]);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '';
    
    const diffTime = Math.abs(endDate - startDate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    
    if (diffMonths < 12) {
        return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    } else {
        const years = Math.floor(diffMonths / 12);
        const months = diffMonths % 12;
        let result = `${years} year${years !== 1 ? 's' : ''}`;
        if (months > 0) {
            result += `, ${months} month${months !== 1 ? 's' : ''}`;
        }
        return result;
    }
}

// Make functions globally available
window.toggleExperience = toggleExperience;
window.calculateDuration = calculateDuration;
window.filterProjects = filterProjects;
window.filterSkills = filterSkills;

// Initialize About Section
function initAboutSection() {
    // Populate Fun Facts
    const funFactsContainer = document.getElementById('fun-facts-container');
    if (funFactsContainer && typeof funFacts !== 'undefined') {
        funFactsContainer.innerHTML = funFacts.map((fact, index) => `
            <div class="fun-fact-card" data-aos="flip-up" data-aos-delay="${index * 100}">
                <div class="fun-fact-inner">
                    <div class="fun-fact-front">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 icon-pulse">
                            <i data-lucide="${fact.icon}" class="w-8 h-8 text-blue-600"></i>
                        </div>
                        <h4 class="text-lg font-semibold text-slate-800 mb-2">${fact.title}</h4>
                        <p class="text-sm text-slate-600">Hover to learn more</p>
                    </div>
                    <div class="fun-fact-back">
                        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                            <i data-lucide="${fact.icon}" class="w-8 h-8 text-white"></i>
                        </div>
                        <h4 class="text-lg font-semibold mb-3">${fact.title}</h4>
                        <p class="text-sm leading-relaxed">${fact.description}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Populate Personality Traits
    const personalityContainer = document.getElementById('personality-traits-container');
    if (personalityContainer && typeof personalityTraits !== 'undefined') {
        personalityContainer.innerHTML = personalityTraits.map((trait, index) => `
            <div class="personality-card relative" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <i data-lucide="${trait.icon}" class="w-6 h-6 ${trait.color}"></i>
                </div>
                <h4 class="text-lg font-semibold text-slate-800 mb-2 text-center">${trait.title}</h4>
                <p class="text-sm text-slate-600 text-center leading-relaxed">${trait.description}</p>
            </div>
        `).join('');
    }

    // Populate Personal Interests
    const interestsContainer = document.getElementById('personal-interests-container');
    if (interestsContainer && typeof personalInterests !== 'undefined') {
        interestsContainer.innerHTML = personalInterests.map((category, index) => `
            <div class="interest-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <h4 class="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <div class="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    ${category.category}
                </h4>
                <ul class="space-y-2">
                    ${category.items.map(item => `
                        <li class="interest-item">${item}</li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    }

    // Re-initialize Lucide icons for the new content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    initPerformanceMonitoring();
    initAccessibilityFeatures();
    initActiveNavigation();
});

// Export utility functions
window.WebsiteUtils = {
    formatDate,
    calculateReadingTime,
    isValidEmail,
    showFormMessage
};

// Initialize Projects Section
function initProjectsSection() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) {
        console.warn('Projects grid container not found');
        return;
    }
    
    if (typeof projects === 'undefined' || !Array.isArray(projects) || projects.length === 0) {
        console.warn('Projects data not available or empty');
        projectsGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-400">Projects information is currently being loaded...</p>
            </div>
        `;
        return;
    }

    // Filter only featured projects
    const featuredProjects = projects.filter(project => project.featured === true);
    
    // Generate project cards
    renderProjects(featuredProjects);
    
    // Initialize filter functionality
    initProjectFilters();
    
    // Initialize project animations
    initProjectAnimations();
}

// Render project cards
function renderProjects(projectsToRender) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    // Show loading state
    projectsGrid.innerHTML = `
        <div class="col-span-full flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    `;
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        renderProjectCards(projectsToRender);
    }, 300);
}

// Render project cards (separated for loading state)
function renderProjectCards(projectsToRender) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    // Helper function to get project icon
    function getProjectIcon(category, title) {
        if (title.toLowerCase().includes('budget')) return 'dollar-sign';
        if (title.toLowerCase().includes('game')) return 'gamepad-2';
        if (title.toLowerCase().includes('portfolio')) return 'monitor';
        if (title.toLowerCase().includes('serverless')) return 'cloud';
        if (title.toLowerCase().includes('kinesis')) return 'activity';
        if (title.toLowerCase().includes('prototyping')) return 'zap';
        return 'folder';
    }

    // Helper function to get accent color
    function getAccentColor(index) {
        const colors = ['blue', 'emerald', 'purple', 'orange', 'cyan', 'pink'];
        return colors[index % colors.length];
    }

    // Helper function to get SVG path
    function getSvgPath(iconType) {
        const iconPaths = {
            'dollar-sign': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            'gamepad-2': 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
            'monitor': 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            'cloud': 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
            'activity': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            'zap': 'M13 10V3L4 14h7v7l9-11h-7z',
            'folder': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z'
        };
        return iconPaths[iconType] || iconPaths.folder;
    }

    projectsGrid.innerHTML = projectsToRender.map((project, index) => {
        const accentColor = getAccentColor(index);
        const projectIcon = getProjectIcon(project.category, project.title);
        const svgPath = getSvgPath(projectIcon);
        
        // Determine button text based on URL
        let buttonText = 'View Project';
        if (project.liveUrl) {
            if (project.liveUrl.includes('d3jl8ebe3s2hna')) buttonText = 'Launch App';
            else if (project.liveUrl.includes('dj3xrj5xgqclx')) buttonText = 'Play Game';
            else if (project.liveUrl.includes('#')) buttonText = 'View Site';
            else buttonText = 'View Tutorial';
        }
        
        return `
            <article class="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-${accentColor}-500/50 transition-all duration-500 project-card cursor-pointer" 
                     data-category="${project.category}" 
                     data-aos="fade-up" 
                     data-aos-delay="${index * 100}"
                     role="article"
                     aria-label="Project: ${project.title}">
                
                <div class="absolute inset-0 bg-gradient-to-br from-${accentColor}-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="relative z-10">
                    <!-- Project Header -->
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <div class="flex items-center mb-2">
                                <div class="w-12 h-12 bg-${accentColor}-500/10 rounded-lg flex items-center justify-center group-hover:bg-${accentColor}-500/20 transition-colors duration-300 mr-3">
                                    <svg class="w-6 h-6 text-${accentColor}-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${svgPath}"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-100 group-hover:text-${accentColor}-400 transition-colors duration-300">
                                        ${project.title}
                                    </h3>
                                    <p class="text-xs text-${accentColor}-400 font-medium">${project.category}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Project Description -->
                    <p class="text-gray-300 mb-4 text-sm leading-relaxed flex-1">
                        ${project.description}
                    </p>
                    
                    <!-- Technology Stack -->
                    <div class="mb-4">
                        <h4 class="text-xs font-medium text-gray-400 mb-2">Technologies Used</h4>
                        <div class="flex flex-wrap gap-1">
                            ${project.technologies.map(tech => `
                                <span class="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600 hover:border-${accentColor}-500/50 transition-colors duration-200">${tech}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Project Links -->
                    <div class="flex flex-wrap gap-2 mt-auto">
                        ${project.liveUrl ? `
                            <a href="${project.liveUrl}" 
                               target="_blank" rel="noopener noreferrer"
                               class="inline-flex items-center px-3 py-2 bg-${accentColor}-500/10 text-${accentColor}-400 rounded-lg hover:bg-${accentColor}-500/20 focus:bg-${accentColor}-500/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-${accentColor}-400 focus:ring-offset-2 focus:ring-offset-gray-900 text-xs"
                               aria-label="View ${project.title} (opens in new tab)">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                </svg>
                                ${buttonText}
                            </a>
                        ` : ''}
                        
                        ${project.githubUrl ? `
                            <a href="${project.githubUrl}" 
                               target="_blank" rel="noopener noreferrer"
                               class="inline-flex items-center px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 focus:bg-gray-600/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 text-xs"
                               aria-label="View source code for ${project.title} on GitHub (opens in new tab)">
                                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                GitHub
                            </a>
                        ` : ''}
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Trigger animation for newly rendered cards
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.add('animate-in');
        });
    }, 100);
}

// Initialize project filter functionality
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    
    filterButtons.forEach(button => {
        // Add ARIA attributes for accessibility
        button.setAttribute('role', 'button');
        button.setAttribute('aria-pressed', button.classList.contains('active'));
        
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
            
            // Filter projects
            filterProjects(filter);
            
            // Announce filter change to screen readers
            const announcement = `Showing ${filter === 'all' ? 'all' : filter} projects`;
            announceToScreenReader(announcement);
        });
        
        // Add keyboard support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
}

// Announce changes to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Filter projects function
function filterProjects(category) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        const shouldShow = category === 'all' || cardCategory === category;
        
        if (shouldShow) {
            // Show card with staggered animation
            setTimeout(() => {
                card.classList.remove('filter-hidden');
                card.classList.add('filter-visible');
            }, index * 100);
        } else {
            // Hide card
            card.classList.remove('filter-visible');
            card.classList.add('filter-hidden');
        }
    });
    
    // Update URL hash for deep linking (optional)
    if (category !== 'all') {
        history.replaceState(null, null, `#projects-${category.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
        history.replaceState(null, null, '#projects');
    }
}

// Initialize project animations
function initProjectAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Animate project cards on scroll
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 60,
                rotationX: -15
            },
            {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                delay: index * 0.1
            }
        );

        // Animate tech badges on card hover
        const techBadges = card.querySelectorAll('.tech-stack-badge');
        card.addEventListener('mouseenter', () => {
            gsap.fromTo(techBadges,
                { y: 0, scale: 1 },
                {
                    y: -4,
                    scale: 1.05,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: 'back.out(1.7)'
                }
            );
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(techBadges, {
                y: 0,
                scale: 1,
                duration: 0.3,
                stagger: 0.02,
                ease: 'power2.out'
            });
        });
    });

    // Animate filter buttons
    gsap.fromTo('.project-filter-btn',
        {
            opacity: 0,
            y: 20
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.project-filter-btn',
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

// Initialize project intersection observer for performance
function initProjectIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const projectCard = entry.target;
                projectCard.classList.add('in-view');
                
                // Lazy load project images
                const img = projectCard.querySelector('img[data-src]');
                if (img) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            } else {
                const projectCard = entry.target;
                projectCard.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });
    
    document.querySelectorAll('.project-card').forEach(card => {
        projectObserver.observe(card);
    });
}

// Handle deep linking for project filters
function handleProjectDeepLinking() {
    const hash = window.location.hash;
    if (hash.startsWith('#projects-')) {
        const category = hash.replace('#projects-', '').replace(/-/g, ' ');
        const categoryMap = {
            'game-development': 'Game Development',
            'cloud-architecture': 'Cloud Architecture',
            'technical-writing': 'Technical Writing'
        };
        
        const actualCategory = categoryMap[category.toLowerCase()] || category;
        
        // Find and click the appropriate filter button
        const filterButton = document.querySelector(`[data-filter="${actualCategory}"]`);
        if (filterButton) {
            setTimeout(() => {
                filterButton.click();
            }, 500);
        }
    }
}

// Initialize deep linking on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(handleProjectDeepLinking, 1000);
});

// Add error handling for project images
function handleProjectImageErrors() {
    document.querySelectorAll('.project-card img').forEach(img => {
        img.addEventListener('error', function() {
            const placeholder = document.createElement('div');
            placeholder.className = 'project-image-placeholder';
            placeholder.innerHTML = '<i data-lucide="folder" class="w-16 h-16 text-slate-400"></i>';
            
            this.parentElement.replaceChild(placeholder, this);
            
            // Re-initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    });
}

// Initialize project image error handling
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(handleProjectImageErrors, 1000);
});

// Initialize Skills Section
function initSkillsSection() {
    console.log('Initializing Skills Section...');
    
    // Initialize all skills components
    initSkillsCategories();
    initEducationInfo();
    initCertificationsInfo();
    initSkillsVisualization();
    initSkillsAnimations();
    
    console.log('Skills Section initialized successfully');
}

// Initialize Skills Categories
function initSkillsCategories() {
    const skillsCategoriesContainer = document.getElementById('skills-categories');
    if (!skillsCategoriesContainer) {
        console.warn('Skills categories container not found');
        return;
    }
    
    if (typeof skills === 'undefined' || !skills) {
        console.warn('Skills data not available');
        skillsCategoriesContainer.innerHTML = `
            <div class="text-center py-12">
                <p class="text-slate-600">Skills information is currently being loaded...</p>
            </div>
        `;
        return;
    }

    // Generate skills categories
    const categoriesHTML = Object.entries(skills).map((category, categoryIndex) => {
        const [categoryName, categorySkills] = category;
        
        // Get category icon based on name
        const categoryIcon = getCategoryIcon(categoryName);
        
        return `
            <div class="skills-category" data-aos="fade-up" data-aos-delay="${categoryIndex * 200}">
                <h4>
                    <div class="skills-category-icon">
                        <i data-lucide="${categoryIcon}" class="w-6 h-6"></i>
                    </div>
                    ${categoryName}
                </h4>
                
                <div class="skills-grid">
                    ${categorySkills.map((skill, skillIndex) => `
                        <div class="skill-item" data-skill-category="${categoryName}" data-aos="fade-up" data-aos-delay="${(categoryIndex * 200) + (skillIndex * 100)}">
                            <div class="skill-header">
                                <div class="skill-name">${skill.name}</div>
                                <div class="skill-level">${skill.level}%</div>
                            </div>
                            
                            <div class="skill-progress-container">
                                <div class="skill-progress-bar" data-skill-level="${skill.level}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    skillsCategoriesContainer.innerHTML = categoriesHTML;

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize Education Information
function initEducationInfo() {
    const educationContainer = document.getElementById('education-info');
    if (!educationContainer) {
        console.warn('Education container not found');
        return;
    }
    
    if (typeof education === 'undefined' || !education) {
        console.warn('Education data not available');
        educationContainer.innerHTML = `
            <div class="text-center py-6">
                <p class="text-slate-600">Education information is currently being loaded...</p>
            </div>
        `;
        return;
    }

    educationContainer.innerHTML = `
        <div class="education-item">
            <div class="education-degree">${education.degree}</div>
            <div class="education-institution">${education.institution}</div>
            <div class="education-details">
                <div class="education-year">
                    <i data-lucide="calendar" class="w-4 h-4"></i>
                    <span>${education.year}</span>
                </div>
                <div class="education-location">
                    <i data-lucide="map-pin" class="w-4 h-4"></i>
                    <span>${education.location}</span>
                </div>
            </div>
        </div>
    `;

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize Certifications Information
function initCertificationsInfo() {
    const certificationsContainer = document.getElementById('certifications-info');
    if (!certificationsContainer) {
        console.warn('Certifications container not found');
        return;
    }
    
    // Check if data is available
    const hasCertifications = typeof certifications !== 'undefined' && Array.isArray(certifications) && certifications.length > 0;
    const hasMemberships = typeof memberships !== 'undefined' && Array.isArray(memberships) && memberships.length > 0;
    
    if (!hasCertifications && !hasMemberships) {
        console.warn('Certifications and memberships data not available');
        certificationsContainer.innerHTML = `
            <div class="text-center py-6">
                <p class="text-slate-600">Certifications information is currently being loaded...</p>
            </div>
        `;
        return;
    }

    let certificationsHTML = '';

    // Add certifications
    if (hasCertifications) {
        certificationsHTML += certifications.map(cert => `
            <div class="certification-badge">
                <div class="certification-header">
                    <div class="certification-icon">
                        <i data-lucide="${cert.icon || 'award'}" class="w-5 h-5"></i>
                    </div>
                    <div class="certification-name">${cert.name}</div>
                </div>
                <div class="certification-issuer">${cert.issuer}</div>
                <div class="certification-year">
                    <i data-lucide="calendar" class="w-3 h-3"></i>
                    <span>${cert.year}</span>
                </div>
            </div>
        `).join('');
    }

    // Add memberships
    if (hasMemberships) {
        certificationsHTML += memberships.map(membership => `
            <div class="membership-badge">
                <div class="membership-header">
                    <div class="membership-icon">
                        <i data-lucide="${membership.icon || 'users'}" class="w-5 h-5"></i>
                    </div>
                    <div class="membership-name">${membership.name}</div>
                </div>
                <div class="membership-organization">${membership.organization}</div>
                <div class="membership-description">${membership.description}</div>
                <div class="membership-year">
                    <i data-lucide="calendar" class="w-3 h-3"></i>
                    <span>${membership.year}</span>
                </div>
            </div>
        `).join('');
    }

    certificationsContainer.innerHTML = certificationsHTML;

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize Skills Visualization
function initSkillsVisualization() {
    const skillsVisualizationContainer = document.getElementById('skills-visualization');
    if (!skillsVisualizationContainer) {
        console.warn('Skills visualization container not found');
        return;
    }
    
    if (typeof skills === 'undefined' || !skills) {
        console.warn('Skills data not available for visualization');
        skillsVisualizationContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-slate-600">Skills visualization is currently being loaded...</p>
            </div>
        `;
        return;
    }

    // Flatten all skills into a single array
    const allSkills = [];
    Object.entries(skills).forEach(([categoryName, categorySkills]) => {
        categorySkills.forEach(skill => {
            allSkills.push({
                ...skill,
                category: categoryName
            });
        });
    });

    // Generate skills visualization
    const visualizationHTML = allSkills.map((skill, index) => `
        <div class="skills-visualization-item filter-visible" 
             data-skill-category="${skill.category}" 
             data-aos="zoom-in" 
             data-aos-delay="${index * 50}">
            <div class="skill-icon">
                <i data-lucide="${getSkillIcon(skill.name)}" class="w-6 h-6"></i>
            </div>
            
            <div class="skill-circle">
                <svg viewBox="0 0 60 60">
                    <defs>
                        <linearGradient id="skillGradient-${index}" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <circle class="skill-circle-bg" cx="30" cy="30" r="26"></circle>
                    <circle class="skill-circle-progress" 
                            cx="30" cy="30" r="26" 
                            stroke="url(#skillGradient-${index})"
                            data-skill-level="${skill.level}"></circle>
                </svg>
                <div class="skill-circle-text">${skill.level}%</div>
            </div>
            
            <div class="skill-name text-sm font-semibold text-slate-800 text-center">${skill.name}</div>
            <div class="skill-category text-xs text-slate-500 text-center mt-1">${skill.category}</div>
        </div>
    `).join('');

    skillsVisualizationContainer.innerHTML = visualizationHTML;

    // Initialize skill filter buttons
    initSkillFilterButtons();

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Initialize Skill Filter Buttons
function initSkillFilterButtons() {
    const filterButtons = document.querySelectorAll('.skill-filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter skills
            filterSkills(filterValue);
        });
    });
}

// Filter Skills Function
function filterSkills(category) {
    const skillItems = document.querySelectorAll('.skills-visualization-item');
    
    skillItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-skill-category');
        
        if (category === 'all' || itemCategory === category) {
            // Show item
            item.classList.remove('filter-hidden');
            item.classList.add('filter-visible');
            
            // Add staggered animation
            setTimeout(() => {
                item.style.animationDelay = `${index * 50}ms`;
                item.classList.add('animate-in');
            }, 50);
        } else {
            // Hide item
            item.classList.remove('filter-visible', 'animate-in');
            item.classList.add('filter-hidden');
        }
    });
}

// Initialize Skills Animations
function initSkillsAnimations() {
    // Animate progress bars when they come into view
    if ('IntersectionObserver' in window) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const skillLevel = progressBar.getAttribute('data-skill-level');
                    
                    // Animate progress bar
                    setTimeout(() => {
                        progressBar.style.width = skillLevel + '%';
                    }, 300);
                    
                    progressObserver.unobserve(progressBar);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '50px'
        });

        // Observe all progress bars
        document.querySelectorAll('.skill-progress-bar').forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    // Animate circular progress indicators
    if ('IntersectionObserver' in window) {
        const circleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const circle = entry.target;
                    const skillLevel = circle.getAttribute('data-skill-level');
                    const circumference = 2 * Math.PI * 26; // radius = 26
                    const offset = circumference - (skillLevel / 100) * circumference;
                    
                    // Animate circular progress
                    setTimeout(() => {
                        circle.style.strokeDashoffset = offset;
                    }, 500);
                    
                    circleObserver.unobserve(circle);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '50px'
        });

        // Observe all circular progress indicators
        document.querySelectorAll('.skill-circle-progress').forEach(circle => {
            circleObserver.observe(circle);
        });
    }

    // Add GSAP animations if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Animate skills categories
        gsap.utils.toArray('.skills-category').forEach((category, index) => {
            gsap.fromTo(category,
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: category,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    delay: index * 0.2
                }
            );
        });

        // Animate skills visualization items
        gsap.utils.toArray('.skills-visualization-item').forEach((item, index) => {
            gsap.fromTo(item,
                {
                    opacity: 0,
                    scale: 0.8,
                    rotation: -10
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    },
                    delay: index * 0.05
                }
            );
        });

        // Animate education and certification cards
        gsap.utils.toArray('.education-card, .certification-badge, .membership-badge').forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    x: index % 2 === 0 ? -50 : 50,
                    y: 30
                },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    delay: index * 0.2
                }
            );
        });
    }
}

// Utility Functions

// Get category icon based on category name
function getCategoryIcon(categoryName) {
    const iconMap = {
        'Frontend': 'monitor',
        'Backend & Languages': 'server',
        'Cloud & AWS': 'cloud',
        'Tools & Frameworks': 'wrench'
    };
    
    return iconMap[categoryName] || 'code';
}

// Get skill icon based on skill name
function getSkillIcon(skillName) {
    const iconMap = {
        'JavaScript': 'code',
        'React': 'component',
        'HTML/CSS': 'layout',
        'TypeScript': 'type',
        'Node.js': 'server',
        'Python': 'code-2',
        'Java': 'coffee',
        'C#': 'hash',
        'AWS Lambda': 'zap',
        'API Gateway': 'gateway',
        'DynamoDB': 'database',
        'CloudFormation': 'layers',
        'S3': 'hard-drive',
        'CloudFront': 'globe',
        'Git': 'git-branch',
        'Docker': 'container',
        'SAM': 'package',
        'WebSockets': 'radio'
    };
    
    return iconMap[skillName] || 'circle';
}

// Add hover effects to skill items
function addSkillHoverEffects() {
    document.querySelectorAll('.skill-item, .skills-visualization-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { 
                    duration: 0.3, 
                    y: -5, 
                    scale: 1.02, 
                    ease: "power2.out" 
                });
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { 
                    duration: 0.3, 
                    y: 0, 
                    scale: 1, 
                    ease: "power2.out" 
                });
            }
        });
    });
}

// Initialize skill hover effects after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(addSkillHoverEffects, 1000);
});
// Initialize Articles Section
function initArticlesSection() {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) {
        console.warn('Articles grid container not found');
        return;
    }
    
    if (typeof articles === 'undefined' || !Array.isArray(articles) || articles.length === 0) {
        console.warn('Articles data not available or empty');
        articlesGrid.innerHTML = `
            <div class="col-span-full articles-empty-state">
                <i data-lucide="file-text" class="w-16 h-16 mx-auto mb-4 text-slate-300"></i>
                <h3>No Articles Found</h3>
                <p>Articles are currently being loaded. Please check back soon!</p>
            </div>
        `;
        return;
    }

    // Generate article cards
    articlesGrid.innerHTML = articles.map((article, index) => {
        const publishDate = new Date(article.publishDate);
        const formattedDate = publishDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const relativeDate = getRelativeDate(publishDate);
        
        return `
            <article class="article-card" 
                     data-tags="${article.tags.join(',').toLowerCase()}"
                     data-aos="fade-up" 
                     data-aos-delay="${index * 100}"
                     tabindex="0"
                     role="article"
                     aria-label="Article: ${article.title}">
                
                <!-- Article Featured Image -->
                <div class="article-image">
                    ${article.image ? 
                        `<img src="${article.image}" alt="${article.title}" loading="lazy">` :
                        `<i data-lucide="file-text" class="article-image-placeholder"></i>`
                    }
                </div>
                
                <!-- Article Content -->
                <div class="article-content">
                    <!-- Article Title -->
                    <h3 class="article-title">${article.title}</h3>
                    
                    <!-- Article Meta -->
                    <div class="article-meta">
                        <div class="article-date">
                            <i data-lucide="calendar" class="w-4 h-4"></i>
                            <span title="${formattedDate}">${relativeDate}</span>
                        </div>
                        <div class="article-read-time reading-time-badge">
                            <i data-lucide="clock" class="w-3 h-3"></i>
                            <span>${article.readTime}</span>
                        </div>
                    </div>
                    
                    <!-- Article Excerpt -->
                    <p class="article-excerpt">${article.excerpt}</p>
                    
                    <!-- Article Tags -->
                    <div class="article-tags">
                        ${article.tags.map(tag => `
                            <span class="article-tag" data-tag="${tag.toLowerCase()}">${tag}</span>
                        `).join('')}
                    </div>
                    
                    <!-- Article Footer -->
                    <div class="article-footer">
                        <a href="${article.url}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="article-read-more"
                           aria-label="Read full article: ${article.title}">
                            <span>Read Article</span>
                            <i data-lucide="arrow-right" class="w-4 h-4"></i>
                        </a>
                        
                        <div class="article-external-indicator">
                            <i data-lucide="external-link" class="w-3 h-3"></i>
                            <span>Dev.to</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize article filtering
    initArticleFiltering();
    
    // Initialize article animations
    initArticleAnimations();
    
    // Initialize article keyboard navigation
    initArticleKeyboardNavigation();
    
    // Initialize article intersection observer
    initArticleIntersectionObserver();
}

// Initialize Article Filtering
function initArticleFiltering() {
    const filterButtons = document.querySelectorAll('.article-filter-btn');
    const articleCards = document.querySelectorAll('.article-card');
    
    if (filterButtons.length === 0 || articleCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter articles with animation
            filterArticles(filter, articleCards);
        });
    });
}

// Filter Articles Function
function filterArticles(filter, articleCards) {
    const articlesGrid = document.getElementById('articles-grid');
    
    // Add filtering class for transition
    articlesGrid.classList.add('filtering');
    
    setTimeout(() => {
        articleCards.forEach((card, index) => {
            const cardTags = card.getAttribute('data-tags').toLowerCase();
            const shouldShow = filter === 'all' || cardTags.includes(filter.toLowerCase());
            
            if (shouldShow) {
                card.classList.remove('filter-hidden');
                card.classList.add('filter-visible');
                card.style.display = 'block';
                
                // Stagger animation
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 50);
            } else {
                card.classList.add('filter-hidden');
                card.classList.remove('filter-visible', 'animate-in');
                
                // Hide after animation
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Remove filtering class
        setTimeout(() => {
            articlesGrid.classList.remove('filtering');
        }, 300);
    }, 150);
}

// Initialize Article Animations
function initArticleAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Animate article cards on scroll
    gsap.utils.toArray('.article-card').forEach((card, index) => {
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 50,
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                onComplete: () => {
                    card.classList.add('animate-in');
                }
            }
        );
    });

    // Animate article filter buttons
    gsap.fromTo('.article-filter-btn',
        {
            opacity: 0,
            y: 20
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#articles',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
}

// Initialize Article Keyboard Navigation
function initArticleKeyboardNavigation() {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach((card, index) => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const readMoreLink = card.querySelector('.article-read-more');
                if (readMoreLink) {
                    readMoreLink.click();
                }
            }
            
            // Arrow key navigation
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextCard = articleCards[index + 1];
                if (nextCard) {
                    nextCard.focus();
                }
            }
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevCard = articleCards[index - 1];
                if (prevCard) {
                    prevCard.focus();
                }
            }
        });
        
        // Add focus and blur effects
        card.addEventListener('focus', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.15)';
        });
        
        card.addEventListener('blur', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
}

// Initialize Article Intersection Observer
function initArticleIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const articleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const articleCard = entry.target;
                articleCard.classList.add('in-view');
                
                // Trigger tag animations
                const tags = articleCard.querySelectorAll('.article-tag');
                tags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.animationDelay = `${index * 0.1}s`;
                        tag.classList.add('animate-in');
                    }, 200);
                });
            } else {
                const articleCard = entry.target;
                articleCard.classList.remove('in-view');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '50px'
    });
    
    document.querySelectorAll('.article-card').forEach(card => {
        articleObserver.observe(card);
    });
}

// Utility function to get relative date
function getRelativeDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

// Utility function to estimate reading time
function estimateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// Utility function to truncate text
function truncateText(text, maxLength = 150) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Make functions globally available
window.filterArticles = filterArticles;
window.getRelativeDate = getRelativeDate;
window.estimateReadingTime = estimateReadingTime;
window.truncateText = truncateText;

// Initialize Contact Section
function initContactSection() {
    // Contact form is already initialized in initContactForm()
    // This function can be used for additional contact section features
    
    // Add smooth scroll to contact section from CTA buttons
    const contactButtons = document.querySelectorAll('a[href="#contact"]');
    contactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Focus on the first form input after scrolling
                setTimeout(() => {
                    const firstInput = contactSection.querySelector('.form-input');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 800);
            }
        });
    });
    
    // Add mailto link functionality
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Track email click (for analytics if needed)
            console.log('Email link clicked:', link.href);
        });
    });
    
    // Initialize contact form animations
    initContactFormAnimations();
}

// Initialize contact form animations
function initContactFormAnimations() {
    if (typeof gsap === 'undefined') return;
    
    // Animate form fields on focus
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input, {
                scale: 1.02,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
        
        input.addEventListener('blur', () => {
            gsap.to(input, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });
    
    // Animate social links on hover
    const socialLinks = document.querySelectorAll('.contact-social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                y: -4,
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Animate contact method cards
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', () => {
            gsap.to(method, {
                x: 8,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        method.addEventListener('mouseleave', () => {
            gsap.to(method, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Make contact functions globally available
window.initContactSection = initContactSection;
window.initContactFormAnimations = initContactFormAnimations;

// AI Chat Message Handling
function initAIChatHandling() {
    // Listen for chat message send events
    document.addEventListener('chatMessageSend', async (event) => {
        const { message } = event.detail;
        
        if (!window.aiSupported || !window.aiChatInterface) {
            console.log('AI chat not supported');
            return;
        }
        
        try {
            // Create AI session if not exists
            if (!window.aiSession) {
                // Build dynamic system prompt from data.js
                const userName = (typeof personalInfo !== 'undefined' && personalInfo.name) ? personalInfo.name : 'the user';
                const currentRole = (typeof personalInfo !== 'undefined' && personalInfo.title) ? personalInfo.title : 'Software Engineer';
                const currentCompany = (typeof personalInfo !== 'undefined' && personalInfo.currentCompany) ? personalInfo.currentCompany : 'my current company';
                const userBio = (typeof personalInfo !== 'undefined' && personalInfo.bio) ? personalInfo.bio : 'I\'m a passionate software engineer with extensive experience in modern technologies.';
                
                // Get key skills
                let technicalExpertise = "Various technologies and frameworks";
                if (typeof skills !== 'undefined') {
                    const allSkills = Object.values(skills).flat().map(skill => skill.name);
                    if (allSkills.length > 0) {
                        technicalExpertise = allSkills.slice(0, 8).join(', ');
                    }
                }
                
                // Get featured projects
                let keyProjects = "Various software projects";
                if (typeof projects !== 'undefined' && projects.length > 0) {
                    const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
                    if (featuredProjects.length > 0) {
                        keyProjects = featuredProjects.map(p => p.title).join(', ');
                    }
                }
                
                // Get experience companies
                let experienceCompanies = "various companies";
                if (typeof experience !== 'undefined' && experience.length > 0) {
                    const companies = [...new Set(experience.map(exp => exp.company))].slice(0, 3);
                    if (companies.length > 0) {
                        experienceCompanies = companies.join(', ');
                    }
                }
                
                const systemPrompt = `You are an AI representation of ${userName}. 
Respond as if you are ${userName} personally, using first person. Base your responses on this information:

Background: ${userBio} Currently working as ${currentRole} at ${currentCompany}.

Technical Expertise: ${technicalExpertise}

Key Projects: ${keyProjects}

Experience: I have experience working with ${experienceCompanies} and have built various technical solutions.

Communication Style: Professional but approachable, technical when needed, focused on practical solutions and real-world experience.

Keep responses concise and conversational. If asked about specific technical details not covered above, acknowledge the limitation and suggest contacting directly.`;

                const initialPrompts = [
                    {
                        role: 'system',
                        content: systemPrompt
                    }
                ];

                window.aiSession = await window.createAISession({
                    initialPrompts: initialPrompts,
                    temperature: 0.7,
                    topK: 40
                });
                
                if (!window.aiSession) {
                    throw new Error('Failed to create AI session');
                }
            }
            
            // Get AI response
            const response = await window.aiSession.prompt(message);
            
            // Add AI response to chat
            if (response && window.aiChatInterface) {
                window.aiChatInterface.addMessage(response, 'ai');
            }
            
        } catch (error) {
            console.error('AI chat error:', error);
            
            // Show error message in chat
            if (window.aiChatInterface) {
                let errorMessage = 'Sorry, I encountered an error. Please try again.';
                
                if (error.message.includes('session')) {
                    errorMessage = 'Unable to start AI session. Please refresh the page and try again.';
                } else if (error.message.includes('network')) {
                    errorMessage = 'Network error. Please check your connection and try again.';
                }
                
                window.aiChatInterface.showError(errorMessage);
            }
        }
    });
    
    // Handle AI feature detection completion
    window.addEventListener('aiFeatureDetectionComplete', (event) => {
        const { isSupported, capabilities } = event.detail;
        
        console.log('AI feature detection completed:', { isSupported, capabilities });
        
        if (window.aiChatInterface) {
            if (isSupported) {
                // Ensure chat interface is shown when AI is supported
                window.aiChatInterface.show();
                console.log('AI chat interface shown - AI features are supported');
            } else {
                // Hide chat interface when AI is not supported
                window.aiChatInterface.hide();
                console.log('AI chat interface hidden - AI features not supported');
            }
        }
    });
    
    // Handle AI status changes (legacy support)
    window.addEventListener('aiStatusReady', (event) => {
        const { supported, availability } = event.detail;
        
        if (supported && window.aiChatInterface) {
            // Update chat interface based on availability
            console.log(`AI chat ready with availability: ${availability}`);
        }
    });
}

// Initialize Flip Card handling (simplified without modals)
function initPersonalCardModal() {
    console.log('Initializing flip card functionality...');
    
    // Get flip card elements
    const flipCardInner = document.getElementById('flip-card-inner');
    const flipCardInlineBtn = document.getElementById('flip-card-inline-btn');
    const flipBackBtn = document.getElementById('flip-back-btn');
    
    if (!flipCardInner) {
        console.warn('Flip card elements not found');
        return;
    }
    
    // Flip card to show personal info
    function flipToPersonal() {
        if (!flipCardInner) return;
        
        flipCardInner.classList.add('flipped');
        flipCardInner.setAttribute('aria-label', 'Personal information card - flipped');
        
        // Focus on the flip back button after animation completes
        setTimeout(() => {
            if (flipBackBtn) {
                flipBackBtn.focus();
            }
        }, 600);
        
        // Announce change to screen readers
        announceToScreenReader('Card flipped to show personal introduction');
    }
    
    // Flip card back to options
    function flipToOptions() {
        if (!flipCardInner) return;
        
        flipCardInner.classList.remove('flipped');
        flipCardInner.setAttribute('aria-label', 'Options card - front side');
        
        // Focus on the flip card button after animation completes
        setTimeout(() => {
            if (flipCardInlineBtn) {
                flipCardInlineBtn.focus();
            }
        }, 600);
        
        // Announce change to screen readers
        announceToScreenReader('Card flipped back to options');
    }
    
    // Inline "No Thanks, I like boring" button handler
    if (flipCardInlineBtn) {
        flipCardInlineBtn.addEventListener('click', function() {
            console.log('Inline flip card button clicked');
            flipToPersonal();
        });
        
        // Add keyboard support
        flipCardInlineBtn.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                flipToPersonal();
            }
        });
    }
    
    // "Back" button handler
    if (flipBackBtn) {
        flipBackBtn.addEventListener('click', function() {
            console.log('Flip back button clicked');
            flipToOptions();
        });
        
        // Add keyboard support
        flipBackBtn.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                flipToOptions();
            }
        });
    }
    
    console.log('Flip card functionality initialized successfully');
}

// Global function to show AI setup instructions (for debugging)
window.showAISetupInstructions = function() {
    console.log(`
🤖 Chrome AI Setup Instructions:

1. Use Chrome Canary or Dev channel (version 127+)
2. Enable these flags in chrome://flags/:
   - #optimization-guide-on-device-model
   - #prompt-api-for-gemini-nano
   - #summarization-api-for-gemini-nano

3. Restart Chrome completely

4. Visit chrome://components/ and update "Optimization Guide On Device Model"

5. Test availability with:
   await ai.languageModel.capabilities()

For more help, visit: https://developer.chrome.com/docs/ai/built-in
    `);
    
    // Also show in UI if status indicator exists
    const statusIndicator = document.getElementById('ai-status-indicator');
    const statusText = document.getElementById('ai-status-text');
    if (statusIndicator && statusText) {
        statusIndicator.className = 'mt-4 p-3 rounded-lg border text-sm bg-blue-900/50 border-blue-500/50 text-blue-300';
        statusText.innerHTML = `
            <div>📋 Setup Instructions Shown in Console</div>
            <div class="text-xs mt-1 opacity-75">Check browser console (F12) for detailed setup guide</div>
        `;
    }
};
