document.addEventListener('DOMContentLoaded', function() {
    // Tool Button Alert Functionality (Removed as tools now link to dedicated pages)

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const categoryLink = document.querySelector('.dropbtn');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Handle Category link behavior
    if (categoryLink) {
        categoryLink.addEventListener('click', function(e) {
            if (window.innerWidth <= 767) { // If on mobile
                // Allow default link behavior to categories.html
            } else { // If on desktop
                e.preventDefault(); // Prevent default link behavior for desktop hover dropdown
                // Desktop hover is handled by CSS, no JS needed to show/hide dropdown
            }
        });
    }

    // Smooth Scrolling for Navigation Links (only for internal links on index.html)
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the link is an internal anchor link and not the category link
            if (this.getAttribute('href').startsWith('#') && !this.classList.contains('dropbtn')) {
                e.preventDefault();

                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - document.querySelector('header').offsetHeight, // Adjust for fixed header
                        behavior: 'smooth'
                    });
                }
            }

            // Close mobile nav after clicking a link
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // Active Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('.tools-section');
    const navLi = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - document.querySelector('header').offsetHeight;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(li => {
            li.classList.remove('active');
            // Only highlight if it's not the category link and matches an ID
            if (li.getAttribute('href').startsWith('#') && li.getAttribute('href').substring(1) === current) {
                li.classList.add('active');
            }
        });
    });
});

// Age Calculator Functionality
function calculateAge() {
    const birthDateInput = document.getElementById('dobInput');
    const birthDateValue = birthDateInput.value;

    if (!birthDateValue) {
        document.getElementById('ageResult').innerHTML = "<p>Please select your date of birth.</p>";
        return;
    }

    const birthDate = new Date(birthDateValue);
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    // Calculate total time in milliseconds for more precise units
    const diffMilliseconds = now - birthDate;
    const totalSeconds = Math.floor(diffMilliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    const remainingDays = totalDays % 7;
    const remainingHours = totalHours % 24;
    const remainingMinutes = totalMinutes % 60;
    const remainingSeconds = totalSeconds % 60;

    // Update result display
    document.getElementById('ageResult').innerHTML = `
        <p>Your Age:</p>
        <p><b>${years}</b> years . <b>${months}</b> months . <b>${days}</b> days</p>
        <p>Or</p>
        <p><b>${totalWeeks}</b> weeks . <b>${remainingDays}</b> days</p>
        <p><b>${remainingHours}</b> hours . <b>${remainingMinutes}</b> minutes . <b>${remainingSeconds}</b> seconds</p>
    `;
}

// Live update every second
let ageCalculatorInterval;

document.addEventListener('DOMContentLoaded', () => {
    const birthDateInput = document.getElementById('dobInput');
    const calculateBtn = document.getElementById('calculateBtn');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            // Clear previous interval if any
            if (ageCalculatorInterval) {
                clearInterval(ageCalculatorInterval);
            }
            calculateAge(); // Initial calculation
            ageCalculatorInterval = setInterval(calculateAge, 1000); // Start live update
        });
    }

    // Clear interval if birthdate input is cleared
    if (birthDateInput) {
        birthDateInput.addEventListener('change', () => {
            if (!birthDateInput.value && ageCalculatorInterval) {
                clearInterval(ageCalculatorInterval);
                document.getElementById('ageResult').innerHTML = "<p>Your age will appear here.</p>";
            }
        });
    }
});

// Currency Converter Functionality (Pure JavaScript with hardcoded rates)
const exchangeRates = {
    USD: { EUR: 0.92, GBP: 0.79, JPY: 156.80, CAD: 1.37, AUD: 1.51, INR: 83.50, USD: 1 },
    EUR: { USD: 1.08, GBP: 0.86, JPY: 170.00, CAD: 1.48, AUD: 1.63, INR: 90.50, EUR: 1 },
    GBP: { USD: 1.27, EUR: 1.16, JPY: 198.00, CAD: 1.73, AUD: 1.90, INR: 106.00, GBP: 1 },
    JPY: { USD: 0.0064, EUR: 0.0059, GBP: 0.0051, CAD: 0.0087, AUD: 0.0096, INR: 0.53, JPY: 1 },
    CAD: { USD: 0.73, EUR: 0.67, GBP: 0.58, JPY: 115.00, AUD: 1.10, INR: 61.00, CAD: 1 },
    AUD: { USD: 0.66, EUR: 0.61, GBP: 0.53, JPY: 104.00, CAD: 0.91, INR: 55.00, AUD: 1 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0094, JPY: 1.88, CAD: 0.016, AUD: 0.018, INR: 1 }
};

function populateCurrencyDropdowns() {
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');

    // Clear existing options
    fromCurrencySelect.innerHTML = '';
    toCurrencySelect.innerHTML = '';

    const currencies = Object.keys(exchangeRates);

    currencies.forEach(currency => {
        const option1 = document.createElement('option');
        option1.value = currency;
        option1.textContent = currency;
        fromCurrencySelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = currency;
        option2.textContent = currency;
        toCurrencySelect.appendChild(option2);
    });

    // Set default selections
    fromCurrencySelect.value = 'USD';
    toCurrencySelect.value = 'INR';
}

function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const convertedAmountSpan = document.getElementById('convertedAmount');

    if (isNaN(amount) || amount <= 0) {
        convertedAmountSpan.textContent = 'Please enter a valid amount.';
        return;
    }

    if (!exchangeRates[fromCurrency] || !exchangeRates[fromCurrency][toCurrency]) {
        convertedAmountSpan.textContent = 'Conversion not available for selected currencies.';
        return;
    }

    const convertedAmount = amount * exchangeRates[fromCurrency][toCurrency];
    convertedAmountSpan.textContent = convertedAmount.toFixed(2);
}

// Initialize currency converter on page load
document.addEventListener('DOMContentLoaded', () => {
    populateCurrencyDropdowns();
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) {
        convertBtn.addEventListener('click', convertCurrency);
    }
});