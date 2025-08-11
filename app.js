// CA Copilot Presentation App
class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 15;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.progressFill = document.getElementById('progressFill');
        this.isTransitioning = false;

        this.init();
    }

    init() {
        // Set initial state
        this.updateSlideDisplay();
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Add event listeners
        this.addEventListeners();
        
        // Add entrance animation to first slide
        setTimeout(() => {
            this.animateSlideContent();
        }, 100);
        
        console.log('CA Copilot Presentation initialized with', this.totalSlides, 'slides');
    }

    addEventListeners() {
        // Button navigation - Fixed event handling
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked');
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked');
                if (this.currentSlide === this.totalSlides) {
                    this.goToSlide(1); // Restart functionality
                } else {
                    this.nextSlide();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        // Touch/swipe support for mobile
        this.addTouchSupport();
        
        console.log('Event listeners added successfully');
    }

    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });
    }

    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Only handle horizontal swipes that are longer than vertical swipes
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - go to previous slide
                this.previousSlide();
            } else {
                // Swipe left - go to next slide
                this.nextSlide();
            }
        }
    }

    handleKeyPress(e) {
        // Prevent navigation during transitions
        if (this.isTransitioning) return;

        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // Spacebar
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }

    previousSlide() {
        if (this.isTransitioning) return;
        
        if (this.currentSlide > 1) {
            console.log(`Going to previous slide: ${this.currentSlide - 1}`);
            this.goToSlide(this.currentSlide - 1);
        }
    }

    nextSlide() {
        if (this.isTransitioning) return;
        
        if (this.currentSlide < this.totalSlides) {
            console.log(`Going to next slide: ${this.currentSlide + 1}`);
            this.goToSlide(this.currentSlide + 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides || slideNumber === this.currentSlide || this.isTransitioning) {
            return;
        }

        this.isTransitioning = true;
        console.log(`Transitioning from slide ${this.currentSlide} to slide ${slideNumber}`);

        // Get current and target slide elements using data attributes
        const currentSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        const targetSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);

        // Remove active class from current slide
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
            console.log(`Removed active from slide ${this.currentSlide}`);
        }

        // Update current slide number
        this.currentSlide = slideNumber;

        // Add active class to new slide
        if (targetSlideElement) {
            targetSlideElement.classList.add('active');
            console.log(`Added active to slide ${this.currentSlide}`);
        }

        // Update UI immediately for better responsiveness
        this.updateSlideDisplay();
        this.updateProgressBar();
        this.updateNavigationButtons();

        // Animate slide content after a brief delay
        setTimeout(() => {
            this.animateSlideContent();
            this.isTransitioning = false;
            console.log(`Transition to slide ${this.currentSlide} complete`);
        }, 150);
        
        // Announce slide change for accessibility
        this.announceSlideChange();
    }

    updateSlideDisplay() {
        if (this.currentSlideSpan && this.totalSlidesSpan) {
            this.currentSlideSpan.textContent = this.currentSlide;
            this.totalSlidesSpan.textContent = this.totalSlides;
            console.log(`Updated slide display: ${this.currentSlide}/${this.totalSlides}`);
        }
    }

    updateProgressBar() {
        if (this.progressFill) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            this.progressFill.style.width = `${progress}%`;
            console.log(`Updated progress bar: ${progress}%`);
        } else {
            console.warn('Progress bar element not found');
        }
    }

    updateNavigationButtons() {
        if (!this.prevBtn || !this.nextBtn) {
            console.warn('Navigation buttons not found');
            return;
        }

        // Update previous button
        this.prevBtn.disabled = this.currentSlide === 1;
        
        // Update next button text and functionality
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.innerHTML = `
                Restart
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1,4 1,10 7,10"></polyline>
                    <path d="M3.51,15a9,9,0,0,0,2.13,3.09,8.5,8.5,0,0,0,12.34,0A9,9,0,0,0,20.49,9"></path>
                </svg>
            `;
            this.nextBtn.disabled = false;
            console.log('Next button updated to Restart');
        } else {
            this.nextBtn.innerHTML = `
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
            `;
            this.nextBtn.disabled = false;
        }
        
        console.log(`Navigation buttons updated - Prev: ${this.prevBtn.disabled ? 'disabled' : 'enabled'}, Next: enabled`);
    }

    animateSlideContent() {
        const activeSlide = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (!activeSlide) {
            console.warn(`Active slide ${this.currentSlide} not found`);
            return;
        }

        const slideContent = activeSlide.querySelector('.slide-content');
        if (slideContent) {
            // Reset animation
            slideContent.style.animation = 'none';
            slideContent.offsetHeight; // Trigger reflow
            
            // Apply entrance animation
            slideContent.style.animation = 'slideContentEnter 0.6s ease-out forwards';
        }

        // Animate individual elements with stagger effect
        this.animateSlideElements();
    }

    animateSlideElements() {
        const activeSlide = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (!activeSlide) return;

        // Animate cards, items, and other elements with stagger
        const animatableElements = activeSlide.querySelectorAll(`
            .problem-item, .feature-card, .stat-card, .target-segment, 
            .value-card, .tech-item, .timeline-item, .benefit-card,
            .advantage-card, .roi-card, .phase-card, .allocation-item,
            .step-item, .workflow-step
        `);

        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.4s ease-out';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 200 + (index * 80)); // Stagger animation
        });
    }

    announceSlideChange() {
        const activeSlide = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (!activeSlide) return;

        const slideTitle = activeSlide.querySelector('.slide-title')?.textContent ||
                          activeSlide.querySelector('.main-title')?.textContent ||
                          `Slide ${this.currentSlide}`;
        
        // Create or update announcement for screen readers
        let announcement = document.getElementById('slide-announcement');
        if (!announcement) {
            announcement = document.createElement('div');
            announcement.id = 'slide-announcement';
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            document.body.appendChild(announcement);
        }
        
        announcement.textContent = `${slideTitle}, slide ${this.currentSlide} of ${this.totalSlides}`;
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.log(`Error attempting to exit fullscreen: ${err.message}`);
            });
        }
    }

    // Additional utility methods
    getCurrentSlideData() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            progress: Math.round((this.currentSlide / this.totalSlides) * 100)
        };
    }

    // Method to programmatically navigate (useful for external integrations)
    navigateTo(slideNumber) {
        this.goToSlide(slideNumber);
    }

    // Add custom slide transition effects
    addCustomTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideContentEnter {
                0% {
                    opacity: 0;
                    transform: translateY(30px) scale(0.95);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes fadeInUp {
                0% {
                    opacity: 0;
                    transform: translateY(30px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .slide-content {
                animation-fill-mode: both;
            }
            
            /* Enhanced hover effects */
            .nav-btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            /* Loading animation for slide transitions */
            .slide.transitioning {
                pointer-events: none;
            }
            
            /* Focus indicators for better accessibility */
            .nav-btn:focus-visible {
                outline: 2px solid var(--color-primary);
                outline-offset: 2px;
            }

            /* Ensure progress bar is visible */
            .progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: rgba(0, 0, 0, 0.1);
                z-index: 99;
            }
            
            .progress-fill {
                height: 100%;
                background: var(--color-primary);
                transition: width 0.3s ease-out;
                width: 0%;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing presentation...');
    
    // Small delay to ensure all elements are properly loaded
    setTimeout(() => {
        try {
            // Initialize the main presentation app
            const presentationApp = new PresentationApp();
            
            // Add custom transitions
            presentationApp.addCustomTransitions();
            
            // Expose app instance for debugging/external access
            window.presentationApp = presentationApp;
            
            console.log('CA Copilot Presentation fully loaded and ready!');
            
            // Debug: Check if elements exist
            console.log('Navigation elements check:', {
                prevBtn: !!document.getElementById('prevBtn'),
                nextBtn: !!document.getElementById('nextBtn'),
                currentSlide: !!document.getElementById('currentSlide'),
                totalSlides: !!document.getElementById('totalSlides'),
                progressFill: !!document.getElementById('progressFill'),
                totalSlideElements: document.querySelectorAll('.slide').length
            });
            
        } catch (error) {
            console.error('Error initializing presentation app:', error);
        }
    }, 100);
    
    // Add global error handling
    window.addEventListener('error', (e) => {
        console.error('Presentation App Error:', e.error);
    });
    
    // Add window resize handler for responsive adjustments
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-animate current slide content on resize if app exists
            if (window.presentationApp) {
                window.presentationApp.animateSlideContent();
            }
        }, 250);
    });
});

// Additional utility functions
const utils = {
    // Smooth scroll to element
    scrollToElement(element, offset = 0) {
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },
    
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Format numbers for display
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
};

// Export utilities for potential external use
window.presentationUtils = utils;