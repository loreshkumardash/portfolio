// ===== PORTFOLIO WEBSITE JAVASCRIPT =====
// Modern, performant, and accessible JavaScript for portfolio functionality

(function() {
    'use strict';

    // ===== CONSTANTS & VARIABLES =====
    const ANIMATION_DURATION = 300;
    const SCROLL_THRESHOLD = 100;
    const TYPING_SPEED = 150;
    const ERASE_SPEED = 100;
    
    let isScrolling = false;
    let scrollTimeout;
    let progressBarsAnimated = false;
    let typingTimeout;

    // ===== DOM ELEMENTS =====
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const progressBars = document.querySelectorAll('.progress-bar');
    const skillsSection = document.getElementById('skills');

    // ===== UTILITY FUNCTIONS =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // ===== SMOOTH SCROLLING =====
    function initSmoothScrolling() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"], .smooth-scroll').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== NAVBAR FUNCTIONALITY =====
    function handleNavbarScroll() {
        const scrolled = window.pageYOffset > 50;
        
        if (scrolled) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link
        updateActiveNavLink();
    }

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===== BACK TO TOP BUTTON =====
    function handleBackToTop() {
        const scrolled = window.pageYOffset > SCROLL_THRESHOLD;
        
        if (scrolled) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ===== SKILLS PROGRESS BARS =====
    function animateProgressBars() {
        if (progressBarsAnimated) return;

        const skillsRect = skillsSection.getBoundingClientRect();
        const isVisible = skillsRect.top < window.innerHeight && skillsRect.bottom > 0;

        if (isVisible) {
            progressBars.forEach((bar, index) => {
                const targetWidth = bar.getAttribute('data-skill') + '%';
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, index * 200);
            });
            progressBarsAnimated = true;
        }
    }

    // ===== TYPING ANIMATION =====
    function initTypingAnimation() {
        const typingElement = document.querySelector('.typing-animation');
        if (!typingElement) return;

        const originalText = typingElement.textContent;
        const phrases = [originalText, 'Developer', 'Designer', 'Problem Solver'];
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;

        function type() {
            const currentPhrase = phrases[currentPhraseIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                typingElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }

            let typeSpeed = isDeleting ? ERASE_SPEED : TYPING_SPEED;

            if (!isDeleting && currentCharIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typeSpeed = 500; // Pause before next phrase
            }

            typingTimeout = setTimeout(type, typeSpeed);
        }

        // Start typing animation after a short delay
        setTimeout(type, 1000);
    }

    // ===== CONTACT FORM HANDLING =====
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Validate form
            if (validateForm(formObject)) {
                // Simulate form submission (replace with actual submission logic)
                simulateFormSubmission();
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }

    function validateForm(data) {
        let isValid = true;
        const errors = {};

        // Name validation
        if (!data.name || data.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters long';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Message validation
        if (!data.message || data.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters long';
            isValid = false;
        }

        // Display errors
        Object.keys(errors).forEach(field => {
            displayFieldError(field, errors[field]);
        });

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.name) {
            case 'name':
                if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                    isValid = false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters long';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            displayFieldError(field.name, errorMessage);
        } else {
            clearFieldError(field);
        }

        return isValid;
    }

    function displayFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (!field) return;

        // Remove existing error
        clearFieldError(field);

        // Add error class
        field.classList.add('is-invalid');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'invalid-feedback';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    function clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function simulateFormSubmission() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';

        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        }, 2000);
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} me-2"></i>
                ${message}
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add notification styles if not present
        if (!document.querySelector('.notification-styles')) {
            const style = document.createElement('style');
            style.className = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 9999;
                    max-width: 400px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    animation: slideInRight 0.3s ease;
                }
                .notification-success {
                    background: linear-gradient(135deg, #51cf66, #40c057);
                    color: white;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0 0 0 10px;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // ===== ACCESSIBILITY FEATURES =====
    function initAccessibility() {
        // Keyboard navigation for custom elements
        document.querySelectorAll('.project-card, .skill-item').forEach(element => {
            element.setAttribute('tabindex', '0');
            
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-gradient);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            border-radius: 4px;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main landmark
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.setAttribute('role', 'main');
            heroSection.setAttribute('id', 'main');
        }
    }

    // ===== EVENT LISTENERS =====
    function attachEventListeners() {
        // Scroll events (throttled for performance)
        window.addEventListener('scroll', throttle(() => {
            handleNavbarScroll();
            handleBackToTop();
            animateProgressBars();
        }, 16)); // ~60fps

        // Back to top button click
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }

        // Mobile menu close on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (window.bootstrap && window.bootstrap.Collapse) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            });
        });

        // Window resize event (debounced)
        window.addEventListener('resize', debounce(() => {
            // Reset progress bars animation on resize
            progressBarsAnimated = false;
        }, 250));

        // Handle reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition', 'none');
        }
    }

    // ===== INITIALIZATION =====
    function init() {
        // Initialize all modules
        initSmoothScrolling();
        initContactForm();
        initTypingAnimation();
        initAccessibility();
        attachEventListeners();

        // Initialize AOS (Animate On Scroll) if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                mirror: false,
                offset: 120,
                disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
        }

        console.log('Portfolio website initialized successfully! 🚀');
    }

    // ===== ERROR HANDLING =====
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });

    // ===== START APPLICATION =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===== EXPOSE PUBLIC API =====
    window.Portfolio = {
        showNotification,
        scrollToTop,
        updateActiveNavLink
    };

})();
