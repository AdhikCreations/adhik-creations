class PortfolioCarousel {
    constructor(media, containerId, isModal = false) {
        this.media = media; // Changed from images to media
        this.currentIndex = 0;
        this.container = document.getElementById(containerId);
        this.isModal = isModal;
    }

    createCarousel() {
        const firstItem = this.media[0];
        const mediaClass = this.isModal ? 'modal-media' : 'grid-media';
        
        return `
            <div class="carousel">
                <div class="carousel-inner">
                    ${this.createMediaElement(firstItem, mediaClass)}
                </div>
                <button class="carousel-control prev" aria-label="Previous">
                    <span class="material-symbols-outlined">chevron_left</span>
                </button>
                <button class="carousel-control next" aria-label="Next">
                    <span class="material-symbols-outlined">chevron_right</span>
                </button>
                <div class="carousel-indicators">
                    ${this.media.map((_, index) => 
                        `<button class="indicator${index === 0 ? ' active' : ''}" 
                         aria-label="Go to item ${index + 1}"
                         aria-current="${index === 0 ? 'true' : 'false'}"></button>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    createMediaElement(mediaItem, className) {
        if (mediaItem.type === 'video') {
            return `<div class="video-thumbnail ${className}" data-video-src="${mediaItem.src}">
                <img src="${mediaItem.thumbnail}" alt="Video thumbnail">
                <span class="play-button">▶</span>
            </div>`;
        }
        return `<img src="${mediaItem.src}" alt="Portfolio Image" class="${className}">`;
    }

    attachListeners() {
        const carousel = this.container.querySelector('.carousel');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const indicators = carousel.querySelectorAll('.indicator');

        // Remove any existing listeners first
        const newPrev = prevBtn.cloneNode(true);
        const newNext = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrev, prevBtn);
        nextBtn.parentNode.replaceChild(newNext, nextBtn);

        // Attach new listeners
        newPrev.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent modal from opening
            this.navigate('prev');
        });
        
        newNext.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent modal from opening
            this.navigate('next');
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal from opening
                this.goToSlide(index);
            });
        });

        // Add click handler for opening modal if not already in modal
        if (!this.isModal) {
            const mediaElement = carousel.querySelector('.carousel-inner');
            mediaElement.addEventListener('click', () => {
                this.openModal();
            });
        }

        // Add keyboard navigation
        if (this.isModal) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.navigate('prev');
                } else if (e.key === 'ArrowRight') {
                    this.navigate('next');
                }
            });
        }

        // Add swipe support for touch devices
        let touchStartX = 0;
        carousel.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
        carousel.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                this.navigate(diff > 0 ? 'next' : 'prev');
            }
        });
    }

    stopAllVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }

    closeModal() {
        const modal = document.getElementById('portfolio-modal');
        const modalCarouselContainer = document.getElementById('modal-carousel');
        const modalVideo = document.getElementById('modal-video-container');
        const video = document.getElementById('modal-video');
        
        // Clean up video element completely
        if (video) {
            // Remove all event listeners by cloning and replacing
            const newVideo = video.cloneNode(false);
            video.parentNode.replaceChild(newVideo, video);
            
            // Clear source and load to stop any buffering
            newVideo.removeAttribute('src');
            newVideo.load();
        }

        // Clean up video controls
        this.cleanupVideoControls();

        // Hide containers
        modalVideo.style.display = 'none';
        modalCarouselContainer.innerHTML = '';
        modal.classList.remove('open');
    }

    cleanupVideoControls() {
        const playPauseBtn = document.querySelector('.play-pause');
        const muteBtn = document.querySelector('.mute-btn');
        const seekBar = document.querySelector('.seek-bar');
        const volumeBar = document.querySelector('.volume-bar');

        // Remove event listeners by cloning and replacing
        if (playPauseBtn) {
            const newPlayPauseBtn = playPauseBtn.cloneNode(true);
            playPauseBtn.parentNode.replaceChild(newPlayPauseBtn, playPauseBtn);
        }
        if (muteBtn) {
            const newMuteBtn = muteBtn.cloneNode(true);
            muteBtn.parentNode.replaceChild(newMuteBtn, muteBtn);
        }
        if (seekBar) {
            const newSeekBar = seekBar.cloneNode(true);
            seekBar.parentNode.replaceChild(newSeekBar, seekBar);
        }
        if (volumeBar) {
            const newVolumeBar = volumeBar.cloneNode(true);
            volumeBar.parentNode.replaceChild(newVolumeBar, volumeBar);
        }
    }

    openModal() {
        this.stopAllVideos();
        const modal = document.getElementById('portfolio-modal');
        const modalCarouselContainer = document.getElementById('modal-carousel');
        const modalVideo = document.getElementById('modal-video-container');
        
        modalVideo.style.display = 'none';
        modalCarouselContainer.style.display = 'block';
        
        const modalCarousel = new PortfolioCarousel(this.media, 'modal-carousel', true);
        modalCarouselContainer.innerHTML = modalCarousel.createCarousel();
        modalCarousel.currentIndex = this.currentIndex;
        modalCarousel.updateCarousel();
        
        modal.classList.add('open');
        
        // Setup modal-specific controls
        this.setupModalControls(modal, modalCarousel);
    }

    setupModalControls(modal, modalCarousel) {
        // Clear any existing listeners
        const prevBtn = modal.querySelector('.modal-carousel-control.prev');
        const nextBtn = modal.querySelector('.modal-carousel-control.next');
        const closeBtn = modal.querySelector('.modal-close');
        
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        const newCloseBtn = closeBtn.cloneNode(true);
        
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

        // Add modal-specific navigation
        newPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            modalCarousel.navigate('prev');
        });

        newNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            modalCarousel.navigate('next');
        });

        newCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeModal();
        });

        // Add escape key listener
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    navigate(direction) {
        this.stopAllVideos();
        this.currentIndex = direction === 'next' 
            ? (this.currentIndex + 1) % this.media.length
            : (this.currentIndex - 1 + this.media.length) % this.media.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.stopAllVideos();
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        this.stopAllVideos();
        const carousel = this.container.querySelector('.carousel');
        const carouselInner = carousel.querySelector('.carousel-inner');
        const currentItem = this.media[this.currentIndex];
        const mediaClass = this.isModal ? 'modal-media' : 'grid-media';
        
        // Handle modal view
        if (this.isModal) {
            const modalVideo = document.getElementById('modal-video-container');
            const modalCarousel = document.getElementById('modal-carousel');
            
            // Reset both containers first
            modalVideo.style.display = 'none';
            modalCarousel.style.display = 'block';
            
            if (currentItem.type === 'video') {
                modalVideo.style.display = 'flex';
                modalCarousel.style.display = 'none';
                const video = document.getElementById('modal-video');
                video.src = currentItem.src;
                video.load(); // Ensure video is loaded
                setTimeout(() => this.setupVideoControls(), 100);
            } else {
                carouselInner.innerHTML = this.createMediaElement(currentItem, mediaClass);
            }
        } else {
            // Normal view
            carouselInner.innerHTML = this.createMediaElement(currentItem, mediaClass);
        }

        // Update indicators
        const indicators = carousel.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });

        // Update video thumbnail click handlers if needed
        if (currentItem.type === 'video' && !this.isModal) {
            const thumbnail = carouselInner.querySelector('.video-thumbnail');
            if (thumbnail) {
                thumbnail.addEventListener('click', () => {
                    this.openModal();
                });
            }
        }
    }

    setupVideoControls() {
        // First cleanup any existing video controls
        this.cleanupVideoControls();

        let video = document.getElementById('modal-video');  // Changed from const to let
        const playPauseBtn = document.querySelector('.play-pause');
        const muteBtn = document.querySelector('.mute-btn');
        const seekBar = document.querySelector('.seek-bar');
        const volumeBar = document.querySelector('.volume-bar');
        const progressBar = document.querySelector('.progress-bar');

        if (!video || !playPauseBtn || !muteBtn || !seekBar || !volumeBar || !progressBar) {
            console.error('Video controls not found');
            return;
        }

        // Reset video controls state and clone video element
        video = video.cloneNode(true);
        const oldVideo = document.getElementById('modal-video');
        oldVideo.parentNode.replaceChild(video, oldVideo);
        
        // Update initial volume to match CSS custom properties
        video.volume = 0.05;
        volumeBar.value = 50;

        // Add transition class for smooth animations
        playPauseBtn.classList.add('transition');
        muteBtn.classList.add('transition');

        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';

        // Play/Pause
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        // Mute
        muteBtn.addEventListener('click', () => {
            if (video.muted) {
                video.muted = false;
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                volumeBar.value = video.volume * 100;
            } else {
                video.muted = true;
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                volumeBar.value = 0;
            }
        });

        // Volume
        volumeBar.addEventListener('input', () => {
            const volume = volumeBar.value / 100;
            video.volume = volume;
            if (volume === 0) {
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                video.muted = true;
            } else {
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                video.muted = false;
            }
        });

        // Seek bar
        video.addEventListener('loadedmetadata', () => {
            seekBar.max = video.duration;
        });

        video.addEventListener('timeupdate', () => {
            seekBar.value = video.currentTime;
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${progress}%`;  // Fixed missing quote and semicolon
        });

        seekBar.addEventListener('input', () => {
            video.currentTime = seekBar.value;
        });
    }
}

// Service mapping for portfolio items
const serviceMapping = {
    "kondapalli": "Décor Rentals",
    "krishna": "Décor Rentals",
    "crafted": "Event Management",
    "nature": "Event Management",
    "jutebag": "Return Gifts",
    "ganesh": "Return Gifts"
};

// Updated portfolio data structure with videos
const portfolioData = {
    portfolios: [
        {
            folder: "kondapalli",
            title: "Kondapalli Collection",
            media: [
                { type: 'image', src: "assets/images/portfolio/kondapalli/image1.jpg" },
                { type: 'image', src: "assets/images/portfolio/kondapalli/image2.jpg" },
                { type: 'image', src: "assets/images/portfolio/kondapalli/image3.jpg" },
                { type: 'image', src: "assets/images/portfolio/kondapalli/image4.jpg" },
                { type: 'image', src: "assets/images/portfolio/kondapalli/image5.jpg" },
                { type: 'image', src: "assets/images/portfolio/kondapalli/image6.jpg" },
                { type: 'image', src: "assets/images/portfolio/kondapalli/image7.jpg" },
                { type: 'image', src: "assets/images/portfolio/kondapalli/image8.jpg" },
                { type: 'image', src: "assets/images/portfolio/kondapalli/image9.jpg" },
                { type: 'image', src: "assets/images/portfolio/kondapalli/image10.jpg" }
            ]
        },
        {
            folder: "krishna",
            title: "Krishna Collection",
            media: [
                { type: 'image', src: "assets/images/portfolio/krishna/image1.jpg" }
            ]
        },
        {
            folder: "crafted",
            title: "Crafted Collection",
            media: [
                { type: 'image', src: "assets/images/portfolio/crafted/image1.jpg" },
                { type: 'image', src: "assets/images/portfolio/crafted/image2.jpg" },
                { type: 'image', src: "assets/images/portfolio/crafted/image3.jpg" },
                { type: 'image', src: "assets/images/portfolio/crafted/image4.jpg" },
                { type: 'image', src: "assets/images/portfolio/crafted/image5.jpg" },
                { type: 'image', src: "assets/images/portfolio/crafted/image6.jpg" },
                { type: 'image', src: "assets/images/portfolio/crafted/image7.jpg" }
            ]
        },
        {
            folder: "nature",
            title: "Nature Collection",
            media: [
                { type: 'image', src: "assets/images/portfolio/nature/image1.jpg" },
                { type: 'image', src: "assets/images/portfolio/nature/image2.jpg" }
            ]
        },
        {
            folder: "jutebag",
            title: "Jute Bag Collection",
            media: [
                {   type: 'video',
                    src: "assets/images/portfolio/jutebag/video1.mp4",
                    thumbnail: "assets/images/portfolio/jutebag/video1-thumb.jpg"
                }
            ]
        }
        ,
        {
            folder: "ganesh",
            title: "Lord Ganesha Collection",
            media: [
                {   type: 'video',
                    src: "assets/images/portfolio/ganesh/video1.mp4",
                    thumbnail: "assets/images/portfolio/ganesh/video1-thumb.jpg"
                },
                {   type: 'video',
                    src: "assets/images/portfolio/ganesh/video2.mp4",
                    thumbnail: "assets/images/portfolio/ganesh/video2-thumb.jpg"
                },
                { type: 'image', src: "assets/images/portfolio/ganesh/image1.jpg" },
                { type: 'image', src: "assets/images/portfolio/ganesh/image2.jpg" }
            ]
        }
    ]
};

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function filterPortfolios(service) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    portfolioGrid.innerHTML = ''; // Clear current items
    
    portfolioData.portfolios.forEach((portfolio, index) => {
        // Skip if service filter is active and doesn't match
        if (service !== 'all' && serviceMapping[portfolio.folder] !== service) {
            return;
        }
        
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.id = `portfolio-${index}`;
        
        portfolioItem.innerHTML = `
            <h3>${portfolio.title}</h3>
            <div id="carousel-${index}"></div>
            <p>${portfolio.title}</p>
        `;
        
        portfolioGrid.appendChild(portfolioItem);
        
        const carousel = new PortfolioCarousel(portfolio.media, `portfolio-${index}`);
        const carouselContainer = document.getElementById(`carousel-${index}`);
        carouselContainer.innerHTML = carousel.createCarousel();
        carousel.attachListeners();
    });
}
function loadPortfolios() {
    // Get service from URL parameter
    const urlService = getQueryParam('service') || 'all';
    
    // Set the filter dropdown value
    const serviceFilter = document.getElementById('service-filter');
    serviceFilter.value = urlService;
    
    // Add event listener for filter
    const filter = document.getElementById('service-filter');
    filter.addEventListener('change', (e) => {
        filterPortfolios(e.target.value);
    });
    
    try {
        // Apply filter based on URL parameter
        filterPortfolios(urlService);
    } catch (error) {
        console.error('Error loading portfolios:', error);
        const portfolioGrid = document.getElementById('portfolio-grid');
        portfolioGrid.innerHTML = `
            <div class="error-message">
                <p>Unable to load portfolio images. Please try again later.</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadPortfolios);
