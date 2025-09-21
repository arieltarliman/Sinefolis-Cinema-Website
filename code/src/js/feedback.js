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

class FeedbackValidator {
    constructor() {
        this.form = document.getElementById('feedbackForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.popup = document.getElementById('thankYouPopup');
        this.countdown = document.getElementById('countdown');
        
        if (!this.form || !this.submitBtn || !this.popup || !this.countdown) {
            console.error('One or more essential form elements are missing from the DOM.');
            return; 
        }
        
        this.initializeComponents();
        this.setupEventListeners();
    }

    initializeFieldValidation() {
        const fields = [
            { id: 'fullName', errorId: 'nameError', validator: this.validateName.bind(this) },
            { id: 'email', errorId: 'emailError', validator: this.validateEmail.bind(this) },
            { id: 'visitDate', errorId: 'dateError', validator: this.validateDate.bind(this) },
            { id: 'movieTitle', errorId: 'movieError', validator: this.validateMovie.bind(this) },
            { id: 'positiveExperience', errorId: 'positiveError', validator: this.validateTextarea.bind(this) },
            { id: 'improvements', errorId: 'improvementError', validator: this.validateTextarea.bind(this) }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            const errorElement = document.getElementById(field.errorId);
            
            if (!element || !errorElement) {
                console.warn(`Element or error element missing for field ID: ${field.id} or error ID: ${field.errorId}`);
                return; 
            }
            
            element.addEventListener('blur', () => {
                this.validateField(element, errorElement, field.validator);
            });
            
            element.addEventListener('input', () => {
                if (errorElement.classList.contains('show')) {
                    this.validateField(element, errorElement, field.validator);
                }
            });
        });
    }

    initializeStarRating() {
        const starRatings = document.querySelectorAll('.star-rating');
        
        starRatings.forEach(rating => {
            const stars = rating.querySelectorAll('.star');
            const ratingType = rating.dataset.rating;
            if (!ratingType) return; 

            const hiddenInput = document.getElementById(`${ratingType}Rating`);
            const errorElement = document.getElementById(`${ratingType}Error`);

            if (!hiddenInput || !errorElement) {
                console.warn(`Hidden input or error element missing for star rating: ${ratingType}`);
                return; 
            }
            
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const value = index + 1;
                    hiddenInput.value = value;
                    
                    stars.forEach((s, i) => {
                        s.classList.toggle('active', i < value);
                    });
                    
                    this.clearError(errorElement);
                });
                
                star.addEventListener('mouseenter', () => {
                    stars.forEach((s, i) => {
                        s.style.color = (i <= index) ? 'var(--tan)' : 'rgba(198, 172, 142, 0.3)';
                    });
                });
                
                star.addEventListener('mouseleave', () => {
                    stars.forEach((s) => {
                        const isActive = s.classList.contains('active');
                        s.style.color = isActive ? 'var(--tan)' : 'rgba(198, 172, 142, 0.3)';
                    });
                });
            });
        });
    }

    // Component 3: Number Rating System
    initializeNumberRating() {
        const numberRatingContainer = document.getElementById('recommendRating'); 
        if (!numberRatingContainer) {
             return;
        }

        const buttons = numberRatingContainer.querySelectorAll('.rating-btn');
        const hiddenInput = document.getElementById('recommendValue');
        const errorElement = document.getElementById('recommendError');

        if (!hiddenInput || !errorElement || buttons.length === 0) {
            console.warn('Elements for number rating (hidden input, error element, or buttons) are missing.');
            return;
        }
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.dataset.value;
                hiddenInput.value = value;
                
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.clearError(errorElement);
                
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }

    // Component 4: Form Submission Handler
    initializeFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevents default HTML validation and submission
            
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    initializeMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        } else {
        }
    }

    initializeComponents() {
        this.initializeFieldValidation();
        this.initializeStarRating();
        this.initializeNumberRating();
        this.initializeFormSubmission();
        this.initializeMobileNavigation();
    }

    setupEventListeners() {
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });

        const formSections = document.querySelectorAll('.form-section');
        formSections.forEach(section => {
            section.addEventListener('mouseenter', () => {
                section.style.transform = 'translateX(5px)';
                section.style.transition = 'transform 0.3s ease';
            });
            
            section.addEventListener('mouseleave', () => {
                section.style.transform = 'translateX(0)';
            });
        });
    }

    // Validation methods
    validateName(value) {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return 'Name is required';
        }
        if (trimmedValue.length < 2) {
            return 'Name must be at least 2 characters';
        }
        for (let i = 0; i < trimmedValue.length; i++) {
            const char = trimmedValue[i];
            const isLowerCaseLetter = (char >= 'a' && char <= 'z');
            const isUpperCaseLetter = (char >= 'A' && char <= 'Z');
            const isSpace = char === ' ';
            if (!isLowerCaseLetter && !isUpperCaseLetter && !isSpace) {
                return 'Name can only contain letters and spaces';
            }
        }
        return '';
    }

    validateEmail(value) {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return 'Email is required';
        }

        if (trimmedValue.includes(' ')) {
            return 'Email address cannot contain spaces';
        }

        const indexOfAt = trimmedValue.indexOf('@');
        const lastIndexOfAt = trimmedValue.lastIndexOf('@');

        if (indexOfAt === -1) {
            return 'Email must contain an @ symbol';
        }
        if (indexOfAt !== lastIndexOfAt) {
            return 'Email cannot contain multiple @ symbols';
        }
        if (indexOfAt === 0) {
            return 'Email cannot start with @ (missing username)';
        }
        if (indexOfAt === trimmedValue.length - 1) {
            return 'Email cannot end with @ (missing domain)';
        }

        const localPart = trimmedValue.substring(0, indexOfAt);
        const domainAndTldPart = trimmedValue.substring(indexOfAt + 1);


        const lastIndexOfDotInDomain = domainAndTldPart.lastIndexOf('.');

        if (lastIndexOfDotInDomain === -1) {
            return 'Email domain part must contain a . (dot)';
        }
        if (lastIndexOfDotInDomain === 0) {
            return 'Domain part cannot start with a . (dot) immediately after @'; 
        }
        if (lastIndexOfDotInDomain === domainAndTldPart.length - 1) {
            return 'Email cannot end with a . (dot)'; 
        }
        
        const domainPart = domainAndTldPart.substring(0, lastIndexOfDotInDomain);
        if (domainPart.includes('..')) {
            return 'Domain part cannot contain consecutive dots (e.g., domain..com)';
        }
        if (domainPart.length === 0) { 
            return 'Missing domain name (e.g., "example" in user@example.com)';
        }


        const tldPart = domainAndTldPart.substring(lastIndexOfDotInDomain + 1);
        if (tldPart.length < 2) {
            return 'Top-level domain (e.g., .com) must be at least 2 characters';
        }

        for (let i = 0; i < tldPart.length; i++) {
            const char = tldPart[i];
            const isLowerCaseLetter = (char >= 'a' && char <= 'z');
            const isUpperCaseLetter = (char >= 'A' && char <= 'Z');
            if (!isLowerCaseLetter && !isUpperCaseLetter) {
                return 'Top-level domain can only contain letters';
            }
        }
        
        for (let i = 0; i < domainPart.length; i++) {
            const char = domainPart[i];
            const isLowerCaseLetter = (char >= 'a' && char <= 'z');
            const isUpperCaseLetter = (char >= 'A' && char <= 'Z');
            const isNumber = (char >= '0' && char <= '9');
            const isHyphen = char === '-';
            if (!isLowerCaseLetter && !isUpperCaseLetter && !isNumber && !isHyphen) {
                return 'Domain name can only contain letters, numbers, and hyphens';
            }
            if (isHyphen && (i === 0 || i === domainPart.length - 1)) {
                 return 'Domain name cannot start or end with a hyphen';
            }
        }


        return '';
    }

    validateDate(value) {
        if (!value) {
            return 'Visit date is required';
        }
        const selectedDate = new Date(value);
        const today = new Date();
        
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            return 'Visit date cannot be in the future';
        }
        return '';
    }

    validateMovie(value) {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return 'Movie title is required';
        }
        if (trimmedValue.length < 2) {
            return 'Movie title must be at least 2 characters';
        }
        return '';
    }

    validateTextarea(value) {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return 'This field is required';
        }
        if (trimmedValue.length < 10) {
            return 'Please provide more detailed feedback (at least 10 characters)';
        }
        return '';
    }

    validateField(element, errorElement, validator) {
        const error = validator(element.value);
        const fieldContainer = element.closest('.input-field'); 
        
        if (error) {
            this.showError(errorElement, error);
            if (fieldContainer) fieldContainer.classList.add('error');
            return false;
        } else {
            this.clearError(errorElement);
            if (fieldContainer) fieldContainer.classList.remove('error');
            return true;
        }
    }

    validateRatings() {
        let isValid = true;
        const starRatingTypes = ['overall', 'service']; 
        starRatingTypes.forEach(ratingType => {
            const hiddenInput = document.getElementById(`${ratingType}Rating`);
            const errorElement = document.getElementById(`${ratingType}Error`);

            if (hiddenInput && errorElement) { 
                if (!hiddenInput.value) {
                    this.showError(errorElement, 'Please provide a rating');
                    isValid = false;
                } else {
                    this.clearError(errorElement);
                }
            }
        });
        
        const recommendValueInput = document.getElementById('recommendValue');
        const recommendErrorElement = document.getElementById('recommendError');

        if (recommendValueInput && recommendErrorElement) { 
            if (!recommendValueInput.value) {
                this.showError(recommendErrorElement, 'Please select a recommendation score');
                isValid = false;
            } else {
                this.clearError(recommendErrorElement);
            }
        }
        return isValid;
    }

    validateForm() {
        let isValid = true;
        const fieldsToValidate = [
            { id: 'fullName', errorId: 'nameError', validator: this.validateName.bind(this) },
            { id: 'email', errorId: 'emailError', validator: this.validateEmail.bind(this) },
            { id: 'visitDate', errorId: 'dateError', validator: this.validateDate.bind(this) },
            { id: 'movieTitle', errorId: 'movieError', validator: this.validateMovie.bind(this) },
            { id: 'positiveExperience', errorId: 'positiveError', validator: this.validateTextarea.bind(this) },
            { id: 'improvements', errorId: 'improvementError', validator: this.validateTextarea.bind(this) }
        ];

        fieldsToValidate.forEach(field => {
            const element = document.getElementById(field.id);
            const errorElement = document.getElementById(field.errorId);
            
            if (element && errorElement) { 
                if (!this.validateField(element, errorElement, field.validator)) {
                    isValid = false;
                }
            }
        });
        
        if (!this.validateRatings()) {
            isValid = false;
        }
        
        return isValid;
    }

    showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    submitForm() {
        this.submitBtn.disabled = true; 
        this.submitBtn.classList.add('loading');
        this.submitBtn.textContent = 'Submitting...'; 
        
        setTimeout(() => {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false; 
            this.submitBtn.textContent = 'Submit Feedback';
            this.showThankYouPopup();
            this.form.reset(); 
            
            document.querySelectorAll('.star-rating').forEach(rating => {
                rating.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
                const ratingType = rating.dataset.rating;
                if (ratingType) {
                    const hiddenInput = document.getElementById(`${ratingType}Rating`);
                    if (hiddenInput) hiddenInput.value = '';
                }
            });

            const numberRatingContainer = document.getElementById('recommendRating');
            if (numberRatingContainer) {
                 numberRatingContainer.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('active'));
            }
            const recommendValueInput = document.getElementById('recommendValue');
            if (recommendValueInput) recommendValueInput.value = '';

        }, 2000);
    }

    showThankYouPopup() {
        this.popup.classList.add('show');
        let timeLeft = 3;
        this.countdown.textContent = timeLeft;
        
        const timer = setInterval(() => {
            timeLeft--;
            this.countdown.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                this.popup.classList.remove('show'); 
                window.location.href = 'index.html'; 
            }
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FeedbackValidator();
});

document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.form-section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(section);
    });
});