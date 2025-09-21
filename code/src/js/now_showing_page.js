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

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    if (!slides.length || !dots.length) return; 

    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        
        
        if (i === index) {
            slide.classList.add('active');
            const bgSrc = slide.getAttribute('data-bg-src');
            if (bgSrc) {
                slide.style.backgroundImage = `url('${bgSrc}')`;
            }
        }
    });
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) { 
      dots[index].classList.add('active');
    }
}

function changeSlide(direction) {
    if (!slides.length) return;
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    if (!slides.length) return;
    currentSlideIndex = index - 1; 
    showSlide(currentSlideIndex);
}


function setupTopFilmsCarousel() {
    const track = document.getElementById('topFilmsTrack');
    if (!track) return;

    const originalCards = Array.from(track.children); 
    const cardsHTML = track.innerHTML;
    
    
    track.innerHTML = cardsHTML + cardsHTML;

    
    const allSmallCards = track.querySelectorAll('.film-card-small');
    allSmallCards.forEach(card => {
        const originalTitleElement = card.querySelector('h4');
        const overlayTitleElement = card.querySelector('.film-overlay-small .overlay-title');
        if (originalTitleElement && overlayTitleElement) {
            overlayTitleElement.textContent = originalTitleElement.textContent;
        }
    });
}


function showFilms(category, event) { 
    const filmCards = document.querySelectorAll('#filmsGrid .film-card'); 
    const tabBtns = document.querySelectorAll('.film-tabs .tab-btn');
    
    
    tabBtns.forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) { 
        event.currentTarget.classList.add('active');
    }
    
    
    filmCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        
        
        
        
        if (cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    
    document.getElementById('searchInput').value = '';
    document.getElementById('locationFilter').value = '';
    
    applyAllFilters(); 
}


function searchFilms() {
    applyAllFilters();
}


function filterByLocation() {
    applyAllFilters();
}


function applyAllFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedLocation = document.getElementById('locationFilter').value;
    const filmCards = document.querySelectorAll('#filmsGrid .film-card');
    const activeTabButton = document.querySelector('.film-tabs .tab-btn.active');
    
    if (!activeTabButton) return; 
    const activeCategory = activeTabButton.textContent.toLowerCase().replace(' ', '-');

    filmCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const filmTitleElement = card.querySelector('.film-details h3');
        const filmTitle = filmTitleElement ? filmTitleElement.textContent.toLowerCase() : '';
        const cardLocation = card.getAttribute('data-location');

        let displayCard = true;

        
        if (cardCategory !== activeCategory) {
            displayCard = false;
        }

        
        if (searchTerm && !filmTitle.includes(searchTerm)) {
            displayCard = false;
        }

        
        if (selectedLocation && cardLocation !== selectedLocation) {
            displayCard = false;
        }
        
        card.style.display = displayCard ? 'block' : 'none';
    });
}



document.addEventListener('DOMContentLoaded', function() {
    
    if (slides.length > 0 && dots.length > 0) { 
        showSlide(currentSlideIndex); 
         
        setInterval(() => {
            changeSlide(1);
        }, 5000);
    }
    
    
    setupTopFilmsCarousel();
    
    
    document.addEventListener('keydown', function(e) {
        if (document.querySelector('.hero-carousel:hover')) { 
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
        }
    });
    
    
    const initialActiveTab = document.querySelector('.film-tabs .tab-btn.active');
    if (initialActiveTab) {
      const initialCategory = initialActiveTab.textContent.toLowerCase().replace(' ', '-');
      
      document.querySelectorAll('#filmsGrid .film-card').forEach(card => {
        if (card.getAttribute('data-category') === initialCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
      });
    } else if (document.querySelectorAll('#filmsGrid .film-card').length > 0) {
        
        document.querySelectorAll('#filmsGrid .film-card').forEach(card => {
            if (card.getAttribute('data-category') === 'now-showing') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
          });
    }


    
    const carouselContainer = document.querySelector('.hero-carousel .carousel-container');
    if (carouselContainer) {
        let startX = 0;
        let endX = 0;

        carouselContainer.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        }, { passive: true }); 

        carouselContainer.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const threshold = 50; 
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    changeSlide(1); 
                } else {
                    changeSlide(-1); 
                }
            }
        }
    }
});



const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('animate');
    } else {
        entry.target.classList.remove('animate');
    }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.section-title, .film-card-small, .film-card');
    animateElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (
        rect.top < window.innerHeight && rect.bottom >= 0 &&
        rect.left < window.innerWidth && rect.right >= 0 &&
        getComputedStyle(el).display !== 'none' 
    )             
    observer.observe(el);
    });
});
