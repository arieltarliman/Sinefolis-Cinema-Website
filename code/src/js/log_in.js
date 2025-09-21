

class LoginValidator {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.loginBtn = document.getElementById('loginBtn');
        this.googleBtn = document.getElementById('googleLogin');
        this.popup = document.getElementById('successPopup');
        this.countdown = document.getElementById('countdown');
        
        if (!this.form || !this.loginBtn || !this.popup || !this.countdown) {
            console.error("LoginValidator: Critical form elements missing.");
            return;
        }
        if (!this.googleBtn) {
            console.warn("LoginValidator: Google login button not found.");
        }
        
        this.initializeComponents();
        this.setupEventListeners();
    }

    initializeComponents() {
        this.initializeFormValidation();
        this.initializePasswordToggle();
        
        this.initializeAnimations(); 
        this.initializeRippleEffect();
    }

    initializeFormValidation() {
        const emailField = document.getElementById('emailOrUsername');
        const passwordField = document.getElementById('password');
        
        if (!emailField || !passwordField) {
            console.error("LoginValidator: Email or Password field missing.");
            return;
        }

        emailField.addEventListener('blur', () => {
            this.validateEmailOrUsername();
        });
        
        emailField.addEventListener('input', () => {
            const errorElement = document.getElementById('emailError');
            if (errorElement && errorElement.classList.contains('show')) {
                this.validateEmailOrUsername();
            }
            
        });
        
        passwordField.addEventListener('blur', () => {
            this.validatePassword();
        });
        
        passwordField.addEventListener('input', () => {
            const errorElement = document.getElementById('passwordError');
            if (errorElement && errorElement.classList.contains('show')) {
                this.validatePassword();
            }
            
        });
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            this.handleFormSubmission();
        });
    }

    initializePasswordToggle() {
        const passwordField = document.getElementById('password');
        const passwordToggle = document.getElementById('passwordToggle');
        
        if (!passwordField || !passwordToggle) {
            console.warn("LoginValidator: Password field or toggle button missing.");
            return;
        }
        
        passwordToggle.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            const toggleIcon = passwordToggle.querySelector('.toggle-icon');
            if (toggleIcon) {
                toggleIcon.textContent = type === 'password' ? '👁️' : '🙈';
            }
            
        });
    }

    

    initializeAnimations() {
        this.addPageLoadAnimations();
        
        const interactiveElements = document.querySelectorAll('.highlight-item, .feature-preview');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                
            });
        });
        
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                
            });
        });
    }

    initializeRippleEffect() {
        const buttons = document.querySelectorAll('.login-btn, .google-btn');
        buttons.forEach(button => {
            if (button) { 
                button.addEventListener('click', (e) => {
                    this.createRipple(e, button);
                });
            }
        });
    }

    setupEventListeners() {
        if (this.googleBtn) {
            this.googleBtn.addEventListener('click', () => {
                this.handleGoogleLogin();
            });
        }
        
        const rememberCheckbox = document.getElementById('rememberMe');
        if (rememberCheckbox) {
            rememberCheckbox.addEventListener('change', () => {
                
            });
        }
        
        
    }

    
    validateEmailOrUsername() {
        const emailField = document.getElementById('emailOrUsername');
        const errorElement = document.getElementById('emailError');
        if (!emailField || !errorElement) return false;

        const value = emailField.value.trim();
        
        if (!value) {
            this.showError(errorElement, 'Email or Username is required');
            emailField.classList.add('error'); emailField.classList.remove('success');
            return false;
        }
        
        if (value.includes('@')) { 
            const indexOfAt = value.indexOf('@');
            const lastIndexOfAt = value.lastIndexOf('@');
    
            if (indexOfAt !== lastIndexOfAt) {
                this.showError(errorElement, 'Invalid email: multiple @ symbols');
                emailField.classList.add('error'); emailField.classList.remove('success');
                return false;
            }
            if (indexOfAt === 0 || indexOfAt === value.length - 1) {
                this.showError(errorElement, 'Invalid email: @ position');
                emailField.classList.add('error'); emailField.classList.remove('success');
                return false;
            }
            const domainPart = value.substring(indexOfAt + 1);
            const lastDotIndex = domainPart.lastIndexOf('.');
            if (lastDotIndex === -1 || lastDotIndex === 0 || lastDotIndex === domainPart.length - 1) {
                this.showError(errorElement, 'Invalid email domain format');
                emailField.classList.add('error'); emailField.classList.remove('success');
                return false;
            }
            if (domainPart.includes('..')) {
                this.showError(errorElement, 'Invalid email: consecutive dots in domain');
                emailField.classList.add('error'); emailField.classList.remove('success');
                return false;
            }
            const tld = domainPart.substring(lastDotIndex + 1);
            if (tld.length < 2) {
                this.showError(errorElement, 'Invalid email: TLD too short');
                emailField.classList.add('error'); emailField.classList.remove('success');
                return false;
            }
            for (let i = 0; i < tld.length; i++) {
                const char = tld[i].toLowerCase();
                if (!(char >= 'a' && char <= 'z')) {
                    this.showError(errorElement, 'Invalid email: TLD contains non-letters');
                    emailField.classList.add('error'); emailField.classList.remove('success');
                    return false;
                }
            }
        } else { 
            if (value.length < 3) {
                this.showError(errorElement, 'Username must be at least 3 characters');
                emailField.classList.add('error'); emailField.classList.remove('success');
                return false;
            }
             
            for (let i = 0; i < value.length; i++) {
                const char = value[i];
                const isLetterLower = (char >= 'a' && char <= 'z');
                const isLetterUpper = (char >= 'A' && char <= 'Z');
                const isDigit = (char >= '0' && char <= '9');
                const isUnderscore = char === '_';
                if (!(isLetterLower || isLetterUpper || isDigit || isUnderscore)) {
                    this.showError(errorElement, 'Username can only contain letters, numbers, and underscores');
                    emailField.classList.add('error'); emailField.classList.remove('success');
                    return false;
                }
            }
        }
        
        this.clearError(errorElement);
        emailField.classList.remove('error'); emailField.classList.add('success');
        return true;
    }

    validatePassword() {
        const passwordField = document.getElementById('password');
        const errorElement = document.getElementById('passwordError');
        if (!passwordField || !errorElement) return false;

        const value = passwordField.value; 
        
        if (!value) {
            this.showError(errorElement, 'Password is required');
            passwordField.classList.add('error'); passwordField.classList.remove('success');
            return false;
        }
        
        if (value.length < 6) { 
            this.showError(errorElement, 'Password must be at least 6 characters');
            passwordField.classList.add('error'); passwordField.classList.remove('success');
            return false;
        }
        
        this.clearError(errorElement);
        passwordField.classList.remove('error'); passwordField.classList.add('success');
        return true;
    }

    validateForm() {
        const emailValid = this.validateEmailOrUsername();
        const passwordValid = this.validatePassword();
        return emailValid && passwordValid;
    }

    handleFormSubmission() {
        if (this.validateForm()) {
            this.showLoadingState();
            setTimeout(() => {
                this.hideLoadingState();
                this.showSuccessPopup();
            }, 1500); 
        } else {
            this.addShakeAnimation(this.loginBtn);
        }
    }

    handleGoogleLogin() {
        
        
        setTimeout(() => {
            this.showSuccessPopup("Logged in with Google successfully!");
        }, 1000);
    }

    /* 
    fillDemoCredentials(type) { ... }
    */

    showLoadingState() {
        if(this.loginBtn) {
            this.loginBtn.classList.add('loading');
            this.loginBtn.disabled = true;
            const btnText = this.loginBtn.querySelector('.btn-text');
            if(btnText) btnText.textContent = "Signing In...";
        }
    }

    hideLoadingState() {
        if(this.loginBtn) {
            this.loginBtn.classList.remove('loading');
            this.loginBtn.disabled = false;
            const btnText = this.loginBtn.querySelector('.btn-text');
            if(btnText) btnText.textContent = "Sign In";
        }
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

    showSuccessPopup(message = "You have successfully signed in.") {
        if (!this.popup || !this.countdown) return;

        const popupMessageEl = this.popup.querySelector('.popup-message');
        if (popupMessageEl) popupMessageEl.textContent = message;
        
        this.popup.classList.add('show');
        
        let timeLeft = 3;
        this.countdown.textContent = timeLeft;
        
        const timerProgress = this.popup.querySelector('.timer-progress');
        if(timerProgress) { 
            timerProgress.style.animation = 'none';
            void timerProgress.offsetWidth; 
            timerProgress.style.animation = `timerProgress ${timeLeft}s linear forwards`;
        }

        const timer = setInterval(() => {
            timeLeft--;
            if (this.countdown) this.countdown.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                if (this.popup) this.popup.classList.remove('show');
                window.location.href = '../html/index.html'; 
            }
        }, 1000);
    }

    
    createRipple(event, button) {
        const existingRipple = button.querySelector('.btn-ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('btn-ripple');
        
        button.appendChild(circle);
        
        setTimeout(() => {
            circle.remove();
        }, 600);
    }

    addPageLoadAnimations() {
        const elements = document.querySelectorAll('.welcome-content, .form-container');
        elements.forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)'; 
                
                setTimeout(() => {
                    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 150); 
            }
        });
    }
    
    addShakeAnimation(element) {
        if (element) {
            element.style.animation = 'shake 0.4s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 400);
        }
    }

    
}


const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); } /* Less shake */
        20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new LoginValidator();
});


document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.welcome-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80); 
            }
        };
        setTimeout(typeWriter, 1200); 
    }
    
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValueText = stat.textContent; 
        let numericPart = '';
        let suffixPart = '';

        for(let char of finalValueText) {
            if (char >= '0' && char <= '9' || char === '.') { 
                numericPart += char;
            } else {
                suffixPart += char;
            }
        }
        
        const numericValue = parseFloat(numericPart);
        if (isNaN(numericValue)) return;

        let currentValue = 0;
        const duration = 1500; 
        const steps = 50;
        const increment = numericValue / steps;
        const stepDuration = duration / steps;
        
        let currentStep = 0;
        const counter = setInterval(() => {
            currentValue += increment;
            currentStep++;
            if (currentStep >= steps || currentValue >= numericValue) {
                stat.textContent = finalValueText; 
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(currentValue) + suffixPart;
            }
        }, stepDuration);
    });
});