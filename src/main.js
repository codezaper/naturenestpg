// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.themeToggle = document.getElementById('theme-toggle');
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.themeToggle?.addEventListener('click', () => this.toggleTheme());
  }

  setTheme(theme) {
    this.theme = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    
    if (this.themeToggle) {
      const icon = this.themeToggle.querySelector('.theme-icon');
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.navLinks = document.querySelectorAll('a[href^="#"]');
    this.header = document.querySelector('header');
    this.init();
  }

  init() {
    this.mobileMenuToggle?.addEventListener('click', () => this.toggleMobileMenu());
    
    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.closeMobileMenu();
        this.handleSmoothScroll(e, link);
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.mobileMenuToggle?.contains(e.target) && !this.mobileMenu?.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Header scroll effect
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Active section highlighting
    this.setupActiveSection();
  }

  toggleMobileMenu() {
    this.mobileMenu?.classList.toggle('hidden');
    this.mobileMenuToggle?.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = this.mobileMenuToggle?.querySelectorAll('span');
    if (spans) {
      if (this.mobileMenu?.classList.contains('hidden')) {
        spans[0].style.transform = 'rotate(0deg) translate(0, 0)';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'rotate(0deg) translate(0, 0)';
      } else {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      }
    }
  }

  closeMobileMenu() {
    this.mobileMenu?.classList.add('hidden');
    this.mobileMenuToggle?.classList.remove('active');
    
    // Reset hamburger menu
    const spans = this.mobileMenuToggle?.querySelectorAll('span');
    if (spans) {
      spans[0].style.transform = 'rotate(0deg) translate(0, 0)';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'rotate(0deg) translate(0, 0)';
    }
  }

  handleScroll() {
    if (window.scrollY > 100) {
      this.header?.classList.add('bg-white/95', 'dark:bg-gray-900/95', 'shadow-lg');
    } else {
      this.header?.classList.remove('bg-white/95', 'dark:bg-gray-900/95', 'shadow-lg');
    }
  }

  handleSmoothScroll(e, link) {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const headerHeight = this.header?.offsetHeight || 80;
      const targetPosition = targetSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  setupActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('text-amber-600', 'dark:text-amber-400');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('text-amber-600', 'dark:text-amber-400');
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  }
}

// Hero Slider Management
class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.dots = document.querySelectorAll('.slider-dot');
    this.prevBtn = document.getElementById('prev-slide');
    this.nextBtn = document.getElementById('next-slide');
    this.currentSlide = 0;
    this.slideInterval = null;
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;

    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    this.startAutoSlide();
    
    // Pause auto-slide on hover
    const heroSection = document.querySelector('#home');
    heroSection?.addEventListener('mouseenter', () => this.stopAutoSlide());
    heroSection?.addEventListener('mouseleave', () => this.startAutoSlide());
    
    // Pause on focus for accessibility
    this.slides.forEach(slide => {
      slide.addEventListener('focusin', () => this.stopAutoSlide());
      slide.addEventListener('focusout', () => this.startAutoSlide());
    });
  }

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      slide.classList.toggle('opacity-100', i === index);
      slide.classList.toggle('opacity-0', i !== index);
    });
    
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    
    this.currentSlide = index;
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prevIndex);
  }

  goToSlide(index) {
    this.showSlide(index);
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => this.nextSlide(), 6000);
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }
}

// Gallery Management
class GalleryManager {
  constructor() {
    this.tabBtns = document.querySelectorAll('.gallery-tab-btn');
    this.tabContents = document.querySelectorAll('.gallery-tab-content');
    this.init();
  }

  init() {
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        this.showTab(tabId);
        this.setActiveBtn(btn);
      });
    });
    
    // Add keyboard navigation
    this.tabBtns.forEach((btn, index) => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = e.key === 'ArrowLeft' 
            ? (index - 1 + this.tabBtns.length) % this.tabBtns.length
            : (index + 1) % this.tabBtns.length;
          this.tabBtns[nextIndex].focus();
          this.tabBtns[nextIndex].click();
        }
      });
    });
  }

  showTab(tabId) {
    this.tabContents.forEach(content => {
      const isActive = content.id === `${tabId}-gallery`;
      content.classList.toggle('hidden', !isActive);
      content.classList.toggle('active', isActive);
    });
  }

  setActiveBtn(activeBtn) {
    this.tabBtns.forEach(btn => {
      btn.classList.remove('active', 'bg-gradient-to-r', 'from-amber-500', 'to-orange-500', 'text-white', 'shadow-lg');
      btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
    });
    activeBtn.classList.add('active', 'bg-gradient-to-r', 'from-amber-500', 'to-orange-500', 'text-white', 'shadow-lg');
    activeBtn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-600', 'dark:text-gray-300');
  }
}

// Contact Form Management
class ContactFormManager {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.init();
  }

  init() {
    this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Add real-time validation
    const inputs = this.form?.querySelectorAll('input, select, textarea');
    inputs?.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    field.classList.remove('border-red-500', 'ring-red-500');
    
    // Validation rules
    switch (field.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'tel':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
        break;
      default:
        if (field.required && !value) {
          isValid = false;
          errorMessage = 'This field is required';
        }
    }

    if (!isValid) {
      field.classList.add('border-red-500', 'ring-red-500');
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  clearFieldError(field) {
    field.classList.remove('border-red-500', 'ring-red-500');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    const errorElement = document.createElement('p');
    errorElement.className = 'field-error text-red-500 text-sm mt-1';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const inputs = this.form.querySelectorAll('input, select, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showMessage('Please correct the errors above', 'error');
      return;
    }
    
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    
    try {
      // Simulate form submission (replace with actual API call)
      await this.simulateFormSubmission(data);
      
      // Show success message
      this.showMessage('Thank you for your inquiry! We will get back to you within 24 hours.', 'success');
      this.form.reset();
      
      // Clear any field errors
      inputs.forEach(input => this.clearFieldError(input));
      
    } catch (error) {
      // Show error message
      this.showMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }

  simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success (95% of the time)
        if (Math.random() > 0.05) {
          console.log('Form submitted:', data);
          resolve();
        } else {
          reject(new Error('Submission failed'));
        }
      }, 2000);
    });
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessage = this.form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message p-4 rounded-2xl text-center transition-all duration-300 ${
      type === 'success' 
        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700' 
        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700'
    }`;
    messageEl.textContent = message;
    
    // Insert message at the top of the form
    this.form.insertBefore(messageEl, this.form.firstChild);
    
    // Scroll to message
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove after 8 seconds
    setTimeout(() => {
      messageEl.classList.add('opacity-0');
      setTimeout(() => {
        messageEl.remove();
      }, 300);
    }, 8000);
  }
}

// Back to Top Button
class BackToTopManager {
  constructor() {
    this.backToTopBtn = document.getElementById('back-to-top');
    this.init();
  }

  init() {
    if (!this.backToTopBtn) return;

    window.addEventListener('scroll', () => this.handleScroll());
    this.backToTopBtn.addEventListener('click', () => this.scrollToTop());
  }

  handleScroll() {
    if (window.scrollY > 500) {
      this.backToTopBtn.classList.remove('opacity-0', 'invisible');
      this.backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
      this.backToTopBtn.classList.add('opacity-0', 'invisible');
      this.backToTopBtn.classList.remove('opacity-100', 'visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Intersection Observer for Animations
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          // Add staggered animation for child elements
          const children = entry.target.querySelectorAll('.animate-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate');
            }, index * 100);
          });
          this.observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    this.observeElements();
  }

  observeElements() {
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
      this.observer.observe(el);
    });
  }
}

// Performance Manager
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images
    this.setupLazyLoading();
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  preloadCriticalResources() {
    // Preload hero images
    const heroImages = [
      'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
    ];

    heroImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with actual web vitals library
      console.log('Performance monitoring initialized');
    }
  }
}

// SEO and Analytics Manager
class SEOManager {
  constructor() {
    this.init();
  }

  init() {
    // Update page title based on current section
    this.setupDynamicTitles();
    
    // Add structured data
    this.addStructuredData();
    
    // Setup analytics tracking
    this.setupAnalytics();
  }

  setupDynamicTitles() {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const sectionId = entry.target.id;
          const titles = {
            'home': 'Premium PG Accommodation | Modern Living Spaces',
            'about': 'About Us | Premium PG Accommodation',
            'rooms': 'Luxury Room Types | Premium PG Accommodation',
            'amenities': 'World-Class Amenities | Premium PG Accommodation',
            'gallery': 'Photo Gallery | Premium PG Accommodation',
            'testimonials': 'Customer Reviews | Premium PG Accommodation',
            'location': 'Prime Location | Premium PG Accommodation',
            'contact': 'Contact Us | Premium PG Accommodation'
          };
          
          if (titles[sectionId]) {
            document.title = titles[sectionId];
          }
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
  }

  addStructuredData() {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Premium PG Accommodation",
      "description": "Luxury paying guest accommodation with modern amenities and exceptional service",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Premium Street, Business District",
        "addressLocality": "Metropolitan City",
        "addressRegion": "State",
        "postalCode": "123456",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "28.6139",
        "longitude": "77.2090"
      },
      "telephone": "+91-98765-43210",
      "email": "info@premiumpg.com",
      "url": "https://premiumpg.com",
      "priceRange": "₹7500-₹15000",
      "amenityFeature": ["WiFi", "Parking", "Laundry", "Security", "Meals", "Fitness Center"],
      "starRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  setupAnalytics() {
    // Track user interactions
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn, .gallery-tab-btn, .nav-link')) {
        const action = e.target.textContent.trim();
        console.log('User interaction:', action);
        // Replace with actual analytics tracking
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      console.log('Form submitted:', e.target.id);
      // Replace with actual analytics tracking
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll % 25 === 0) {
          console.log('Scroll depth:', maxScroll + '%');
          // Replace with actual analytics tracking
        }
      }
    });
  }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new ThemeManager();
  new NavigationManager();
  new HeroSlider();
  new GalleryManager();
  new ContactFormManager();
  new BackToTopManager();
  new AnimationManager();
  new PerformanceManager();
  new SEOManager();

  // Add loading complete class
  document.body.classList.add('loaded');
  
  console.log('🏨 Premium PG website with testimonials and location loaded successfully!');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page hidden - pausing non-essential operations');
  } else {
    console.log('Page visible - resuming operations');
  }
});

// Global error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  // You can add error reporting here
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment when you have a service worker file
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(error => console.log('SW registration failed'));
  });
}