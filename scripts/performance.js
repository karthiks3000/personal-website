// Performance optimization utilities for Karthik's Personal Website

// Performance monitoring and optimization
class PerformanceOptimizer {
    constructor() {
        this.isLowEndDevice = this.detectLowEndDevice();
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.connectionType = this.getConnectionType();
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageErrorHandling();
        this.setupPerformanceMonitoring();
        this.optimizeAnimations();
        this.setupGracefulDegradation();
        this.monitorCoreWebVitals();
    }

    // Detect low-end devices based on hardware capabilities
    detectLowEndDevice() {
        const hardwareConcurrency = navigator.hardwareConcurrency || 1;
        const deviceMemory = navigator.deviceMemory || 1;
        const connection = navigator.connection;
        
        // Consider device low-end if:
        // - Less than 4 CPU cores
        // - Less than 4GB RAM
        // - Slow connection
        const isLowCPU = hardwareConcurrency < 4;
        const isLowMemory = deviceMemory < 4;
        const isSlowConnection = connection && (
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' ||
            connection.effectiveType === '3g'
        );

        return isLowCPU || isLowMemory || isSlowConnection;
    }

    // Get connection type for optimization decisions
    getConnectionType() {
        const connection = navigator.connection;
        if (!connection) return 'unknown';
        
        return {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
        };
    }

    // Setup lazy loading for images and heavy content
    setupLazyLoading() {
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            // Lazy load heavy animations
            const animationObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        this.loadHeavyAnimation(element);
                        observer.unobserve(element);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.1
            });

            // Observe elements with heavy animations
            document.querySelectorAll('[data-heavy-animation]').forEach(element => {
                animationObserver.observe(element);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImagesImmediately();
        }
    }

    // Load image with error handling and optimization
    loadImage(img) {
        const src = img.dataset.src;
        const fallbackSrc = img.dataset.fallback;
        
        if (!src) return;

        // Create a new image to test loading
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            img.src = src;
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            
            // Add fade-in animation if not reduced motion
            if (!this.prefersReducedMotion && typeof gsap !== 'undefined') {
                gsap.fromTo(img, 
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: "power2.out" }
                );
            } else {
                img.style.opacity = '1';
            }
        };

        imageLoader.onerror = () => {
            this.handleImageError(img, fallbackSrc);
        };

        // Add loading class
        img.classList.add('lazy-loading');
        
        // Start loading
        imageLoader.src = src;
    }

    // Handle image loading errors
    handleImageError(img, fallbackSrc) {
        console.warn(`Failed to load image: ${img.dataset.src}`);
        
        if (fallbackSrc) {
            img.src = fallbackSrc;
        } else {
            // Create a placeholder
            this.createImagePlaceholder(img);
        }
        
        img.classList.remove('lazy-loading');
        img.classList.add('lazy-error');
    }

    // Create placeholder for failed images
    createImagePlaceholder(img) {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.cssText = `
            width: ${img.offsetWidth || 200}px;
            height: ${img.offsetHeight || 200}px;
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64748b;
            font-size: 14px;
            text-align: center;
            padding: 1rem;
        `;
        placeholder.innerHTML = `
            <div>
                <i data-lucide="image-off" style="width: 24px; height: 24px; margin-bottom: 8px;"></i>
                <div>Image unavailable</div>
            </div>
        `;
        
        img.parentNode.replaceChild(placeholder, img);
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Load all images immediately (fallback)
    loadAllImagesImmediately() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.loadImage(img);
        });
    }

    // Setup comprehensive image error handling
    setupImageErrorHandling() {
        // Handle all image errors globally
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target, e.target.dataset.fallback);
            }
        }, true);

        // Add error handling to existing images
        document.querySelectorAll('img').forEach(img => {
            if (!img.complete || img.naturalHeight === 0) {
                img.addEventListener('error', (e) => {
                    this.handleImageError(e.target, e.target.dataset.fallback);
                });
            }
        });
    }

    // Load heavy animations based on device capabilities
    loadHeavyAnimation(element) {
        const animationType = element.dataset.heavyAnimation;
        
        // Skip heavy animations on low-end devices or slow connections
        if (this.isLowEndDevice || this.connectionType.saveData) {
            element.classList.add('animation-disabled');
            return;
        }

        // Load animation based on type
        switch (animationType) {
            case 'particles':
                this.loadParticleAnimation(element);
                break;
            case 'complex-gsap':
                this.loadComplexGSAPAnimation(element);
                break;
            case 'css-heavy':
                this.loadHeavyCSSAnimation(element);
                break;
            default:
                element.classList.add('animation-loaded');
        }
    }

    // Load particle animation
    loadParticleAnimation(element) {
        if (typeof particlesJS !== 'undefined' && !this.prefersReducedMotion && window.particleConfig) {
            // Reduce particle count on mobile or low-end devices
            const particleCount = window.innerWidth < 768 || this.isLowEndDevice ? 40 : 80;
            
            const config = {
                ...window.particleConfig,
                particles: {
                    ...window.particleConfig.particles,
                    number: {
                        value: particleCount,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    }
                }
            };
            
            particlesJS(element.id, config);
        }
        element.classList.add('animation-loaded');
    }

    // Load complex GSAP animations
    loadComplexGSAPAnimation(element) {
        if (typeof gsap !== 'undefined' && !this.prefersReducedMotion) {
            // Reduce animation complexity on low-end devices
            const duration = this.isLowEndDevice ? 0.3 : 0.6;
            const ease = this.isLowEndDevice ? "power2.out" : "back.out(1.7)";
            
            gsap.from(element.children, {
                duration: duration,
                y: 30,
                opacity: 0,
                stagger: this.isLowEndDevice ? 0.05 : 0.1,
                ease: ease
            });
        }
        element.classList.add('animation-loaded');
    }

    // Load heavy CSS animations
    loadHeavyCSSAnimation(element) {
        if (!this.prefersReducedMotion) {
            element.classList.add('css-animation-enabled');
        }
        element.classList.add('animation-loaded');
    }

    // Optimize animations based on device capabilities
    optimizeAnimations() {
        if (this.prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
            return;
        }

        if (this.isLowEndDevice) {
            document.body.classList.add('low-end-device');
            
            // Reduce GSAP animation quality
            if (typeof gsap !== 'undefined') {
                gsap.defaults({
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Limit frame rate
                gsap.ticker.fps(30);
            }
            
            // Disable complex CSS animations
            const style = document.createElement('style');
            style.textContent = `
                .low-end-device .floating-element,
                .low-end-device .timeline-node,
                .low-end-device .icon-pulse {
                    animation: none !important;
                }
                .low-end-device .fun-fact-card:hover .fun-fact-inner {
                    transform: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Setup graceful degradation for JavaScript-disabled browsers
    setupGracefulDegradation() {
        // Add noscript fallbacks
        const noscriptStyle = document.createElement('noscript');
        noscriptStyle.innerHTML = `
            <style>
                .hero-title, .hero-subtitle, .hero-tagline, 
                .hero-social, .hero-cta, .scroll-indicator {
                    opacity: 1 !important;
                }
                .mobile-menu-button { display: none; }
                #mobile-menu { display: block; position: static; opacity: 1; transform: none; }
                .project-filter-btn.active { background-color: #2563eb; color: white; }
                .lazy-loading { opacity: 1; }
            </style>
        `;
        document.head.appendChild(noscriptStyle);

        // Provide fallback functionality
        this.setupFallbackNavigation();
        this.setupFallbackForms();
    }

    // Setup fallback navigation for non-JS browsers
    setupFallbackNavigation() {
        // Ensure all navigation links work without JavaScript
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            // Add fallback smooth scrolling with CSS
            link.style.scrollBehavior = 'smooth';
        });
    }

    // Setup fallback forms
    setupFallbackForms() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm && !contactForm.hasAttribute('action')) {
            // Add mailto fallback
            contactForm.setAttribute('action', 'mailto:contact@karthiks3000.dev');
            contactForm.setAttribute('method', 'post');
            contactForm.setAttribute('enctype', 'text/plain');
        }
    }

    // Monitor Core Web Vitals
    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observeLCP();
        
        // First Input Delay (FID)
        this.observeFID();
        
        // Cumulative Layout Shift (CLS)
        this.observeCLS();
        
        // Custom metrics
        this.monitorCustomMetrics();
    }

    // Observe Largest Contentful Paint
    observeLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                console.log('LCP:', lastEntry.startTime);
                
                // Take action if LCP is poor (> 2.5s)
                if (lastEntry.startTime > 2500) {
                    this.optimizeForPoorLCP();
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    // Observe First Input Delay
    observeFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                    
                    // Take action if FID is poor (> 100ms)
                    if (entry.processingStart - entry.startTime > 100) {
                        this.optimizeForPoorFID();
                    }
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        }
    }

    // Observe Cumulative Layout Shift
    observeCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                
                console.log('CLS:', clsValue.toFixed(4));
                
                // Take action if CLS is poor (> 0.1)
                if (clsValue > 0.1) {
                    this.optimizeForPoorCLS();
                } else if (clsValue > 0.05) {
                    console.log('CLS needs improvement but is within acceptable range');
                }
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }

    // Monitor custom performance metrics
    monitorCustomMetrics() {
        // Time to Interactive
        window.addEventListener('load', () => {
            if (performance && performance.now) {
                // Use performance.now() for more accurate timing
                const loadTime = performance.now();
                console.log('Page Load Time:', Math.round(loadTime) + 'ms');
                
                // Log to analytics or monitoring service
                this.logMetric('page_load_time', Math.round(loadTime));
            }
        });

        // JavaScript errors
        window.addEventListener('error', (e) => {
            // Only log meaningful errors, not null/undefined errors
            if (e.error && e.message && e.message !== 'Script error.') {
                console.error('JavaScript Error:', e.error);
                this.logMetric('javascript_error', {
                    message: e.message || 'Unknown error',
                    filename: e.filename || 'Unknown file',
                    lineno: e.lineno || 0,
                    colno: e.colno || 0
                });
            }
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            if (e.reason) {
                console.error('Unhandled Promise Rejection:', e.reason);
                const reasonText = typeof e.reason === 'string' ? e.reason : 'Promise rejection occurred';
                this.logMetric('promise_rejection', reasonText);
            }
        });
    }

    // Optimize for poor LCP
    optimizeForPoorLCP() {
        console.log('Optimizing for poor LCP...');
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Reduce image sizes
        this.optimizeImages();
        
        // Defer non-critical JavaScript
        this.deferNonCriticalJS();
    }

    // Optimize for poor FID
    optimizeForPoorFID() {
        console.log('Optimizing for poor FID...');
        
        // Break up long tasks
        this.breakUpLongTasks();
        
        // Reduce JavaScript execution time
        this.reduceJSExecutionTime();
    }

    // Optimize for poor CLS
    optimizeForPoorCLS() {
        console.log('Optimizing for poor CLS...');
        
        // Add size attributes to images
        this.addImageDimensions();
        
        // Reserve space for dynamic content
        this.reserveSpaceForDynamicContent();
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            { href: 'me.jpg', as: 'image' },
            { href: 'styles/main.css', as: 'style' },
            { href: 'scripts/main.js', as: 'script' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    // Optimize images for better performance
    optimizeImages() {
        document.querySelectorAll('img').forEach(img => {
            // Add loading="lazy" if not already present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding="async" for better performance
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }

    // Defer non-critical JavaScript
    deferNonCriticalJS() {
        const nonCriticalScripts = document.querySelectorAll('script[src*="particles"], script[src*="aos"]');
        nonCriticalScripts.forEach(script => {
            script.defer = true;
        });
    }

    // Break up long tasks
    breakUpLongTasks() {
        // Use scheduler.postTask if available, otherwise setTimeout
        const scheduler = window.scheduler;
        
        if (scheduler && scheduler.postTask) {
            // Use modern scheduler API
            this.scheduleWithPostTask();
        } else {
            // Fallback to setTimeout
            this.scheduleWithTimeout();
        }
    }

    // Schedule tasks with postTask API
    scheduleWithPostTask() {
        const scheduler = window.scheduler;
        
        // Schedule non-critical animations with lower priority
        scheduler.postTask(() => {
            if (window.AnimationUtils) {
                window.AnimationUtils.initMicroInteractions();
            }
        }, { priority: 'background' });
    }

    // Schedule tasks with setTimeout
    scheduleWithTimeout() {
        setTimeout(() => {
            if (window.AnimationUtils) {
                window.AnimationUtils.initMicroInteractions();
            }
        }, 0);
    }

    // Reduce JavaScript execution time
    reduceJSExecutionTime() {
        // Disable heavy animations on poor FID
        document.body.classList.add('reduced-animations');
        
        // Reduce GSAP complexity
        if (typeof gsap !== 'undefined') {
            gsap.defaults({
                duration: 0.2,
                ease: "power1.out"
            });
        }
    }

    // Add dimensions to images to prevent CLS
    addImageDimensions() {
        document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
            // Set aspect ratio to prevent layout shift
            img.style.aspectRatio = '16/9'; // Default aspect ratio
            img.style.width = '100%';
            img.style.height = 'auto';
        });
    }

    // Reserve space for dynamic content
    reserveSpaceForDynamicContent() {
        // Add min-height to containers that will have dynamic content
        const dynamicContainers = document.querySelectorAll(
            '#fun-facts-container, #personality-traits-container, #personal-interests-container, #experience-timeline, #projects-grid, #skills-categories, #articles-grid'
        );
        
        dynamicContainers.forEach(container => {
            if (!container.style.minHeight) {
                container.style.minHeight = '200px';
            }
        });
    }

    // Log metrics (placeholder for analytics integration)
    logMetric(name, value) {
        // In a real implementation, you would send this to your analytics service
        console.log(`Metric: ${name}`, value);
        
        // Example: Send to Google Analytics, DataDog, etc.
        // gtag('event', name, { value: value });
    }

    // Setup performance monitoring
    setupPerformanceMonitoring() {
        // Monitor resource loading
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    // Log slow resources
                    if (entry.duration > 1000) {
                        console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
                    }
                });
            });
            
            resourceObserver.observe({ entryTypes: ['resource'] });
        }

        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const longTaskObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.warn(`Long task detected: ${entry.duration}ms`);
                    this.logMetric('long_task', entry.duration);
                });
            });
            
            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // longtask not supported in all browsers
                console.log('Long task monitoring not supported');
            }
        }
    }
}

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.PerformanceOptimizer = new PerformanceOptimizer();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}