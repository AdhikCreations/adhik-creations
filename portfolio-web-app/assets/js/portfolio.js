class PortfolioCarousel {
    constructor(images, containerId, isModal = false) {
        this.images = images;
        this.currentIndex = 0;
        this.container = document.getElementById(containerId);
        this.isModal = isModal;
    }

    createCarousel() {
        const imageClass = this.isModal ? 'modal-image' : 'grid-image';
        return `
            <div class="carousel">
                <div class="carousel-inner">
                    <img src="${this.images[0]}" alt="Portfolio Image" class="${imageClass}">
                </div>
                <button class="carousel-control prev" aria-label="Previous image">❮</button>
                <button class="carousel-control next" aria-label="Next image">❯</button>
                <div class="carousel-indicators">
                    ${this.images.map((_, index) => 
                        `<button class="indicator${index === 0 ? ' active' : ''}" aria-label="Go to slide ${index + 1}"></button>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    attachListeners() {
        const carousel = this.container.querySelector('.carousel');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const indicators = carousel.querySelectorAll('.indicator');
        const image = carousel.querySelector('img');

        prevBtn.addEventListener('click', () => this.navigate('prev'));
        nextBtn.addEventListener('click', () => this.navigate('next'));
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Add click handler for opening modal if not already in modal
        if (!this.isModal) {
            carousel.querySelector('.carousel-inner').addEventListener('click', () => {
                this.openModal();
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

    openModal() {
        const modal = document.getElementById('portfolio-modal');
        const modalCarouselContainer = document.getElementById('modal-carousel');
        
        // Create new carousel instance for modal
        const modalCarousel = new PortfolioCarousel(this.images, 'modal-carousel', true);
        modalCarouselContainer.innerHTML = modalCarousel.createCarousel();
        modalCarousel.currentIndex = this.currentIndex;
        modalCarousel.updateCarousel();
        modalCarousel.attachListeners();

        // Show modal
        modal.classList.add('open');
        
        // Add close button listener
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
            modalCarouselContainer.innerHTML = '';
        });

        // Add escape key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('open');
                modalCarouselContainer.innerHTML = '';
            }
        });
    }

    navigate(direction) {
        this.currentIndex = direction === 'next' 
            ? (this.currentIndex + 1) % this.images.length
            : (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const carousel = this.container.querySelector('.carousel');
        const image = carousel.querySelector('img');
        const indicators = carousel.querySelectorAll('.indicator');
        
        // Force image reload to prevent cached cropped version
        const newImage = new Image();
        newImage.src = this.images[this.currentIndex];
        newImage.className = image.className;
        
        newImage.onload = () => {
            image.parentNode.replaceChild(newImage, image);
        };
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Portfolio data embedded directly to avoid CORS issues
const portfolioData = {
    portfolios: [
        {
            folder: "kondapalli",
            title: "Kondapalli Collection",
            images: [
                "assets/images/portfolio/kondapalli/image1.jpg",
                "assets/images/portfolio/kondapalli/image2.jpg",
                "assets/images/portfolio/kondapalli/image3.jpg",
                "assets/images/portfolio/kondapalli/image4.jpg",
                "assets/images/portfolio/kondapalli/image5.jpg",
                "assets/images/portfolio/kondapalli/image6.jpg",
                "assets/images/portfolio/kondapalli/image7.jpg",
                "assets/images/portfolio/kondapalli/image8.jpg",
                "assets/images/portfolio/kondapalli/image9.jpg",
                "assets/images/portfolio/kondapalli/image10.jpg"
            ]
        },
        {
            folder: "krishna",
            title: "Krishna Collection",
            images: [
                "assets/images/portfolio/krishna/image1.jpg"
            ]
        },
        {
            folder: "crafted",
            title: "Crafted Collection",
            images: [
                "assets/images/portfolio/crafted/image1.jpg",
                "assets/images/portfolio/crafted/image2.jpg",
                "assets/images/portfolio/crafted/image3.jpg",
                "assets/images/portfolio/crafted/image4.jpg",
                "assets/images/portfolio/crafted/image5.jpg",
                "assets/images/portfolio/crafted/image6.jpg",
                "assets/images/portfolio/crafted/image7.jpg"
            ]
        },
        {
            folder: "nature",
            title: "Nature Collection",
            images: [
                "assets/images/portfolio/nature/image1.jpg",
                "assets/images/portfolio/nature/image2.jpg",
            ]
        }
    ]
};

async function loadPortfolios() {
    try {
        const portfolioGrid = document.getElementById('portfolio-grid');
        
        portfolioData.portfolios.forEach((portfolio, index) => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.id = `portfolio-${index}`;
            
            portfolioItem.innerHTML = `
                <h3>${portfolio.title}</h3>
                <div id="carousel-${index}"></div>
                <p>${portfolio.title}</p>
            `;
            
            portfolioGrid.appendChild(portfolioItem);
            
            const carousel = new PortfolioCarousel(portfolio.images, `portfolio-${index}`);
            const carouselContainer = document.getElementById(`carousel-${index}`);
            carouselContainer.innerHTML = carousel.createCarousel();
            carousel.attachListeners();
        });
    } catch (error) {
        console.error('Error loading portfolios:', error);
        // Add user-friendly error handling
        const portfolioGrid = document.getElementById('portfolio-grid');
        portfolioGrid.innerHTML = `
            <div class="error-message">
                <p>Unable to load portfolio images. Please try again later.</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadPortfolios);
