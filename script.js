/**
 * Thrillanza Travel - Main JavaScript
 * Complete fixed version with proper mobile menu and animation handling
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log("Script initialized");
  
  // ---------- DOM Elements ----------
  const navbar = document.getElementById('navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section');
  const heroSlider = document.getElementById('heroSlider');
  
  // ---------- Mobile Menu Toggle - FIXED ----------
  if (mobileMenuButton && mobileMenu) {
    console.log("Mobile menu elements found");
    
    mobileMenuButton.addEventListener('click', function(e) {
      console.log("Mobile menu button clicked");
      
      // Toggle active class for button animation
      this.classList.toggle('active');
      
      // Toggle menu visibility with smooth transition
      if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        mobileMenu.style.maxHeight = '0';
        mobileMenu.style.opacity = '0';
      } else {
        mobileMenu.classList.add('open');
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
        mobileMenu.style.opacity = '1';
      }
      
      // Prevent event propagation
      e.stopPropagation();
    });
    
    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenuButton.classList.remove('active');
        mobileMenu.classList.remove('open');
        mobileMenu.style.maxHeight = '0';
        mobileMenu.style.opacity = '0';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (mobileMenu.classList.contains('open') && 
          !mobileMenu.contains(e.target) && 
          e.target !== mobileMenuButton && 
          !mobileMenuButton.contains(e.target)) {
        mobileMenuButton.classList.remove('active');
        mobileMenu.classList.remove('open');
        mobileMenu.style.maxHeight = '0';
        mobileMenu.style.opacity = '0';
      }
    });
  } else {
    console.warn("Mobile menu elements not found");
  }
  
  // ---------- Bootstrap Carousel Initialization ----------
  if (heroSlider && typeof bootstrap !== 'undefined') {
    console.log("Initializing Bootstrap carousel");
    try {
      // Initialize the carousel
      const carousel = new bootstrap.Carousel(heroSlider, {
        interval: 5000,
        pause: 'hover',
        ride: 'carousel'
      });
      
      // Fix slide title animations
      const slideTitles = heroSlider.querySelectorAll('.slide-title');
      slideTitles.forEach(function(title) {
        title.classList.add('animate-fadeIn');
      });
      
      // Ensure text animations trigger on slide change
      heroSlider.addEventListener('slid.bs.carousel', function() {
        const activeSlide = heroSlider.querySelector('.carousel-item.active');
        if (activeSlide) {
          const title = activeSlide.querySelector('.slide-title');
          if (title) {
            title.classList.remove('animate-fadeIn');
            setTimeout(function() {
              title.classList.add('animate-fadeIn');
            }, 50);
          }
        }
      });
      
      console.log("Carousel initialized successfully");
    } catch (error) {
      console.error("Error initializing carousel:", error);
    }
  }
  
  // ---------- Navbar Scroll Effect ----------
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      // Update active section on scroll
      highlightCurrentSection();
    });
  }
  
  // ---------- Smooth Scroll for Navigation Links ----------
  function setupSmoothScroll(links) {
    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          const targetSection = document.querySelector(targetId);
          
          if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
            
            // Highlight section briefly
            targetSection.classList.add('section-highlight');
            setTimeout(function() {
              targetSection.classList.remove('section-highlight');
            }, 1000);
          }
        }
      });
    });
  }
  
  setupSmoothScroll(navLinks);
  setupSmoothScroll(mobileNavLinks);
  
  // ---------- Highlight Active Section in Navbar ----------
  function highlightCurrentSection() {
    let current = '';
    const scrollY = window.scrollY;
    
    sections.forEach(function(section) {
      if (!section.id) return;
      
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    // Update active state on desktop nav
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    // Update active state on mobile nav
    mobileNavLinks.forEach(function(link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  // ---------- Section Animation on Scroll ----------
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          // Unobserve after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(function(section) {
      section.classList.add('section-hidden');
      observer.observe(section);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    sections.forEach(function(section) {
      section.classList.add('section-visible');
    });
  }
  
  // ---------- Newsletter Form Handling ----------
  const newsletterForm = document.querySelector('#newsletter form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = this.querySelector('input[type="email"]');
      const submitBtn = this.querySelector('button[type="submit"]');
      
      if (emailInput && emailInput.value) {
        // Save original button content
        const originalHtml = submitBtn.innerHTML;
        
        // Disable form elements
        emailInput.disabled = true;
        submitBtn.disabled = true;
        
        // Show success state
        submitBtn.innerHTML = `
          <span class="newsletter-btn-text">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Subscribed!
          </span>
        `;
        
        // Reset after 3 seconds
        setTimeout(function() {
          emailInput.value = '';
          emailInput.disabled = false;
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;
        }, 3000);
      }
    });
  }
  
  // Initialize active section on page load
  setTimeout(function() {
    highlightCurrentSection();
  }, 200);
});


// ---------- VanillaTilt for Cards ----------


(function() {
  // Custom namespaced version of VanillaTilt for these specific cards
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize VanillaTilt with custom attribute names
    const tiltCards = document.querySelectorAll('[data-tilt-card]');
    
    if (tiltCards.length > 0 && typeof VanillaTilt !== 'undefined') {
      // Create custom config object from data attributes
      tiltCards.forEach(card => {
        const config = {
          max: parseFloat(card.getAttribute('data-tilt-card-max')) || 10,
          speed: parseFloat(card.getAttribute('data-tilt-card-speed')) || 500,
          perspective: parseFloat(card.getAttribute('data-tilt-card-perspective')) || 1800,
          scale: parseFloat(card.getAttribute('data-tilt-card-scale')) || 1.03,
          glare: card.hasAttribute('data-tilt-card-glare'),
          maxGlare: parseFloat(card.getAttribute('data-tilt-card-max-glare')) || 0.1,
          reset: card.getAttribute('data-tilt-card-reset') !== 'false',
          easing: "cubic-bezier(.03,.98,.52,.99)"
        };
        
        // Initialize VanillaTilt with our custom config
        VanillaTilt.init(card, config);
        
        // Add hover effect for background zoom
        card.addEventListener('mouseenter', () => {
          card.style.backgroundSize = '105%';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.backgroundSize = '100%';
        });
        
        // Add parallax depth effect to inner elements
        const elements = card.querySelectorAll('[data-tilt-card-element]');
        const depths = [30, 60, 70, 25, 40]; // Different z-transform values
        
        elements.forEach((el, index) => {
          el.style.transform = `translateZ(${depths[index % depths.length]}px)`;
        });
      });
    }
  });
})();

