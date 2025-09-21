class SignUpValidator {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.popup = document.getElementById('successPopup');
        this.countdown = document.getElementById('countdown');
        
        if (!this.form || !this.submitBtn || !this.popup || !this.countdown) {
            console.error("SignUpValidator: Critical form elements missing from the DOM.");
            return;
        }
        
        this.initializeComponents();
        this.setupEventListeners();
    }

    // Component 1: Real-time Field Validation
    initializeFieldValidation() {
        const fields = [
            { id: 'firstName', errorId: 'firstNameError', validator: this.validateName.bind(this) },
            { id: 'lastName', errorId: 'lastNameError', validator: this.validateName.bind(this) },
            { id: 'email', errorId: 'emailError', validator: this.validateEmail.bind(this) },
            { id: 'phone', errorId: 'phoneError', validator: this.validatePhone.bind(this) },
            { id: 'username', errorId: 'usernameError', validator: this.validateUsername.bind(this) },
            { id: 'dateOfBirth', errorId: 'dateOfBirthError', validator: this.validateDateOfBirth.bind(this) }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            const errorElement = document.getElementById(field.errorId);
            
            if (!element || !errorElement) {
                console.warn(`SignUpValidator: Element or error span missing for field ${field.id}`);
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

    // Component 2: Password Strength and Validation
    initializePasswordValidation() {
        const passwordField = document.getElementById('password');
        const confirmPasswordField = document.getElementById('confirmPassword');
        const passwordToggle = document.getElementById('passwordToggle');
        const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
        const strengthBar = document.querySelector('#passwordStrength .strength-fill');
        const strengthText = document.querySelector('#passwordStrength .strength-text');

        if (!passwordField || !confirmPasswordField || !passwordToggle || !confirmPasswordToggle || !strengthBar || !strengthText) {
            console.warn("SignUpValidator: One or more password elements are missing.");
            return;
        }

        passwordToggle.addEventListener('click', () => {
            this.togglePasswordVisibility(passwordField, passwordToggle);
        });

        confirmPasswordToggle.addEventListener('click', () => {
            this.togglePasswordVisibility(confirmPasswordField, confirmPasswordToggle);
        });

        passwordField.addEventListener('input', () => {
            const strength = this.calculatePasswordStrength(passwordField.value);
            this.updatePasswordStrength(strengthBar, strengthText, strength);
            this.validatePassword(); 
            if (confirmPasswordField.value) {
                this.validatePasswordMatch();
            }
        });

        confirmPasswordField.addEventListener('input', () => {
            this.validatePasswordMatch();
        });

        passwordField.addEventListener('blur', () => {
            this.validatePassword();
        });

        confirmPasswordField.addEventListener('blur', () => {
            this.validatePasswordMatch();
        });
    }

    // Component 3: Terms and Conditions Validation
    initializeTermsValidation() {
        const termsCheckbox = document.getElementById('termsAccepted');
        const termsError = document.getElementById('termsError');

        if (!termsCheckbox || !termsError) {
            console.warn("SignUpValidator: Terms checkbox or error span missing.");
            return;
        }

        termsCheckbox.addEventListener('change', () => {
            if (termsCheckbox.checked) {
                this.clearError(termsError);
                this.addCheckboxAnimation(termsCheckbox); 
            }
        });
    }

    // Component 4: Form Submission Handler
    initializeFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            if (this.validateForm()) {
                this.submitForm();
            } else {
                console.log("Form validation failed.");
            }
        });

        const googleBtn = document.getElementById('googleSignup');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                setTimeout(() => {
                    this.showSuccessPopup("Signed up with Google successfully!"); 
                }, 1000);
            });
        }
    }

    initializeComponents() {
        this.initializeFieldValidation();
        this.initializePasswordValidation();
        this.initializeTermsValidation();
        this.initializeFormSubmission();
    }

    setupEventListeners() {
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
             setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease-in-out';
                document.body.style.opacity = '1';
            }, 50);
        });
    }

    validateName(value) {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return 'This field is required';
        }
        if (trimmedValue.length < 2) {
            return 'Must be at least 2 characters';
        }
        for (let i = 0; i < trimmedValue.length; i++) {
            const char = trimmedValue[i];
            const isLetterLower = (char >= 'a' && char <= 'z');
            const isLetterUpper = (char >= 'A' && char <= 'Z');
            const isSpace = char === ' ';
            const isHyphen = char === '-';
            const isApostrophe = char === "'";
            if (!(isLetterLower || isLetterUpper || isSpace || isHyphen || isApostrophe)) {
                return 'Invalid character found';
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
            return 'Email cannot contain spaces';
        }

        const indexOfAt = trimmedValue.indexOf('@');
        const lastIndexOfAt = trimmedValue.lastIndexOf('@');

        if (indexOfAt === -1) return 'Email must contain an @ symbol';
        if (indexOfAt !== lastIndexOfAt) return 'Email can only contain one @ symbol';
        if (indexOfAt === 0) return 'Email cannot start with @';
        if (indexOfAt === trimmedValue.length - 1) return 'Email cannot end with @';

        const domainPartWithTld = trimmedValue.substring(indexOfAt + 1);
        const lastDotIndexInDomain = domainPartWithTld.lastIndexOf('.');

        if (lastDotIndexInDomain === -1) return 'Domain must contain a dot (e.g., .com)';
        if (lastDotIndexInDomain === 0) return 'Domain cannot start with a dot after @';
        if (lastDotIndexInDomain === domainPartWithTld.length - 1) return 'Email cannot end with a dot';
        
        const domainName = domainPartWithTld.substring(0, lastDotIndexInDomain);
        const tld = domainPartWithTld.substring(lastDotIndexInDomain + 1);

        if (domainName.length === 0) return 'Domain name is missing';
        if (domainName.includes('..')) return 'Domain name cannot have consecutive dots';
        
        for (let i = 0; i < domainName.length; i++) {
            const char = domainName[i];
            const isLetterLower = (char >= 'a' && char <= 'z');
            const isLetterUpper = (char >= 'A' && char <= 'Z');
            const isDigit = (char >= '0' && char <= '9');
            const isHyphen = char === '-';
            if (!(isLetterLower || isLetterUpper || isDigit || isHyphen)) {
                return 'Domain contains invalid characters';
            }
            if (isHyphen && (i === 0 || i === domainName.length - 1)) {
                return 'Domain cannot start or end with a hyphen';
            }
        }
        
        if (tld.length < 2) return 'TLD must be at least 2 characters';
        for (let i = 0; i < tld.length; i++) {
            const char = tld[i];
            const isLetterLower = (char >= 'a' && char <= 'z');
            const isLetterUpper = (char >= 'A' && char <= 'Z');
            if (!(isLetterLower || isLetterUpper)) {
                return 'TLD can only contain letters';
            }
        }
        return '';
    }

    validatePhone(value) {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return 'Phone number is required';
        }
        let cleanPhone = '';
        for (let i = 0; i < trimmedValue.length; i++) {
            const char = trimmedValue[i];
            if (char === '+' && i === 0 && cleanPhone.length === 0) {
                 cleanPhone += char;
            } else if (char >= '0' && char <= '9') {
                cleanPhone += char;
            } else if (char === ' ' || char === '-' || char === '(' || char === ')') {
                continue;
            } else {
                return 'Phone number contains invalid characters';
            }
        }
        
        const digitsOnly = cleanPhone.startsWith('+') ? cleanPhone.substring(1) : cleanPhone;
        let digitCount = 0;
        for(let i = 0; i < digitsOnly.length; i++) {
            if(digitsOnly[i] >= '0' && digitsOnly[i] <= '9') {
                digitCount++;
            }
        }

        if (digitCount < 7 || digitCount > 15) {
            return 'Phone number must be between 7 and 15 digits';
        }
        return '';
    }

    validateUsername(value) {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            return 'Username is required';
        }
        if (trimmedValue.length < 3) {
            return 'Username must be at least 3 characters';
        }
        if (trimmedValue.length > 20) {
            return 'Username must be less than 20 characters';
        }
        for (let i = 0; i < trimmedValue.length; i++) {
            const char = trimmedValue[i];
            const isLetterLower = (char >= 'a' && char <= 'z');
            const isLetterUpper = (char >= 'A' && char <= 'Z');
            const isDigit = (char >= '0' && char <= '9');
            const isUnderscore = char === '_';
            if (!(isLetterLower || isLetterUpper || isDigit || isUnderscore)) {
                return 'Username can only contain letters, numbers, and underscores';
            }
        }
        return '';
    }

    validateDateOfBirth(value) {
        if (!value) {
            return 'Date of birth is required';
        }
        const birthDate = new Date(value);
        const today = new Date();
        
        birthDate.setHours(0,0,0,0);
        today.setHours(0,0,0,0);     

        if (isNaN(birthDate.getTime())) {
             return 'Invalid date format for date of birth';
        }

        if (birthDate >= today) {
            return 'Date of birth must be in the past';
        }
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 13) {
            return 'You must be at least 13 years old';
        }
        if (age > 120) {
            return 'Please enter a valid date of birth (age unrealistic)';
        }
        return '';
    }

    validatePassword() {
        const passwordField = document.getElementById('password');
        if (!passwordField) return false;
        const password = passwordField.value;
        const errorElement = document.getElementById('passwordError');

        if (!password) {
            this.showError(errorElement, 'Password is required');
            return false;
        }
        if (password.length < 8) {
            this.showError(errorElement, 'Password must be at least 8 characters');
            return false;
        }

        let hasLowercase = false;
        let hasUppercase = false;
        let hasDigit = false;

        for (let i = 0; i < password.length; i++) {
            const char = password[i];
            if (char >= 'a' && char <= 'z') hasLowercase = true;
            else if (char >= 'A' && char <= 'Z') hasUppercase = true;
            else if (char >= '0' && char <= '9') hasDigit = true;
        }

        if (!hasLowercase) {
            this.showError(errorElement, 'Must contain a lowercase letter');
            return false;
        }
        if (!hasUppercase) {
            this.showError(errorElement, 'Must contain an uppercase letter');
            return false;
        }
        if (!hasDigit) {
            this.showError(errorElement, 'Must contain a number');
            return false;
        }
        
        this.clearError(errorElement);
        return true;
    }

    validatePasswordMatch() {
        const passwordField = document.getElementById('password');
        const confirmPasswordField = document.getElementById('confirmPassword');
        if (!passwordField || !confirmPasswordField) return false;

        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        const errorElement = document.getElementById('confirmPasswordError');
        
        if (!confirmPassword && password) {
            this.showError(errorElement, 'Please confirm your password');
            return false;
        }
         if (confirmPassword && password !== confirmPassword) {
            this.showError(errorElement, 'Passwords do not match');
            return false;
        }
        
        this.clearError(errorElement);
        return true;
    }

    calculatePasswordStrength(password) {
        let score = 0;
        if (!password) return 0;

        if (password.length >= 8) score++;
        else if (password.length >= 5) score += 0.5;

        let hasLowercase = false;
        let hasUppercase = false;
        let hasDigit = false;
        let hasSpecial = false;
        const specialChars = "!@#$%^&*()_+-=[]{};':\",./<>?";

        for (let i = 0; i < password.length; i++) {
            const char = password[i];
            if (char >= 'a' && char <= 'z') hasLowercase = true;
            else if (char >= 'A' && char <= 'Z') hasUppercase = true;
            else if (char >= '0' && char <= '9') hasDigit = true;
            else if (specialChars.includes(char)) hasSpecial = true;
        }

        if (hasLowercase) score++;
        if (hasUppercase) score++;
        if (hasDigit) score++;
        if (hasSpecial) score++;
        
        return Math.min(score, 5); 
    }

    updatePasswordStrength(strengthBar, strengthText, score) {
        const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const strengthClasses = ['', 'weak', 'fair', 'good', 'strong', 'strong']; 
        
        let displayScore = Math.floor(score); 
        if (score === 0 && document.getElementById('password').value.length > 0) displayScore = 1; 
        else if (score === 0) displayScore = 0; 
        else displayScore = Math.max(1, Math.min(Math.ceil(score), 5)); 


        strengthBar.className = 'strength-fill'; 
        if (displayScore > 0 && displayScore <= strengthClasses.length) {
             strengthBar.classList.add(strengthClasses[displayScore-1]);
        } else if (displayScore === 0 && document.getElementById('password').value === "") {
             strengthBar.classList.remove(...strengthClasses.filter(Boolean)); 
        }

        strengthText.textContent = (displayScore > 0 && document.getElementById('password').value.length > 0) ? `Password strength: ${strengthLevels[displayScore-1]}` : 'Password strength';
         if (document.getElementById('password').value === "") {
            strengthText.textContent = 'Password strength';
            strengthBar.className = 'strength-fill'; 
        }
    }

    togglePasswordVisibility(field, toggle) {
        const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
        field.setAttribute('type', type);
        if (toggle.querySelector('.eye-icon')) {
            toggle.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
        }
    }

    validateField(element, errorElement, validator) {
        const error = validator(element.value);
        
        if (error) {
            this.showError(errorElement, error);
            element.classList.add('error');
            element.classList.remove('success');
            return false;
        } else {
            this.clearError(errorElement);
            element.classList.remove('error');
            if (element.value.trim() !== "") {
                 element.classList.add('success');
            } else {
                 element.classList.remove('success');
            }
            return true;
        }
    }

    validateForm() {
        let isValid = true;
        
        const fields = [
            { id: 'firstName', errorId: 'firstNameError', validator: this.validateName.bind(this) },
            { id: 'lastName', errorId: 'lastNameError', validator: this.validateName.bind(this) },
            { id: 'email', errorId: 'emailError', validator: this.validateEmail.bind(this) },
            { id: 'phone', errorId: 'phoneError', validator: this.validatePhone.bind(this) },
            { id: 'username', errorId: 'usernameError', validator: this.validateUsername.bind(this) },
            { id: 'dateOfBirth', errorId: 'dateOfBirthError', validator: this.validateDateOfBirth.bind(this) }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            const errorElement = document.getElementById(field.errorId);
            if(element && errorElement) {
                if (!this.validateField(element, errorElement, field.validator)) isValid = false;
            }
        });
        
        if (!this.validatePassword()) isValid = false;
        if (!this.validatePasswordMatch()) isValid = false;
        
        const termsCheckbox = document.getElementById('termsAccepted');
        const termsError = document.getElementById('termsError');
        if (termsCheckbox && termsError && !termsCheckbox.checked) {
            this.showError(termsError, 'You must accept the terms and conditions');
            isValid = false;
        } else if (termsError) {
             this.clearError(termsError);
        }
        
        return isValid;
    }

    showError(errorElement, message) {
        if(errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearError(errorElement) {
         if(errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    submitForm() {
        this.submitBtn.disabled = true;
        this.submitBtn.classList.add('loading');
        const btnText = this.submitBtn.querySelector('.btn-text');
        if(btnText) btnText.textContent = 'Creating Account...';

        setTimeout(() => {
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('loading');
            if(btnText) btnText.textContent = 'Create Account';
            
            this.showSuccessPopup("Your account has been created successfully.");
            this.form.reset(); 
            document.querySelectorAll('.form-input.success').forEach(el => el.classList.remove('success'));

            const strengthBar = document.querySelector('#passwordStrength .strength-fill');
            const strengthText = document.querySelector('#passwordStrength .strength-text');
            if (strengthBar && strengthText) {
                this.updatePasswordStrength(strengthBar, strengthText, 0);
                 strengthText.textContent = 'Password strength';
                 strengthBar.className = 'strength-fill'; 
            }
        }, 2000);
    }

    showSuccessPopup(message = "Your account has been created successfully.") {
        if (!this.popup || !this.countdown) return;
        
        const popupMessageEl = this.popup.querySelector('.popup-message');
        if(popupMessageEl) popupMessageEl.textContent = message;

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

    addCheckboxAnimation(checkbox) { 
      const checkmark = checkbox.nextElementSibling; 
      if(checkmark && checkmark.classList.contains('checkmark')) {
        checkmark.style.transform = 'scale(1.2)';
        setTimeout(() => {
            checkmark.style.transform = 'scale(1)';
        }, 150);
      }
    }
    addClickAnimation(element) { 
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
    addShakeAnimation(element) {
        if (element) { 
            element.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new SignUpValidator();
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            try {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch (error) {
                console.error("Error finding target for smooth scroll:", targetId, error);
            }
        });
    });

    const tagline = document.querySelector('.brand-tagline');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 70);
            }
        };
        setTimeout(typeWriter, 800);
    }
});