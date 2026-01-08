/**
 * Suhas Kale Portfolio Website
 * Interactive functionality for portfolio site with Formspree integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = this.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        });
    });
    
    // Scroll reveal animation
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // Add reveal class to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal');
    });
    
    // Initial check for elements in viewport
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Don't prevent default for links with target="_blank" or external links
            if (this.getAttribute('target') === '_blank' || 
                this.href.startsWith('http') && !this.href.includes(window.location.hostname)) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form submission with Formspree
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Create message container if it doesn't exist
        let messageContainer = document.getElementById('formMessage');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'formMessage';
            messageContainer.style.cssText = 'display: none; margin-top: 1rem; padding: 0.75rem; border-radius: 4px;';
            contactForm.appendChild(messageContainer);
        }
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Clear previous messages
            messageContainer.innerHTML = '';
            messageContainer.style.display = 'none';
            messageContainer.className = '';
            
            try {
                // Submit to Formspree
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                // Parse response
                const result = await response.json();
                
                if (response.ok && result.ok) {
                    // Success - show success message
                    messageContainer.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
                            <div>
                                <strong>Message Sent Successfully!</strong><br>
                                <small>Thank you, I'll get back to you within 24 hours.</small>
                            </div>
                        </div>
                    `;
                    messageContainer.className = 'form-message success';
                    messageContainer.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Scroll to message smoothly
                    setTimeout(() => {
                        messageContainer.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 300);
                    
                    // Hide success message after 10 seconds
                    setTimeout(() => {
                        if (messageContainer.classList.contains('success')) {
                            messageContainer.style.display = 'none';
                        }
                    }, 10000);
                    
                } else {
                    // Formspree returned an error
                    throw new Error(result.error || 'Form submission failed');
                }
                
            } catch (error) {
                // Network error or Formspree error
                console.error('Form submission error:', error);
                
                // Show error message
                messageContainer.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 1.2rem;"></i>
                        <div>
                            <strong>Something went wrong!</strong><br>
                            <small>Please try again or email me directly at suhaskale@outlook.in</small>
                        </div>
                    </div>
                `;
                messageContainer.className = 'form-message error';
                messageContainer.style.display = 'block';
                
                // Scroll to error message
                setTimeout(() => {
                    messageContainer.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 300);
                
            } finally {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
        
        // Add CSS classes for message containers
        const style = document.createElement('style');
        style.textContent = `
            .form-message {
                margin-top: 1rem;
                padding: 0.75rem;
                border-radius: 8px;
                display: none;
                animation: fadeIn 0.3s ease;
            }
            
            .form-message.success {
                background-color: rgba(16, 185, 129, 0.1);
                border: 1px solid rgba(16, 185, 129, 0.3);
                color: #10b981;
            }
            
            .form-message.error {
                background-color: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: #ef4444;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .fa-spinner {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Animate skill bars on scroll into view
    const skillBars = document.querySelectorAll('.skill-level-bar');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (barPosition < screenPosition) {
                const width = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s ease-in-out';
                    bar.style.width = width;
                }, 200);
            }
        });
    }
    
    // Initial check
    animateSkillBars();
    
    // Check on scroll
    window.addEventListener('scroll', animateSkillBars);
    
    // Chart animation in hero section
    const chartBars = document.querySelectorAll('.chart-bar');
    
    function animateChartBars() {
        chartBars.forEach(bar => {
            const height = bar.style.height;
            bar.style.height = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'height 1s ease-in-out';
                bar.style.height = height;
            }, 300);
        });
    }
    
    // Animate chart bars when hero section is in view
    const heroSection = document.querySelector('.hero');
    
    function checkHeroInView() {
        const heroPosition = heroSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.5;
        
        if (heroPosition < screenPosition) {
            animateChartBars();
            // Remove event listener after animation
            window.removeEventListener('scroll', checkHeroInView);
        }
    }
    
    // Check on scroll
    window.addEventListener('scroll', checkHeroInView);
    
    // Also check on load
    checkHeroInView();
    
    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add typing effect to hero title (optional)
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) {
        const originalText = heroTagline.textContent;
        
        // Simple typing animation
        function typeWriter(element, text, speed = 100) {
            let i = 0;
            element.textContent = '';
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            type();
        }
        
        // Only run typing animation if page hasn't been scrolled
        let hasScrolled = false;
        
        window.addEventListener('scroll', () => {
            hasScrolled = true;
        });
        
        // Start typing animation after a short delay
        setTimeout(() => {
            if (!hasScrolled && window.innerWidth > 768) {
                typeWriter(heroTagline, originalText, 50);
            }
        }, 1000);
    }
    
    // Add click tracking for analytics (optional)
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            console.log(`External link clicked: ${this.href}`);
            // You can add Google Analytics or other tracking here
        });
    });
    
    // Add download tracking for resume
    const resumeLink = document.querySelector('a[href*="resume.pdf"]');
    if (resumeLink) {
        resumeLink.addEventListener('click', function() {
            console.log('Resume downloaded');
            // You can add tracking for resume downloads
        });
    }
    
    // Handle form validation with better UX
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    formInputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            // Validate on blur
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.style.borderColor = 'var(--accent-danger)';
            } else {
                this.style.borderColor = '';
            }
        });
        
        // Clear error state on input
        input.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    });
    
    // Add scroll progress indicator (optional)
    function addScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--gradient-primary);
            width: 0%;
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }
    
    // Uncomment to enable scroll progress bar
    // addScrollProgress();
    
    // Handle page load animations
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Add loading animation removal
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }, 500);
        }
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        }
        
        // Tab key navigation focus styling
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
});

// Add polyfill for older browsers (optional)
if (!window.fetch) {
    // Load fetch polyfill if needed
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.min.js';
    document.head.appendChild(script);
}

// Add CSS for focus states
const keyboardNavStyles = document.createElement('style');
keyboardNavStyles.textContent = `
    .keyboard-nav a:focus,
    .keyboard-nav button:focus,
    .keyboard-nav input:focus,
    .keyboard-nav textarea:focus {
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
    }
    
    .form-group.focused label {
        color: var(--accent-primary);
    }
`;
document.head.appendChild(keyboardNavStyles);