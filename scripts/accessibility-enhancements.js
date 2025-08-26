/**
 * Accessibility Enhancement Script
 * Provides additional accessibility features and keyboard navigation improvements
 */

class AccessibilityEnhancer {
    constructor() {
        this.isKeyboardUser = false;
        this.currentSection = null;
        this.liveRegion = null;
        this.init();
    }

    init() {
        this.setupKeyboardDetection();
        this.setupLiveRegion();
        this.setupSectionTracking();
        this.setupSkipLinkEnhancements();
        this.setupFocusManagement();
        this.setupResponsiveEnhancements();
        this.announcePageLoad();
    }

    setupKeyboardDetection() {
        // Detect keyboard usage
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.isKeyboardUser = true;
                document.body.classList.add('keyboard-navigation-active');
            }
        });

        // Detect mouse usage
        document.addEventListener('mousedown', () => {
            this.isKeyboardUser = false;
            document.body.classList.remove('keyboard-navigation-active');
        });

        // Handle escape key for skip links
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const skipNav = document.querySelector('nav[aria-label="Skip navigation links"]');
                if (skipNav && skipNav.contains(document.activeElement)) {
                    document.getElementById('main-content').focus();
                }
            }
        });
    }

    setupLiveRegion() {
        this.liveRegion = document.getElementById('live-region');
        if (!this.liveRegion) {
            this.liveRegion = document.createElement('div');
            this.liveRegion.id = 'live-region';
            this.liveRegion.setAttribute('aria-live', 'polite');
            this.liveRegion.setAttribute('aria-atomic', 'true');
            this.liveRegion.className = 'sr-only';
            document.body.appendChild(this.liveRegion);
        }
    }

    setupSectionTracking() {
        // Track current section for screen readers
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    this.updateCurrentSection(entry.target);
                }
            });
        }, {
            threshold: [0.5],
            rootMargin: '-20% 0px -20% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    updateCurrentSection(section) {
        // Remove previous current section indicator
        if (this.currentSection) {
            this.currentSection.removeAttribute('aria-current');
        }

        // Set new current section
        this.currentSection = section;
        section.setAttribute('aria-current', 'location');

        // Announce section change to screen readers
        const sectionName = this.getSectionName(section);
        if (sectionName && this.isKeyboardUser) {
            this.announce(`Now viewing ${sectionName} section`);
        }
    }

    getSectionName(section) {
        const headingElement = section.querySelector('h1, h2, h3, h4, h5, h6');
        if (headingElement) {
            return headingElement.textContent.trim();
        }
        
        const sectionNames = {
            'hero': 'Introduction',
            'skills': 'Skills',
            'experience': 'Experience',
            'projects': 'Projects',
            'background': 'Background',
            'contact': 'Contact'
        };
        
        return sectionNames[section.id] || section.id;
    }

    setupSkipLinkEnhancements() {
        const skipLinks = document.querySelectorAll('nav[aria-label="Skip navigation links"] a');
        
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    // Smooth scroll to target
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    
                    // Focus the target element
                    setTimeout(() => {
                        target.focus();
                        this.announce(`Jumped to ${this.getSectionName(target)} section`);
                    }, 500);
                }
            });
        });
    }

    setupFocusManagement() {
        // Ensure focusable elements are properly managed
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            // Add focus event listeners for better screen reader support
            element.addEventListener('focus', () => {
                if (this.isKeyboardUser) {
                    // Announce focused element context if needed
                    const context = this.getFocusContext(element);
                    if (context) {
                        setTimeout(() => this.announce(context), 100);
                    }
                }
            });
        });
    }

    getFocusContext(element) {
        // Provide additional context for complex UI elements
        if (element.closest('.skill-overview-card')) {
            return 'Skill category card - press Enter to view details';
        }
        
        if (element.closest('.project-card')) {
            return 'Project card with multiple action links';
        }
        
        if (element.closest('.experience-card')) {
            return 'Work experience entry';
        }
        
        return null;
    }

    setupResponsiveEnhancements() {
        // Add responsive classes based on screen size
        const updateResponsiveClasses = () => {
            const width = window.innerWidth;
            const body = document.body;
            
            // Remove existing responsive classes
            body.classList.remove('mobile', 'tablet', 'desktop', 'large-desktop');
            
            // Add appropriate class
            if (width < 768) {
                body.classList.add('mobile');
            } else if (width < 1024) {
                body.classList.add('tablet');
            } else if (width < 1280) {
                body.classList.add('desktop');
            } else {
                body.classList.add('large-desktop');
            }
        };

        // Initial setup
        updateResponsiveClasses();
        
        // Update on resize
        window.addEventListener('resize', updateResponsiveClasses);

        // Add touch device detection
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('touch-device');
        }
    }

    announcePageLoad() {
        // Announce page load completion to screen readers
        setTimeout(() => {
            const userName = (typeof personalInfo !== 'undefined' && personalInfo.name) ? personalInfo.name : 'User';
            this.announce(`Page loaded. ${userName}'s portfolio website. Use skip links or tab to navigate.`);
        }, 1000);
    }

    announce(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
            
            // Clear the message after a delay to allow for re-announcements
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
    }

    // Public method to announce custom messages
    static announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
}

// Enhanced responsive image loading
class ResponsiveImageLoader {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupResponsiveImages();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('image-loading');
                        
                        img.addEventListener('load', () => {
                            img.classList.remove('image-loading');
                            img.classList.add('image-loaded');
                        });
                        
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    setupResponsiveImages() {
        // Add responsive behavior to images
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Ensure images don't cause layout shift
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                img.addEventListener('load', () => {
                    // Set aspect ratio to prevent layout shift
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    img.style.aspectRatio = aspectRatio;
                });
            }
        });
    }
}

// Initialize accessibility enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityEnhancer();
    new ResponsiveImageLoader();
    
    // Add global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt + 1-6 for quick section navigation
        if (e.altKey && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const sections = ['hero', 'skills', 'experience', 'projects', 'background', 'contact'];
            const sectionId = sections[parseInt(e.key) - 1];
            const section = document.getElementById(sectionId);
            
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                section.focus();
                AccessibilityEnhancer.announce(`Navigated to ${sectionId} section`);
            }
        }
        
        // Alt + H for home/top
        if (e.altKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.getElementById('main-content').focus();
            AccessibilityEnhancer.announce('Navigated to top of page');
        }
    });
});

// Export for use in other scripts
window.AccessibilityEnhancer = AccessibilityEnhancer;
