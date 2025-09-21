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

  
function toggleTheater(header) {
    const theaterItem = header.parentElement;
    const allTheaterItems = document.querySelectorAll('.theater-item');
    const isActive = theaterItem.classList.contains('active');

    allTheaterItems.forEach(item => {
        if (item !== theaterItem) {
            item.classList.remove('active');
            const otherIcon = item.querySelector('.toggle-icon');
            if (otherIcon) otherIcon.textContent = '▼';
        }
    });
    
    theaterItem.classList.toggle('active');
    const currentIcon = header.querySelector('.toggle-icon');
    if (currentIcon) {
        currentIcon.textContent = theaterItem.classList.contains('active') ? '▲' : '▼';
    }
}

function searchTheaters() {
    const searchTerm = document.getElementById('theaterSearch').value.toLowerCase();
    const theaterItems = document.querySelectorAll('.theater-item');
    
    theaterItems.forEach(item => {
        const theaterName = item.getAttribute('data-theater').toLowerCase();
        
        if (theaterName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function selectTimeSlot(button) {

    const allTimeSlots = document.querySelectorAll('.time-slot');
    allTimeSlots.forEach(slot => {
        slot.classList.remove('selected');
    });
    
    button.classList.add('selected');
    
    console.log('Selected time:', button.textContent);
    console.log('Theater:', button.closest('.theater-item').querySelector('.theater-name').textContent);
    console.log('Screening type:', button.closest('.screening-type').querySelector('.type-title').textContent);
    
    window.location.href = 'payment.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const timeSlots = document.querySelectorAll('.time-slot');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function(e) { 
            addRippleEffect(this, e); 
            selectTimeSlot(this);
        });
    });
    
    const theaterSearchInput = document.getElementById('theaterSearch');
    if (theaterSearchInput) {
        theaterSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTheaters();
            }
        });
    }
    
    const searchButton = document.querySelector('.search-btn');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            searchTheaters();
        });
    }

});

function smoothScrollToTheater(theaterName) {
    const theater = document.querySelector(`[data-theater="${theaterName.toLowerCase()}"]`);
    if (theater) {
        theater.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.theater-item')) {
        const activeTheaters = document.querySelectorAll('.theater-item.active');
        activeTheaters.forEach(theater => {
            theater.classList.remove('active');
            const icon = theater.querySelector('.toggle-icon');
            if (icon) icon.textContent = '▼';
        });
    }
});

document.addEventListener('keydown', function(e) {
    const activeTheater = document.querySelector('.theater-item.active');
    
    if (e.key === 'Escape' && activeTheater) {
        activeTheater.classList.remove('active');
        const icon = activeTheater.querySelector('.toggle-icon');
        if (icon) icon.textContent = '▼';
    }
});


function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    const existingRipple = element.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600); 
}