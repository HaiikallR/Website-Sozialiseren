document.addEventListener('DOMContentLoaded', () => {
    const sliderWrapper = document.querySelector('.custom-slider-wrapper');
    const sliderTrack = document.querySelector('.custom-slider-track');
    const cards = Array.from(document.querySelectorAll('.custom-card'));
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    if (!sliderWrapper || !sliderTrack || cards.length === 0 || !prevButton || !nextButton) {
        console.error('One or more slider elements not found.');
        return;
    }

    let currentMiddleIndex = 1; // Index of the visually middle card
    let cardWidthWithMargin = 0; // Calculated dynamically
    let animationFrameId;
    let autoplayInterval; // Variabel untuk menyimpan ID interval autoplay

    const AUTOPLAY_DELAY = 1000; // 1 detik = 1000 milidetik

    const getCardWidthWithMargin = () => {
        if (cards.length === 0) return 0;
        const firstCard = cards[0];
        const computedStyle = getComputedStyle(firstCard);
        const marginLeft = parseFloat(computedStyle.marginLeft);
        const marginRight = parseFloat(computedStyle.marginRight);
        return firstCard.offsetWidth + marginLeft + marginRight;
    };

    const applyCardTransforms = () => {
        cards.forEach((card, index) => {
            // Hapus semua kelas posisi terlebih dahulu
            card.classList.remove('is-left', 'is-middle', 'is-right');
            card.style.transform = ''; // Reset transform to default
            card.style.filter = ''; // Reset filter
            card.style.zIndex = '1'; // Reset z-index

            if (window.innerWidth > 767) { // Hanya terapkan efek miring di desktop/tablet
                if (index === currentMiddleIndex) {
                    card.classList.add('is-middle');
                } else if (index === currentMiddleIndex - 1) {
                    card.classList.add('is-left');
                } else if (index === currentMiddleIndex + 1) {
                    card.classList.add('is-right');
                }
                // Jika ada lebih dari 3 kartu, kartu yang jauh harus tetap normal atau tidak terlihat
                // Kartu di luar lingkup 3 utama tidak diberi kelas is-left/is-right/is-middle
            }
            // Di mobile, kelas-kelas ini tidak ditambahkan, dan CSS media query akan menangani transform.
        });
    };

    const updateSlider = () => {
        cardWidthWithMargin = getCardWidthWithMargin();

        // Batasan indeks untuk slider
        if (window.innerWidth > 767) { // Desktop/Tablet (minimal 3 kartu untuk efek)
            if (currentMiddleIndex < 1) { // Kartu tengah tidak bisa menjadi kartu pertama
                currentMiddleIndex = 1;
            } else if (currentMiddleIndex > cards.length - 2) { // Kartu tengah tidak bisa menjadi kartu terakhir
                currentMiddleIndex = cards.length - 2;
            }
        } else { // Mobile (minimal 1 kartu)
            if (currentMiddleIndex < 0) {
                currentMiddleIndex = 0;
            } else if (currentMiddleIndex >= cards.length) {
                currentMiddleIndex = cards.length - 1;
            }
        }

        applyCardTransforms(); // Terapkan transformasi untuk kartu

        // Hitung posisi scroll
        let targetScrollLeft;
        if (window.innerWidth > 767) { // Desktop/Tablet centering
            const middleCard = cards[currentMiddleIndex];
            if (middleCard) {
                const cardBeforeMiddle = cards[currentMiddleIndex - 1];
                if (cardBeforeMiddle) {
                    const cardBeforeMiddleOffset = cardBeforeMiddle.offsetLeft;
                    targetScrollLeft = cardBeforeMiddleOffset - (sliderWrapper.offsetWidth - (cardWidthWithMargin * 3)) / 2;
                } else {
                    targetScrollLeft = 0;
                }
            } else {
                targetScrollLeft = 0;
            }
        } else { // Mobile (standard one-card scroll)
            targetScrollLeft = currentMiddleIndex * cardWidthWithMargin;
        }

        // Animasi scroll menggunakan requestAnimationFrame
        cancelAnimationFrame(animationFrameId);
        const startScroll = sliderWrapper.scrollLeft;
        const distance = targetScrollLeft - startScroll;
        let startTime = null;

        const animateScroll = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = (currentTime - startTime) / 600; // 600ms duration for smoother "page turn"
            const amount = distance * Math.easeOutQuad(progress); // Use easeOutQuad for smooth effect
            sliderWrapper.scrollLeft = startScroll + amount;

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animateScroll);
            }
        };
        requestAnimationFrame(animateScroll);

        if (!Math.easeOutQuad) {
            Math.easeOutQuad = (t) => t * (2 - t);
        }

        updateButtonStates();
    };

    const moveToNextSlide = () => {
        // Logika untuk maju ke slide berikutnya
        // Jika sudah di akhir, kembali ke awal
        let maxIndex;
        if (window.innerWidth > 767) {
            maxIndex = cards.length - 2; // Untuk 3 kartu, index kartu tengah maksimal
        } else {
            maxIndex = cards.length - 1; // Untuk 1 kartu, index kartu terakhir
        }

        if (currentMiddleIndex >= maxIndex) {
            // Kembali ke awal (kartu kedua untuk desktop, kartu pertama untuk mobile)
            currentMiddleIndex = (window.innerWidth > 767) ? 1 : 0;
        } else {
            currentMiddleIndex++;
        }
        updateSlider();
    };

    // Fungsi untuk memulai autoplay
    const startAutoplay = () => {
        stopAutoplay(); // Pastikan tidak ada interval yang berjalan ganda
        autoplayInterval = setInterval(moveToNextSlide, AUTOPLAY_DELAY);
    };

    // Fungsi untuk menghentikan autoplay
    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    const updateButtonStates = () => {
        if (window.innerWidth > 767) {
            prevButton.disabled = currentMiddleIndex <= 1;
            nextButton.disabled = currentMiddleIndex >= cards.length - 2;
        } else {
            prevButton.disabled = currentMiddleIndex === 0;
            nextButton.disabled = currentMiddleIndex >= cards.length - 1;
        }
    };

    // Event Listeners for Buttons
    prevButton.addEventListener('click', () => {
        stopAutoplay(); // Hentikan autoplay saat ada interaksi manual
        currentMiddleIndex--;
        updateSlider();
        startAutoplay(); // Mulai lagi autoplay setelah interaksi
    });

    nextButton.addEventListener('click', () => {
        stopAutoplay(); // Hentikan autoplay saat ada interaksi manual
        currentMiddleIndex++;
        updateSlider();
        startAutoplay(); // Mulai lagi autoplay setelah interaksi
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        stopAutoplay(); // Hentikan autoplay saat resize
        cardWidthWithMargin = getCardWidthWithMargin();

        if (window.innerWidth > 767) {
            if (currentMiddleIndex < 1) currentMiddleIndex = 1;
            if (currentMiddleIndex > cards.length - 2) currentMiddleIndex = cards.length - 2;
        } else {
            if (currentMiddleIndex < 0) currentMiddleIndex = 0;
            if (currentMiddleIndex >= cards.length) currentMiddleIndex = cards.length - 1;
        }
        updateSlider();
        startAutoplay(); // Mulai lagi autoplay setelah resize selesai
    });

    // Optional: Hentikan autoplay saat mouse masuk ke slider dan mulai lagi saat mouse keluar
    sliderWrapper.addEventListener('mouseenter', stopAutoplay);
    sliderWrapper.addEventListener('mouseleave', startAutoplay);
    // Juga pada tombol navigasi
    prevButton.addEventListener('mouseenter', stopAutoplay);
    prevButton.addEventListener('mouseleave', startAutoplay);
    nextButton.addEventListener('mouseenter', stopAutoplay);
    nextButton.addEventListener('mouseleave', startAutoplay);


    // Initial setup
    cardWidthWithMargin = getCardWidthWithMargin();
    updateSlider(); // Set posisi awal
    startAutoplay(); // Mulai autoplay saat halaman dimuat
});