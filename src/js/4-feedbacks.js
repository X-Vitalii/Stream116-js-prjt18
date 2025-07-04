import Swiper from 'swiper';
import 'swiper/css';
import { fetchData } from './api';
import iziToast from 'izitoast';

document.addEventListener('DOMContentLoaded', () => {
  const feedbackSection = document.querySelector('.feedback-section#reviews');
  const swiperContainer = document.querySelector(
    '.feedback-swiper .swiper-wrapper'
  );
  const paginationContainer = document.querySelector('.feedback-pagination');
  let loader;

  if (!feedbackSection || !swiperContainer || !paginationContainer) {
    console.error('Required DOM elements not found:', {
      feedbackSection: feedbackSection,
      swiperContainer: swiperContainer,
      paginationContainer: paginationContainer,
    });
    iziToast.error({
      title: 'Error',
      message:
        'Failed to initialize feedback section. Please check the HTML structure.',
    });
    return;
  }

  loader = document.createElement('div');
  loader.className = 'feedback-loader';
  loader.textContent = 'Loading...';
  feedbackSection.appendChild(loader);

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function createSlides(data) {
    swiperContainer.innerHTML = '';
    const reviews = data.data || data;
    if (!Array.isArray(reviews)) {
      console.error('No valid data array found:', data);
      iziToast.error({
        title: 'Error',
        message: 'Failed to load feedback data. Invalid response format.',
      });
      return;
    }

    reviews.forEach((item, index) => {
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide', 'feedback-slide-card');
      const roundedRating = Math.round(item.rating);
      slide.innerHTML = `
        <div class="feedback-slide-content">
          <div class="feedback-star-rating">
            <svg width="116" height="20" viewBox="0 0 116 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0)">
                ${generateStars(roundedRating)}
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="116" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <p class="feedback-comment">${item.descr}</p>
          <div class="feedback-user-info"><span class="feedback-user-name">${
            item.name
          }</span></div>
        </div>
      `;
      swiperContainer.appendChild(slide);
    });

    paginationContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const bullet = document.createElement('div');
      bullet.classList.add('feedback-pagination-bullet');
      bullet.setAttribute('data-index', i);
      if (i === 0) bullet.classList.add('active');
      paginationContainer.appendChild(bullet);
    }
    loader.style.display = 'none';
  }

  function generateStars(rating) {
    let stars = '';
    const starPath =
      'M9.071 1.31791C9.41474 0.501451 10.5855 0.501452 10.9292 1.31791L12.958 6.1368C13.103 6.481 13.4307 6.71618 13.8068 6.74597L19.0728 7.16304C19.965 7.23371 20.3268 8.3337 19.647 8.90897L15.6349 12.3042C15.3483 12.5468 15.2231 12.9273 15.3107 13.2899L16.5365 18.3666C16.7441 19.2267 15.427 19.9066 15.0541 19.4457L10.5247 16.7251C10.2026 16.5308 9.79762 16.5308 9.4756 16.7251L4.96711 19.4457C4.20323 19.9066 3.25608 19.2267 3.46376 18.3666L4.68954 13.2899C4.7771 12.9273 4.65194 12.5468 4.36538 12.2942L0.353184 8.90897C-0.326596 8.3337 0.0351899 7.23371 0.927413 7.16304L6.19348 6.74597C6.56962 6.71618 6.89728 6.481 7.04219 6.1368L9.071 1.31794Z';
    for (let i = 0; i < 5; i++) {
      const xOffset = i * 24;
      stars += `<path d="${starPath}" fill="${
        i < rating ? '#764191' : '#fff'
      }" transform="translate(${xOffset}, 0)"/>`;
    }
    return stars;
  }

  loader.style.display = 'block';
  fetchData('https://sound-wave.b.goit.study/api/feedbacks?limit=10&page=1')
    .then(data => {
      createSlides(data);
      const swiper = new Swiper('.feedback-swiper', {
        direction: 'horizontal',
        loop: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        slidesPerView: 1,
        spaceBetween: 0,
      });

      const nextButton = document.querySelector('.swiper-button-next');
      const prevButton = document.querySelector('.swiper-button-prev');

      function updateNavigation() {
        if (swiper.realIndex === 0) {
          prevButton.classList.add('inactive');
        } else {
          prevButton.classList.remove('inactive');
        }

        if (swiper.realIndex === swiper.slides.length - 1) {
          nextButton.classList.add('inactive');
        } else {
          nextButton.classList.remove('inactive');
        }
      }

      swiper.on('init', updateNavigation);
      swiper.on('slideChange', () => {
        updateNavigation();
        const bullets = document.querySelectorAll(
          '.feedback-pagination-bullet'
        );
        const realIndex = swiper.realIndex;
        bullets.forEach(bullet => {
          const bulletIndex = parseInt(bullet.getAttribute('data-index'));
          if (bulletIndex === 0) {
            bullet.classList.toggle('active', realIndex === 0);
          } else if (bulletIndex === 1) {
            bullet.classList.toggle('active', realIndex >= 1 && realIndex <= 8);
          } else if (bulletIndex === 2) {
            bullet.classList.toggle('active', realIndex === 9);
          }
        });
      });

      swiper.init();

      if (nextButton && prevButton) {
        nextButton.addEventListener(
          'click',
          debounce(() => swiper.slideNext(), 300)
        );
        prevButton.addEventListener(
          'click',
          debounce(() => swiper.slidePrev(), 300)
        );
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      loader.style.display = 'none';
      iziToast.error({
        title: 'Error',
        message: 'Failed to load feedback. Please try again later.',
      });
    });
});
