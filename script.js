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
    document.documentElement.setAttribute('data-theme', theme);
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
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.header = document.querySelector('.header');
    this.init();
  }

  init() {
    this.navToggle?.addEventListener('click', () => this.toggleNav());
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeNav());
    });
    
    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navToggle?.contains(e.target) && !this.navMenu?.contains(e.target)) {
        this.closeNav();
      }
    });

    // Header scroll effect
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Smooth scrolling for navigation links
    this.setupSmoothScrolling();
  }

  toggleNav() {
    this.navMenu?.classList.toggle('active');
    this.navToggle?.classList.toggle('active');
  }

  closeNav() {
    this.navMenu?.classList.remove('active');
    this.navToggle?.classList.remove('active');
  }

  handleScroll() {
    if (window.scrollY > 100) {
      this.header?.classList.add('scrolled');
    } else {
      this.header?.classList.remove('scrolled');
    }
  }

  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const headerHeight = this.header?.offsetHeight || 70;
          const targetPosition = targetSection.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Hero Slider Management
class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.dots = document.querySelectorAll('.dot');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
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
    const heroSection = document.querySelector('.hero');
    heroSection?.addEventListener('mouseenter', () => this.stopAutoSlide());
    heroSection?.addEventListener('mouseleave', () => this.startAutoSlide());
  }

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
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
    this.slideInterval = setInterval(() => this.nextSlide(), 5000);
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
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.galleryTabs = document.querySelectorAll('.gallery-tab');
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
  }

  showTab(tabId) {
    this.galleryTabs.forEach(tab => {
      tab.classList.toggle('active', tab.id === tabId);
    });
  }

  setActiveBtn(activeBtn) {
    this.tabBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
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
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      // Simulate form submission (replace with actual API call)
      await this.simulateFormSubmission(data);
      
      // Show success message
      this.showMessage('Thank you for your inquiry! We will get back to you soon.', 'success');
      this.form.reset();
      
    } catch (error) {
      // Show error message
      this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success (90% of the time)
        if (Math.random() > 0.1) {
          console.log('Form submitted:', data);
          resolve();
        } else {
          reject(new Error('Submission failed'));
        }
      }, 2000);
    });
  }

  showMessage(message, type) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    
    // Style the message
    Object.assign(messageEl.style, {
      padding: '1rem',
      marginTop: '1rem',
      borderRadius: '8px',
      backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
      color: 'white',
      textAlign: 'center',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    });
    
    // Insert message
    this.form.appendChild(messageEl);
    
    // Animate in
    setTimeout(() => {
      messageEl.style.opacity = '1';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
      messageEl.style.opacity = '0';
      setTimeout(() => {
        messageEl.remove();
      }, 300);
    }, 5000);
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
    if (window.scrollY > 300) {
      this.backToTopBtn.classList.add('visible');
    } else {
      this.backToTopBtn.classList.remove('visible');
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
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    this.observeElements();
  }

  observeElements() {
    const elementsToAnimate = document.querySelectorAll(`
      .section-header,
      .about-text,
      .about-image,
      .room-card,
      .amenity-item,
      .gallery-item,
      .contact-item,
      .contact-form
    `);

    elementsToAnimate.forEach(el => {
      this.observer.observe(el);
    });
  }

  animateElement(element) {
    // Add appropriate animation class based on element type or position
    if (element.classList.contains('about-text') || 
        element.classList.contains('contact-item')) {
      element.classList.add('animate-fade-in-left');
    } else if (element.classList.contains('about-image') || 
               element.classList.contains('contact-form')) {
      element.classList.add('animate-fade-in-right');
    } else {
      element.classList.add('animate-fade-in-up');
    }
  }
}

// Performance Optimization
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images
    this.setupLazyLoading();
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize scroll performance
    this.optimizeScrollPerformance();
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
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
    const heroImages = document.querySelectorAll('.slide img');
    heroImages.forEach((img, index) => {
      if (index < 2) { // Preload first 2 images
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.src;
        document.head.appendChild(link);
      }
    });
  }

  optimizeScrollPerformance() {
    let ticking = false;
    
    const optimizedScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll-dependent operations go here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
  }
}

// SEO and Analytics
class SEOManager {
  constructor() {
    this.init();
  }

  init() {
    // Update page title based on current section
    this.setupDynamicTitles();
    
    // Add structured data
    this.addStructuredData();
    
    // Track page interactions
    this.setupAnalytics();
  }

  setupDynamicTitles() {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const sectionId = entry.target.id;
          const titles = {
            'home': 'Premium PG Accommodation | Comfortable Living Spaces',
            'about': 'About Us | Premium PG Accommodation',
            'rooms': 'Room Types | Premium PG Accommodation',
            'amenities': 'Amenities | Premium PG Accommodation',
            'gallery': 'Photo Gallery | Premium PG Accommodation',
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
      "description": "Premium paying guest accommodation with modern amenities for students and professionals",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main Street",
        "addressLocality": "City Center",
        "addressRegion": "State",
        "postalCode": "123456",
        "addressCountry": "IN"
      },
      "telephone": "+91-98765-43210",
      "email": "info@premiumpg.com",
      "amenityFeature": [
        "WiFi",
        "Parking",
        "Laundry",
        "Security",
        "Meals",
        "Housekeeping"
      ],
      "priceRange": "₹6000-₹12000"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  setupAnalytics() {
    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.textContent.trim();
        console.log('Button clicked:', action);
        // Replace with actual analytics tracking
      });
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      console.log('Form submitted:', e.target.id);
      // Replace with actual analytics tracking
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
  
  console.log('🏠 Premium PG website loaded successfully!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations and timers when page is hidden
    console.log('Page hidden - pausing animations');
  } else {
    // Resume animations when page is visible
    console.log('Page visible - resuming animations');
  }
});

// Error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
  // You can add error reporting here
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment when you have a service worker file
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(error => console.log('SW registration failed'));
  });
}