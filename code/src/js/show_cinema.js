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

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('cinema-modal');
    const closeModalButton = document.querySelector('.modal .close');
    const cinemaCards = document.querySelectorAll('.cinema-card');

    // OPEN MODAL ON CARD CLICK
    cinemaCards.forEach(card => {
        card.addEventListener('click', () => {
            document.getElementById('modal-image').src = card.dataset.image;
            document.getElementById('modal-rating').textContent = card.dataset.rating;
            document.getElementById('modal-name').textContent = card.dataset.name;
            
            const address = card.dataset.address;
            const addressElement = document.getElementById('modal-address');
            addressElement.textContent = address;
            addressElement.href = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
            document.getElementById('modal-floor').textContent = card.dataset.floor;
            modal.style.display = 'flex';
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
            document.body.style.overflow = 'hidden'; 
        });
    });

    function closeModal() {
        modal.classList.remove('show');
        
        modal.addEventListener('transitionend', function handleTransitionEnd() {
            modal.style.display = 'none';
            document.body.style.overflow = ''; 
            modal.removeEventListener('transitionend', handleTransitionEnd);
        }, { once: true }); 
    }

    // CLOSE MODAL WITH BUTTON
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    // CLOSE MODAL WHEN CLICKING OUTSIDE CONTENT
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === this) { 
                closeModal();
            }
        });
    }

    // FILTERING
    const searchInput = document.getElementById('search');
    const locationFilterInput = document.getElementById('location-filter');

    if (locationFilterInput) {
        locationFilterInput.addEventListener('change', handleFilter);
    }
    if (searchInput) {
        searchInput.addEventListener('input', handleFilter);
    }

    function handleFilter() {
        const searchTerm = searchInput.value.toLowerCase();
        const locationValue = locationFilterInput.value.toLowerCase();
        filterCinemas(searchTerm, locationValue);
    }

    function filterCinemas(searchTerm, locationValue) {
        document.querySelectorAll('.cinema-card').forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const location = card.dataset.location.toLowerCase();

            const matchesSearch = name.includes(searchTerm);
            const matchesLocation = locationValue === "" || location === locationValue;

            if (matchesSearch && matchesLocation) {
                card.style.display = 'block'; 
            } else {
                card.style.display = 'none';
                card.classList.remove('animate'); 
            }
        });
    }
});

const scrollObserverOptions = {
    threshold: 0.1,
};

const scrollObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('animate');
    } else {
        entry.target.classList.remove('animate');
    }
    });
}, scrollObserverOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.cinema-header h1, .search-filter, .cinema-card');
    animateElements.forEach(el => {
    scrollObserver.observe(el);
    });
});
