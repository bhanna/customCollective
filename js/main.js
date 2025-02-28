/**
 * Custom Collective - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initTestimonialSlider();
    initGalleryLightbox();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
    
    // Add scrolled class to header when scrolling
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Active link highlighting based on scroll position
    window.addEventListener('scroll', highlightNavOnScroll);
    highlightNavOnScroll(); // Initial call
}

/**
 * Highlight navigation based on scroll position
 */
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
        
        if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            navLink.classList.add('active');
        }
    });
    
    // If at the top of the page, highlight home
    if (scrollPosition < 100) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.classList.remove('active');
        });
        const homeLink = document.querySelector('.nav-menu a[href="#"]');
        if (homeLink) homeLink.classList.add('active');
    }
}

/**
 * Scroll effects and animations
 */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fade-in elements on scroll
    const fadeElements = document.querySelectorAll('.experience-card, .about-content, .gallery-item, .testimonial');
    
    const fadeInOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, fadeInOptions);
    
    fadeElements.forEach(element => {
        element.classList.add('fade-element');
        fadeInObserver.observe(element);
    });
    
    // Enhanced animations for process steps
    const processSteps = document.querySelectorAll('.process-step');
    const processOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const processObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered animation delay based on step index
                const step = entry.target;
                const index = Array.from(processSteps).indexOf(step);
                step.style.transitionDelay = `${index * 0.15}s`;
                
                // Add animation classes
                step.classList.add('process-animate');
                
                // Animate the SVG icon
                setTimeout(() => {
                    const icon = step.querySelector('.process-icon svg');
                    if (icon) {
                        icon.style.opacity = '1';
                        icon.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    }
                }, 500 + (index * 150));
                
                observer.unobserve(entry.target);
            }
        });
    }, processOptions);
    
    processSteps.forEach(step => {
        step.classList.add('process-step-hidden');
        processObserver.observe(step);
    });
}

/**
 * Testimonial slider functionality
 */
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length <= 1) return;
    
    let currentIndex = 0;
    const totalTestimonials = testimonials.length;
    
    // Hide all testimonials except the first one
    testimonials.forEach((testimonial, index) => {
        if (index !== 0) {
            testimonial.style.display = 'none';
        }
    });
    
    // Create navigation dots
    const sliderContainer = document.querySelector('.testimonial-slider');
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    
    for (let i = 0; i < totalTestimonials; i++) {
        const dot = document.createElement('span');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.addEventListener('click', () => goToTestimonial(i));
        dotsContainer.appendChild(dot);
    }
    
    sliderContainer.appendChild(dotsContainer);
    
    // Auto-rotate testimonials
    setInterval(nextTestimonial, 5000);
    
    function nextTestimonial() {
        goToTestimonial((currentIndex + 1) % totalTestimonials);
    }
    
    function goToTestimonial(index) {
        testimonials[currentIndex].style.display = 'none';
        document.querySelectorAll('.slider-dots .dot')[currentIndex].classList.remove('active');
        
        currentIndex = index;
        
        testimonials[currentIndex].style.display = 'block';
        document.querySelectorAll('.slider-dots .dot')[currentIndex].classList.add('active');
    }
}

/**
 * Gallery lightbox functionality
 */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length === 0) return;
    
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-caption"></div>
            <button class="lightbox-prev">&lsaquo;</button>
            <button class="lightbox-next">&rsaquo;</button>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    
    // Add click event to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            const img = item.querySelector('img');
            lightboxImage.src = img.src;
            lightboxCaption.textContent = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Navigate through images
    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxImage();
    });
    
    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightboxImage();
    });
    
    function updateLightboxImage() {
        const img = galleryItems[currentImageIndex].querySelector('img');
        lightboxImage.src = img.src;
        lightboxCaption.textContent = img.alt;
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            lightboxNext.click();
        }
    });
}

// Add CSS for fade-in animations and lightbox
(function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Fade-in animation */
        .fade-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-element.fade-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Process step animations */
        .process-step-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .process-step-left.process-step-hidden {
            transform: translateX(-50px);
        }
        
        .process-step-right.process-step-hidden {
            transform: translateX(50px);
        }
        
        .process-step.process-animate {
            opacity: 1;
            transform: translateY(0) translateX(0);
        }
        
        .process-card {
            transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        
        .process-icon svg {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        /* Lightbox styles */
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            display: block;
            margin: 0 auto;
        }
        
        .lightbox-caption {
            color: white;
            text-align: center;
            padding: 10px 0;
            font-size: 1rem;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            font-size: 30px;
            color: white;
            cursor: pointer;
        }
        
        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 40px;
            color: white;
            cursor: pointer;
            padding: 0 15px;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .lightbox-prev:hover,
        .lightbox-next:hover {
            opacity: 1;
        }
        
        .lightbox-prev {
            left: -60px;
        }
        
        .lightbox-next {
            right: -60px;
        }
        
        .slider-dots {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        
        .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: var(--medium-gray);
            margin: 0 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .dot.active {
            background-color: var(--accent);
        }
        
        @media (max-width: 768px) {
            .lightbox-prev {
                left: -40px;
            }
            
            .lightbox-next {
                right: -40px;
            }
        }
    `;
    document.head.appendChild(style);
})();
