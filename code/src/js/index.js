// Navbar loading and functionality
fetch('../component/navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar-placeholder').innerHTML = data;

    // Initialize navbar specific elements and event listeners after HTML is loaded
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeMenuBtn = document.getElementById("closeMenu");
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

    function toggleMenu() {
      if (mobileMenu && mobileMenuOverlay && hamburger) { // Ensure elements exist
        const isOpen = mobileMenu.classList.toggle("open");
        mobileMenuOverlay.classList.toggle("active");
        hamburger.setAttribute("data-state", isOpen ? "open" : "closed");
        document.body.style.overflow = isOpen ? "hidden" : "";
      }
    }

    if (hamburger) hamburger.addEventListener("click", toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener("click", toggleMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener("click", toggleMenu);

    // Ensure mobileMenu exists before querySelectorAll
    if (mobileMenu) {
      document.querySelectorAll(".mobile-menu a, .mobile-menu button").forEach(el => {
        el.addEventListener("click", toggleMenu);
      });
    }
    
    // Scroll event for navbar styling (ensure .navbar exists from the fetched HTML)
    window.addEventListener("scroll", function () {
      const navbar = document.querySelector(".navbar"); // This assumes .navbar is part of navbar.html
      if (navbar) {
        if (window.scrollY > 0) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }
    });
  })
  .catch(error => console.error('Error fetching or processing navbar.html:', error));

// Footer loading
fetch('../component/footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
  })
  .catch(error => console.error('Error fetching or processing footer.html:', error));


  
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer setup
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      } else {
        entry.target.classList.remove('animate');
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll('.about-image, .about-text, .stats-content, .imax-content, .premiere-content');
  animateElements.forEach(el => observer.observe(el));

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      try {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else {
          console.warn(`Smooth scroll target not found for id: ${targetId}`);
        }
      } catch (error) {
        console.error(`Invalid selector for smooth scroll: ${targetId}`, error);
      }
    });
  });
});