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

let selectedSeats = [];
let beverageQuantities = {
    popcorn: 0,
    cola: 0,
    hotdog: 0,
    fries: 0
};

const beveragePrices = {
    popcorn: 8.00,
    cola: 4.50,
    hotdog: 6.00,
    fries: 5.50
};

const seatPrice = 12.00; 


function toggleSeat(seatElement) {
    const seatId = seatElement.getAttribute('data-seat');
    
    if (seatElement.classList.contains('selected')) {
        
        seatElement.classList.remove('selected');
        selectedSeats = selectedSeats.filter(seat => seat !== seatId);
    } else {
        
        seatElement.classList.add('selected');
        selectedSeats.push(seatId);
    }
    
    updateInvoice();
    saveState(); 
}


function updateQuantity(beverage, change) {
    const currentQty = beverageQuantities[beverage];
    const newQty = Math.max(0, currentQty + change); 
    
    beverageQuantities[beverage] = newQty;
    document.getElementById(`${beverage}-qty`).textContent = newQty;
    
    updateInvoice();
    saveState(); 
}


function updateInvoice() {
    const seatsSection = document.getElementById('selected-seats');
    const beveragesSection = document.getElementById('selected-beverages');
    
    
    if (seatsSection) seatsSection.innerHTML = '';
    if (beveragesSection) beveragesSection.innerHTML = '';
    
    let subtotal = 0;
    
    
    if (selectedSeats.length > 0) {
        selectedSeats.forEach(seatId => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <span>Seat ${seatId}</span>
                <span>1</span>
                <span>$${seatPrice.toFixed(2)}</span>
                <span>$${seatPrice.toFixed(2)}</span>
            `;
            if (seatsSection) seatsSection.appendChild(orderItem);
            subtotal += seatPrice;
        });
    }
    
    
    Object.keys(beverageQuantities).forEach(beverage => {
        const qty = beverageQuantities[beverage];
        if (qty > 0) {
            const price = beveragePrices[beverage];
            const total = price * qty;
            const beverageName = beverage.charAt(0).toUpperCase() + beverage.slice(1);
            
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <span>${beverageName}</span>
                <span>${qty}</span>
                <span>$${price.toFixed(2)}</span>
                <span>$${total.toFixed(2)}</span>
            `;
            if (beveragesSection) beveragesSection.appendChild(orderItem);
            subtotal += total;
        }
    });
    
    const taxRate = 0.10; 
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    const finishBtn = document.querySelector('.finish-btn');
    if (finishBtn) {
        if (selectedSeats.length > 0) {
            finishBtn.disabled = false;
            finishBtn.textContent = 'Complete Payment';
        } else {
            finishBtn.disabled = true;
            finishBtn.textContent = 'Select Seats to Continue';
        }
    }
}


function finishTransaction() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat to continue.');
        return;
    }
    
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        alert('Please select a payment method.');
        return;
    }
    
    const finishBtn = document.querySelector('.finish-btn');
    if (finishBtn) {
        finishBtn.textContent = 'Processing...';
        finishBtn.disabled = true;
    }
    
    setTimeout(() => {
        showSuccessModal();
    }, 2000);
}


function showSuccessModal() {
    const modal = document.getElementById('successModal');
    const orderNumberSpan = document.getElementById('orderNumber');
    
    if (modal && orderNumberSpan) {
        const timestamp = Date.now().toString();
        const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        orderNumberSpan.textContent = `#${timestamp.substring(timestamp.length - 5)}${randomSuffix}`;

        modal.classList.add('visible'); 
        
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(0.9)'; 
            modalContent.style.opacity = '0';

            setTimeout(() => {
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
            }, 50); 
        }
    }
}


function goToHome() {
    
    selectedSeats = [];
    beverageQuantities = { popcorn: 0, cola: 0, hotdog: 0, fries: 0 };
    
    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
    });
    
    Object.keys(beverageQuantities).forEach(beverage => {
        const qtyEl = document.getElementById(`${beverage}-qty`);
        if (qtyEl) qtyEl.textContent = '0';
    });
    
    const firstPaymentOption = document.querySelector('input[name="payment"][value="visa"]');
    if (firstPaymentOption) firstPaymentOption.checked = true;

    updateInvoice(); 
    
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('visible');

    localStorage.removeItem('cinemaBooking');

    
    window.location.href = 'index.html'; 
}


function saveToLocalStorage() {
    const data = {
        selectedSeats: selectedSeats,
        beverageQuantities: beverageQuantities,
        timestamp: Date.now()
    };
    localStorage.setItem('cinemaBooking', JSON.stringify(data));
}


function loadFromLocalStorage() {
    const savedData = localStorage.getItem('cinemaBooking');
    if (savedData) {
        const data = JSON.parse(savedData);
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - data.timestamp < oneHour) {
            selectedSeats = data.selectedSeats || [];
            beverageQuantities = data.beverageQuantities || { popcorn: 0, cola: 0, hotdog: 0, fries: 0 };
            
            selectedSeats.forEach(seatId => {
                const seatElement = document.querySelector(`.seat[data-seat="${seatId}"]`);
                if (seatElement && !seatElement.classList.contains('occupied')) {
                    seatElement.classList.add('selected');
                }
            });
            
            Object.keys(beverageQuantities).forEach(beverage => {
                const qtyEl = document.getElementById(`${beverage}-qty`);
                if (qtyEl) qtyEl.textContent = beverageQuantities[beverage];
            });
            
            updateInvoice();
        } else {
            localStorage.removeItem('cinemaBooking');
        }
    }
}

function saveState() {
    saveToLocalStorage();
}

document.addEventListener('DOMContentLoaded', function() {
    updateInvoice(); 
    loadFromLocalStorage();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const showImage = () => { img.style.opacity = '1'; };
        if (img.complete && img.naturalHeight !== 0) {
            showImage();
        } else {
            img.style.opacity = '0'; 
            img.style.transition = 'opacity 0.3s ease';
            img.addEventListener('load', showImage);
            img.addEventListener('error', function() {
                console.error('Cannot load image:', this.src);
            });
        }
    });
});

const successModalInstance = document.getElementById('successModal');
if (successModalInstance) {
    successModalInstance.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('visible');
        }
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modalToClose = document.getElementById('successModal');
        if (modalToClose && modalToClose.classList.contains('visible')) {
            modalToClose.classList.remove('visible');
        }
    }
});