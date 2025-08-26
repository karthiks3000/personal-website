/**
 * Smooth Scrolling and Subtle Animations
 * Implements performance-optimized animations with respect for user preferences
 */

// Animation configuration
const ANIMATION_CONFIG = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    animationDuration: 600,
    staggerDelay: 100
};

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Initialize all animations and accessibility features when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Always initialize accessibility features
    initAccessibilityFeatures();
    initKeyboardNavigation();
    initScrollProgressIndicator();
    initSmoothScrolling();
    
    // Only initialize animations if user doesn't prefer reduced motion
    if (!prefersReducedMotion) {
        initFadeInAnimations();
    }
    
    // Initialize responsive features
    initResponsiveFeatures();
    
    // Initialize interactive skills
    initInteractiveSkills();
    
    // Initialize projects section
    initProjectsAnimations();
    initProjectsAccessibility();
    initProjectsMobileOptimizations();
});

/**
 * Scroll Progress Indicator
 * Shows reading progress at the top of the page
 */
function initScrollProgressIndicator() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.className = 'fixed top-0 left-0 h-1 bg-blue-400 z-50 transition-all duration-300 ease-out';
    progressBar.style.width = '0%';
    progressBar.setAttribute('aria-hidden', 'true');
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-label', 'Page scroll progress');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', '0');
    
    // Insert at the beginning of body
    document.body.insertBefore(progressBar, document.body.firstChild);
    
    // Update progress on scroll
    let ticking = false;
    
    function updateScrollProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        
        progressBar.style.width = `${scrollPercent}%`;
        progressBar.setAttribute('aria-valuenow', Math.round(scrollPercent));
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    
    // Initial update
    updateScrollProgress();
}

/**
 * Fade-in Animations using Intersection Observer
 * Animates elements as they come into view
 */
function initFadeInAnimations() {
    // Add animation classes to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.classList.add('animate-on-scroll');
        section.style.setProperty('--animation-delay', `${index * ANIMATION_CONFIG.staggerDelay}ms`);
    });
    
    // Add animation classes to other elements
    const animatedElements = document.querySelectorAll('h1, h2, h3, .hero-content, .contact-links');
    animatedElements.forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        element.style.setProperty('--animation-delay', `${index * 50}ms`);
    });
    
    // Create Intersection Observer
    const observerOptions = {
        threshold: ANIMATION_CONFIG.threshold,
        rootMargin: ANIMATION_CONFIG.rootMargin
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                
                // Clean up will-change property after animation completes
                setTimeout(() => {
                    entry.target.classList.add('animation-complete');
                }, ANIMATION_CONFIG.animationDuration + 100);
                
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

/**
 * Enhanced Smooth Scrolling
 * Adds smooth scrolling behavior for anchor links
 */
function initSmoothScrolling() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Account for any fixed headers
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Utility function to add staggered animations to child elements
 */
function addStaggeredAnimation(parentSelector, childSelector, delay = 100) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;
    
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, index) => {
        child.classList.add('animate-on-scroll');
        child.style.setProperty('--animation-delay', `${index * delay}ms`);
    });
}

/**
 * Performance monitoring for animations
 */
function monitorAnimationPerformance() {
    if ('performance' in window && 'observe' in window.PerformanceObserver.prototype) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 16) { // More than one frame at 60fps
                    console.warn('Long animation frame detected:', entry.duration + 'ms');
                }
            });
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }
}

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    monitorAnimationPerformance();
}

/**
 * Accessibility Features
 * Enhances keyboard navigation and screen reader support
 */
function initAccessibilityFeatures() {
    // Add live region for dynamic content announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Announce page load completion
    setTimeout(() => {
        announceToScreenReader('Page loaded successfully. Use Tab to navigate or scroll to explore content.');
    }, 1000);
    
    // Handle focus management for skip links
    const skipLinks = document.querySelectorAll('a[href^="#"]');
    skipLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                // Set focus to target element
                target.setAttribute('tabindex', '-1');
                target.focus();
                
                // Remove tabindex after focus to restore natural tab order
                target.addEventListener('blur', () => {
                    target.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    });
    
    // Add aria-current to indicate current section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove aria-current from all sections
                document.querySelectorAll('section[aria-current]').forEach(section => {
                    section.removeAttribute('aria-current');
                });
                
                // Add aria-current to visible section
                entry.target.setAttribute('aria-current', 'location');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Enhanced Keyboard Navigation
 * Improves keyboard accessibility throughout the site
 */
function initKeyboardNavigation() {
    // Track focus for better keyboard navigation
    let focusedElement = null;
    
    document.addEventListener('focusin', (e) => {
        focusedElement = e.target;
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'Escape':
                // Close any open modals or return focus to main content
                if (focusedElement && focusedElement !== document.body) {
                    document.getElementById('main-content').focus();
                }
                break;
                
            case 'Home':
                // Navigate to top of page
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    document.getElementById('main-content').focus();
                }
                break;
                
            case 'End':
                // Navigate to bottom of page
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    document.querySelector('footer').focus();
                }
                break;
        }
    });
    
    // Improve focus visibility for keyboard users
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add roving tabindex for better navigation in groups
    const contactLinks = document.querySelectorAll('.contact-links a');
    if (contactLinks.length > 0) {
        setupRovingTabindex(contactLinks);
    }
}

/**
 * Responsive Features
 * Handles responsive behavior and mobile optimizations
 */
function initResponsiveFeatures() {
    // Handle viewport changes
    const handleViewportChange = () => {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        // Update body classes for responsive styling
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet);
        document.body.classList.toggle('desktop', !isMobile && !isTablet);
        
        // Announce viewport changes to screen readers
        if (isMobile) {
            announceToScreenReader('Mobile view active');
        } else if (isTablet) {
            announceToScreenReader('Tablet view active');
        } else {
            announceToScreenReader('Desktop view active');
        }
    };
    
    // Initial check
    handleViewportChange();
    
    // Listen for resize events with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleViewportChange, 250);
    });
    
    // Handle orientation changes on mobile
    window.addEventListener('orientationchange', () => {
        setTimeout(handleViewportChange, 100);
    });
    
    // Optimize touch interactions on mobile
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Improve touch target sizes
        const touchTargets = document.querySelectorAll('a, button');
        touchTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                target.style.minWidth = '44px';
                target.style.minHeight = '44px';
                target.style.display = 'inline-flex';
                target.style.alignItems = 'center';
                target.style.justifyContent = 'center';
            }
        });
    }
}

/**
 * Setup roving tabindex for better keyboard navigation in groups
 */
function setupRovingTabindex(elements) {
    let currentIndex = 0;
    
    // Set initial tabindex
    elements.forEach((element, index) => {
        element.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
    
    elements.forEach((element, index) => {
        element.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % elements.length;
                    updateTabindex();
                    elements[currentIndex].focus();
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    currentIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
                    updateTabindex();
                    elements[currentIndex].focus();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    currentIndex = 0;
                    updateTabindex();
                    elements[currentIndex].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    currentIndex = elements.length - 1;
                    updateTabindex();
                    elements[currentIndex].focus();
                    break;
            }
        });
        
        element.addEventListener('focus', () => {
            currentIndex = index;
            updateTabindex();
        });
    });
    
    function updateTabindex() {
        elements.forEach((element, index) => {
            element.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
        });
    }
}

/**
 * Announce messages to screen readers
 */
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        
        // Clear the message after a short delay to allow for re-announcements
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

/**
 * Interactive Skills Section
 * Handles switching between different skill categories
 */
function initInteractiveSkills() {
    const skillCards = document.querySelectorAll('.skill-overview-card');
    const skillPanels = document.querySelectorAll('.skills-detail-panel');
    
    if (skillCards.length === 0 || skillPanels.length === 0) return;
    
    // Set initial active state (backend by default)
    const defaultCategory = 'backend';
    setActiveSkillCategory(defaultCategory);
    
    // Add click handlers to skill cards
    skillCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const category = card.getAttribute('data-category');
            setActiveSkillCategory(category);
            
            // Announce change to screen readers
            announceToScreenReader(`Switched to ${category} skills`);
        });
        
        // Add keyboard support
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const category = card.getAttribute('data-category');
                setActiveSkillCategory(category);
                announceToScreenReader(`Switched to ${category} skills`);
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View ${card.getAttribute('data-category')} skills`);
    });
}

/**
 * Set active skill category
 */
function setActiveSkillCategory(category) {
    const skillCards = document.querySelectorAll('.skill-overview-card');
    const skillPanels = document.querySelectorAll('.skills-detail-panel');
    
    // Update card states
    skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (cardCategory === category) {
            card.classList.add('active');
            card.setAttribute('aria-pressed', 'true');
        } else {
            card.classList.remove('active');
            card.setAttribute('aria-pressed', 'false');
        }
    });
    
    // Update panel states
    skillPanels.forEach(panel => {
        const panelCategory = panel.getAttribute('data-category');
        if (panelCategory === category) {
            panel.classList.add('active');
            
            // Animate skill badges with stagger if animations are enabled
            if (!prefersReducedMotion) {
                const badges = panel.querySelectorAll('.skill-badge');
                badges.forEach((badge, index) => {
                    badge.style.opacity = '0';
                    badge.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        badge.style.transition = 'all 0.4s ease';
                        badge.style.opacity = '1';
                        badge.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        } else {
            panel.classList.remove('active');
        }
    });
}

/**
 * Experience Section Animations
 * Handles timeline animations and interactive elements
 */
function initExperienceAnimations() {
    if (prefersReducedMotion) return;
    
    const experienceItems = document.querySelectorAll('#experience .experience-item');
    const timelineDots = document.querySelectorAll('#experience .timeline-dot');
    
    if (experienceItems.length === 0) return;
    
    // Add staggered animation classes to experience items
    experienceItems.forEach((item, index) => {
        item.classList.add('animate-on-scroll');
        item.style.setProperty('--animation-delay', `${index * 200}ms`);
    });
    
    // Create intersection observer for experience items
    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                
                // Animate timeline dot
                const timelineDot = entry.target.querySelector('.timeline-dot');
                if (timelineDot) {
                    setTimeout(() => {
                        timelineDot.style.transform = 'scale(1.1)';
                        timelineDot.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.5)';
                        
                        setTimeout(() => {
                            timelineDot.style.transform = 'scale(1)';
                            timelineDot.style.boxShadow = 'none';
                        }, 300);
                    }, 200);
                }
                
                // Animate achievement items with stagger
                const achievementItems = entry.target.querySelectorAll('.achievement-item');
                achievementItems.forEach((achievement, index) => {
                    setTimeout(() => {
                        achievement.style.opacity = '1';
                        achievement.style.transform = 'translateX(0)';
                    }, 400 + (index * 100));
                });
                
                // Animate technology tags with stagger
                const techTags = entry.target.querySelectorAll('.tech-tag');
                techTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0)';
                    }, 600 + (index * 50));
                });
                
                experienceObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe experience items
    experienceItems.forEach(item => {
        experienceObserver.observe(item);
        
        // Set initial states for animated elements
        const achievementItems = item.querySelectorAll('.achievement-item');
        const techTags = item.querySelectorAll('.tech-tag');
        
        achievementItems.forEach(achievement => {
            achievement.style.opacity = '0';
            achievement.style.transform = 'translateX(-20px)';
            achievement.style.transition = 'all 0.4s ease';
        });
        
        techTags.forEach(tag => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px)';
            tag.style.transition = 'all 0.3s ease';
        });
    });
    
    // Add hover effects for timeline dots
    timelineDots.forEach(dot => {
        dot.addEventListener('mouseenter', () => {
            if (!prefersReducedMotion) {
                dot.style.transform = 'scale(1.2)';
                dot.style.boxShadow = '0 0 20px rgba(96, 165, 250, 0.5)';
            }
        });
        
        dot.addEventListener('mouseleave', () => {
            if (!prefersReducedMotion) {
                dot.style.transform = 'scale(1)';
                dot.style.boxShadow = 'none';
            }
        });
        
        // Add focus effects for accessibility
        dot.addEventListener('focus', () => {
            dot.style.outline = '2px solid var(--accent-blue)';
            dot.style.outlineOffset = '4px';
            if (!prefersReducedMotion) {
                dot.style.transform = 'scale(1.2)';
            }
        });
        
        dot.addEventListener('blur', () => {
            dot.style.outline = 'none';
            dot.style.outlineOffset = '0';
            if (!prefersReducedMotion) {
                dot.style.transform = 'scale(1)';
            }
        });
    });
}

/**
 * Experience Section Accessibility
 * Enhances keyboard navigation and screen reader support for timeline
 */
function initExperienceAccessibility() {
    const experienceCards = document.querySelectorAll('#experience .experience-card');
    const timelineDots = document.querySelectorAll('#experience .timeline-dot');
    
    // Make timeline dots focusable and add ARIA labels
    timelineDots.forEach((dot, index) => {
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `View experience item ${index + 1}`);
        
        // Add keyboard interaction
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const experienceCard = dot.closest('.experience-item').querySelector('.experience-card');
                if (experienceCard) {
                    experienceCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    experienceCard.focus();
                    announceToScreenReader(`Focused on experience: ${experienceCard.querySelector('h3').textContent}`);
                }
            }
        });
    });
    
    // Enhance experience cards for accessibility
    experienceCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        
        const companyElement = card.querySelector('.text-lg');
        const positionElement = card.querySelector('h3');
        if (companyElement && positionElement) {
            const company = companyElement.textContent;
            const position = positionElement.textContent;
            card.setAttribute('aria-label', `${position} at ${company}`);
        }
        
        // Add keyboard navigation between cards
        card.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextCard = experienceCards[index + 1];
                    if (nextCard) {
                        nextCard.focus();
                        nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    const prevCard = experienceCards[index - 1];
                    if (prevCard) {
                        prevCard.focus();
                        prevCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    break;
            }
        });
    });
    
    // Add ARIA labels to achievement lists
    const achievementLists = document.querySelectorAll('#experience .achievement-list');
    achievementLists.forEach(list => {
        list.setAttribute('role', 'list');
        list.setAttribute('aria-label', 'Key achievements');
        
        const items = list.querySelectorAll('.achievement-item');
        items.forEach(item => {
            item.setAttribute('role', 'listitem');
        });
    });
    
    // Add ARIA labels to technology tag groups
    const techTagGroups = document.querySelectorAll('#experience .tech-tags');
    techTagGroups.forEach(group => {
        group.setAttribute('role', 'list');
        group.setAttribute('aria-label', 'Technologies used');
        
        const tags = group.querySelectorAll('.tech-tag');
        tags.forEach(tag => {
            tag.setAttribute('role', 'listitem');
        });
    });
}

/**
 * Experience Section Mobile Optimizations
 * Handles mobile-specific interactions and layout adjustments
 */
function initExperienceMobileOptimizations() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        const experienceCards = document.querySelectorAll('#experience .experience-card');
        
        // Optimize touch interactions
        experienceCards.forEach(card => {
            // Add touch feedback
            card.addEventListener('touchstart', () => {
                card.style.backgroundColor = 'rgba(96, 165, 250, 0.05)';
            }, { passive: true });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.style.backgroundColor = '';
                }, 150);
            }, { passive: true });
            
            // Improve readability on mobile
            const achievements = card.querySelectorAll('.achievement-item');
            achievements.forEach(achievement => {
                achievement.style.fontSize = '0.875rem';
                achievement.style.lineHeight = '1.5';
            });
            
            const techTags = card.querySelectorAll('.tech-tag');
            techTags.forEach(tag => {
                tag.style.fontSize = '0.75rem';
                tag.style.padding = '0.25rem 0.5rem';
            });
        });
        
        // Simplify timeline on mobile
        const timelineDots = document.querySelectorAll('#experience .timeline-dot');
        timelineDots.forEach(dot => {
            dot.style.width = '0.75rem';
            dot.style.height = '0.75rem';
        });
    }
}

/**
 * Projects Section Animations
 * Handles project card animations and interactive elements
 */
function initProjectsAnimations() {
    if (prefersReducedMotion) return;
    
    const projectCards = document.querySelectorAll('#projects .project-card');
    
    if (projectCards.length === 0) return;
    
    // Add staggered animation classes to project cards
    projectCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.setProperty('--animation-delay', `${index * 150}ms`);
    });
    
    // Create intersection observer for project cards
    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                
                // Animate project elements with stagger
                const projectIcon = entry.target.querySelector('.w-12.h-12');
                const techTags = entry.target.querySelectorAll('.px-3.py-1');
                const projectLinks = entry.target.querySelectorAll('a');
                
                // Animate project icon
                if (projectIcon) {
                    setTimeout(() => {
                        projectIcon.style.transform = 'scale(1.1) rotate(5deg)';
                        setTimeout(() => {
                            projectIcon.style.transform = 'scale(1) rotate(0deg)';
                        }, 300);
                    }, 200);
                }
                
                // Animate technology tags with stagger
                techTags.forEach((tag, index) => {
                    if (tag.classList.contains('rounded-full')) { // Only animate tech tags, not buttons
                        setTimeout(() => {
                            tag.style.opacity = '1';
                            tag.style.transform = 'translateY(0)';
                        }, 400 + (index * 50));
                    }
                });
                
                // Animate project links with stagger
                projectLinks.forEach((link, index) => {
                    if (link.classList.contains('inline-flex')) { // Only animate button links
                        setTimeout(() => {
                            link.style.opacity = '1';
                            link.style.transform = 'translateX(0)';
                        }, 600 + (index * 100));
                    }
                });
                
                projectsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe project cards and set initial states
    projectCards.forEach(card => {
        projectsObserver.observe(card);
        
        // Set initial states for animated elements
        const techTags = card.querySelectorAll('.px-3.py-1.rounded-full');
        const projectLinks = card.querySelectorAll('a.inline-flex');
        
        techTags.forEach(tag => {
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px)';
            tag.style.transition = 'all 0.3s ease';
        });
        
        projectLinks.forEach(link => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-10px)';
            link.style.transition = 'all 0.4s ease';
        });
    });
}

/**
 * Projects Section Accessibility
 * Enhances keyboard navigation and screen reader support for project cards
 */
function initProjectsAccessibility() {
    const projectCards = document.querySelectorAll('#projects .project-card');
    
    // Enhance project cards for accessibility
    projectCards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        
        const projectTitle = card.querySelector('h3')?.textContent || 'Project';
        const projectType = card.querySelector('.text-xs')?.textContent || 'Project';
        card.setAttribute('aria-label', `${projectTitle} - ${projectType}`);
        
        // Add keyboard navigation between cards
        card.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    const nextCard = projectCards[index + 1];
                    if (nextCard) {
                        nextCard.focus();
                        nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    break;
                    
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevCard = projectCards[index - 1];
                    if (prevCard) {
                        prevCard.focus();
                        prevCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    // Focus on the first link in the card
                    const firstLink = card.querySelector('a');
                    if (firstLink) {
                        firstLink.focus();
                        announceToScreenReader(`Focused on ${firstLink.textContent} link for ${projectTitle}`);
                    }
                    break;
            }
        });
        
        // Add focus effects
        card.addEventListener('focus', () => {
            card.style.outline = '2px solid var(--accent-blue)';
            card.style.outlineOffset = '2px';
        });
        
        card.addEventListener('blur', () => {
            card.style.outline = 'none';
            card.style.outlineOffset = '0';
        });
    });
}

/**
 * Projects Section Mobile Optimizations
 * Handles mobile-specific interactions and layout adjustments
 */
function initProjectsMobileOptimizations() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        const projectCards = document.querySelectorAll('#projects .project-card');
        
        // Optimize touch interactions
        projectCards.forEach(card => {
            // Add touch feedback
            card.addEventListener('touchstart', () => {
                card.style.backgroundColor = 'rgba(96, 165, 250, 0.05)';
            }, { passive: true });
            
            card.addEventListener('touchend', () => {
                setTimeout(() => {
                    card.style.backgroundColor = '';
                }, 150);
            }, { passive: true });
            
            // Optimize technology tags on mobile
            const techTags = card.querySelectorAll('.px-3.py-1.rounded-full');
            techTags.forEach(tag => {
                tag.style.fontSize = '0.75rem';
                tag.style.padding = '0.25rem 0.5rem';
            });
        });
    }
}

// Initialize experience section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure the experience section is rendered
    setTimeout(() => {
        initExperienceAnimations();
        initExperienceAccessibility();
        initExperienceMobileOptimizations();
    }, 100);
});

// Re-initialize on resize for responsive behavior
window.addEventListener('resize', () => {
    clearTimeout(window.experienceResizeTimeout);
    window.experienceResizeTimeout = setTimeout(() => {
        initExperienceMobileOptimizations();
    }, 250);
});

// Export functions for potential external use
window.AnimationUtils = {
    addStaggeredAnimation,
    prefersReducedMotion,
    announceToScreenReader,
    
    // Initialize all animations
    initAllAnimations: function() {
        if (!prefersReducedMotion) {
            initFadeInAnimations();
            initInteractiveSkills();
            initExperienceAnimations();
            initProjectsAnimations();
        }
    },
    
    // Initialize basic animations (for low-end devices)
    initBasicAnimations: function() {
        // Just initialize essential animations with reduced motion
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('animate-fade-in-up');
        });
    },
    
    // Initialize particles (placeholder function)
    initParticles: function() {
        console.log('Particles initialization - placeholder function');
        // This would typically initialize a particle system
        // For now, we'll just add a simple background effect
        const hero = document.getElementById('hero');
        if (hero && !prefersReducedMotion) {
            hero.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)';
        }
    },
    
    // Add hover effects
    addHoverEffects: function() {
        if (prefersReducedMotion) return;
        
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .project-card, .skill-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    },
    
    // Initialize micro-interactions
    initMicroInteractions: function() {
        if (prefersReducedMotion) return;
        
        // Add subtle micro-interactions to buttons and links
        const buttons = document.querySelectorAll('button, a');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
            });
        });
    },
    
    // Typewriter effect
    typewriterEffect: function(element, text, speed = 100) {
        if (!element || prefersReducedMotion) {
            if (element) element.textContent = text;
            return;
        }
        
        element.textContent = '';
        let i = 0;
        
        function typeChar() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            }
        }
        
        typeChar();
    }
};

// Export the interactive skills function for potential external use
window.SkillsUtils = {
    setActiveSkillCategory,
    initInteractiveSkills
};

// Export experience functions for potential external use
window.ExperienceUtils = {
    initExperienceAnimations,
    initExperienceAccessibility,
    initExperienceMobileOptimizations
};
