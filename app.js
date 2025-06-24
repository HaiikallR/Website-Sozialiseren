let nextButton = document.getElementById('next');
let prevButton = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let listHTML = document.querySelector('.carousel .list');
let seeMoreButtons = document.querySelectorAll('.seeMore');
let backButton = document.getElementById('back');

console.log("Script dimuat!");

nextButton.onclick = function(){
    showSlider('next');
}
prevButton.onclick = function(){
    showSlider('prev');
}
let unAcceppClick;
const showSlider = (type) => {
    nextButton.style.pointerEvents = 'none';
    prevButton.style.pointerEvents = 'none';

    carousel.classList.remove('next', 'prev');
    let items = document.querySelectorAll('.carousel .list .item');
    if(type === 'next'){
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    }else{
        listHTML.prepend(items[items.length - 1]);
        carousel.classList.add('prev');
    }
    clearTimeout(unAcceppClick);
    unAcceppClick = setTimeout(()=>{
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000)
}
seeMoreButtons.forEach((button) => {
    button.onclick = function(){
        carousel.classList.remove('next', 'prev');
        carousel.classList.add('showDetail');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById   ('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', function() {
        // Toggle class 'active' pada ikon hamburger untuk animasi 'X'
        hamburger.classList.toggle('active');
        // Toggle class 'active' pada menu navigasi untuk menampilkan/menyembunyikan
        navMenu.classList.toggle('active');
    });

    // Opsional: Sembunyikan menu saat link di dalamnya diklik (untuk single-page app)
    navMenu.querySelectorAll('li a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) { // Hanya berlaku di mobile
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const aboutCard = document.querySelector('.About-card'); // Mendapatkan elemen About-card

    if (!aboutCard) { // Jika elemen tidak ditemukan, hentikan eksekusi
        console.error("Elemen '.About-card' tidak ditemukan.");
        return;
    }

    // Opsi untuk Intersection Observer
    const options = {
        root: null, // Menggunakan viewport sebagai root
        rootMargin: '0px', // Tanpa margin tambahan
        threshold: 0.5 // Memicu ketika 50% dari elemen terlihat di viewport
    };

    // Callback function yang akan dijalankan saat elemen masuk/keluar viewport
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Jika elemen masuk viewport
                entry.target.classList.add('active-scrolled');
                // Opsional: Hentikan observasi setelah elemen terlihat agar tidak terus-menerus dianimasikan
                observer.unobserve(entry.target);
            } else {
                // Opsional: Jika ingin elemen bisa 'sembunyi' lagi saat discroll menjauh
                // entry.target.classList.remove('active-scrolled');
            }
        });
    }, options);

    // Mulai mengamati elemen About-card
    observer.observe(aboutCard);
});

        const cardWrapper = document.getElementById('cardWrapper');
        // Sesuaikan dengan lebar kartu + gap. Ini hanya relevan untuk tampilan slider.
        const cardWidth = 300;
        const gap = 20;

        function scrollCards(direction) {
            const totalCardWidth = cardWidth + gap;
            if (direction === 'left') {
                cardWrapper.scrollLeft -= totalCardWidth;
            } else if (direction === 'right') {
                cardWrapper.scrollLeft += totalCardWidth;
            }
        }
document.addEventListener('DOMContentLoaded', () => {
    const sliderWrapper = document.querySelector('.custom-slider-wrapper');
    const sliderTrack = document.querySelector('.custom-slider-track');
    const cards = Array.from(document.querySelectorAll('.custom-card')); // Convert NodeList to Array
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    if (!sliderWrapper || !sliderTrack || cards.length === 0 || !prevButton || !nextButton) {
        console.error('One or more slider elements not found.');
        return;
    }

    let currentMiddleIndex = 1; // Index of the middle card (0-indexed)
    let cardWidthWithMargin = 0; // Calculated dynamically
    let animationFrameId; // For smooth scrolling via requestAnimationFrame

    const getCardWidthWithMargin = () => {
        if (cards.length === 0) return 0;
        const firstCard = cards[0];
        const computedStyle = getComputedStyle(firstCard);
        const marginLeft = parseFloat(computedStyle.marginLeft);
        const marginRight = parseFloat(computedStyle.marginRight);
        return firstCard.offsetWidth + marginLeft + marginRight;
    };

    const updateSlider = () => {
        // Remove 'is-middle' class from all cards
        cards.forEach(card => card.classList.remove('is-middle'));

        // Determine which card should be middle based on screen size
        if (window.innerWidth > 767) { // Desktop/Tablet logic (3 cards, middle emphasized)
            // Ensure currentMiddleIndex is within bounds for desktop 3-card view
            if (currentMiddleIndex < 1) { // Prevents going too far left
                currentMiddleIndex = 1;
            } else if (currentMiddleIndex > cards.length - 2) { // Prevents going too far right
                currentMiddleIndex = cards.length - 2;
            }

            // Add 'is-middle' class to the card at currentMiddleIndex
            if (cards[currentMiddleIndex]) {
                cards[currentMiddleIndex].classList.add('is-middle');
            }

            // Calculate scroll position to center the middle card
            // This needs to account for the wider middle card and its margins
            const middleCard = cards[currentMiddleIndex];
            if (middleCard) {
                const middleCardOffset = middleCard.offsetLeft;
                const containerWidth = sliderWrapper.offsetWidth;
                const scrollOffset = middleCardOffset - (containerWidth / 2) + (middleCard.offsetWidth / 2);
                
                // Smooth scroll using requestAnimationFrame
                cancelAnimationFrame(animationFrameId);
                const startScroll = sliderWrapper.scrollLeft;
                const distance = scrollOffset - startScroll;
                let startTime = null;

                const animateScroll = (currentTime) => {
                    if (!startTime) startTime = currentTime;
                    const progress = (currentTime - startTime) / 300; // 300ms duration
                    const amount = distance * Math.easeOutQuad(progress); // Use easeOutQuad for smooth effect
                    sliderWrapper.scrollLeft = startScroll + amount;

                    if (progress < 1) {
                        animationFrameId = requestAnimationFrame(animateScroll);
                    }
                };
                requestAnimationFrame(animateScroll);

                // Define easeOutQuad function
                if (!Math.easeOutQuad) {
                    Math.easeOutQuad = (t) => t * (2 - t);
                }

            }
        } else { // Mobile logic (1 card, standard slider)
            // Ensure currentMiddleIndex is within bounds for mobile 1-card view
            if (currentMiddleIndex < 0) {
                currentMiddleIndex = 0;
            } else if (currentMiddleIndex >= cards.length) {
                currentMiddleIndex = cards.length - 1;
            }

            const targetScrollLeft = currentMiddleIndex * getCardWidthWithMargin();
            sliderWrapper.scrollLeft = targetScrollLeft; // Direct scroll for simplicity on mobile

            // Optional: If you want to scale mobile cards slightly based on focus, add logic here.
            // For now, mobile cards stay at scale 1.
        }

        updateButtonStates();
    };

    const updateButtonStates = () => {
        if (window.innerWidth > 767) { // Desktop/Tablet logic
            prevButton.disabled = currentMiddleIndex <= 1;
            nextButton.disabled = currentMiddleIndex >= cards.length - 2;
        } else { // Mobile logic
            prevButton.disabled = currentMiddleIndex === 0;
            nextButton.disabled = currentMiddleIndex >= cards.length - 1;
        }
    };

    // Event Listeners for Buttons
    prevButton.addEventListener('click', () => {
        currentMiddleIndex--;
        updateSlider();
    });

    nextButton.addEventListener('click', () => {
        currentMiddleIndex++;
        updateSlider();
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        // Recalculate card dimensions on resize
        cardWidthWithMargin = getCardWidthWithMargin();
        
        // Adjust currentMiddleIndex if needed after resize,
        // e.g., if it was at the end on mobile and now it's too far for desktop.
        if (window.innerWidth > 767 && currentMiddleIndex < 1) {
             currentMiddleIndex = 1;
        } else if (window.innerWidth <= 767 && currentMiddleIndex >= cards.length) {
            currentMiddleIndex = cards.length - 1;
        }

        updateSlider();
    });

    // Initial setup
    cardWidthWithMargin = getCardWidthWithMargin();
    updateSlider(); // Call once on load to set initial state

    // Optional: Add drag functionality (requires more complex logic for smooth dragging and snapping)
    // For now, we rely on buttons.
});