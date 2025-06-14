const API_BASE = 'https://sound-wave.b.goit.study/api';

async function fetchFeedbacks() {
  const response = await fetch(`${API_BASE}/feedbacks`);
  if (!response.ok) {
    throw new Error('Failed to load feedbacks');
  }
  return await response.json();
}

async function renderFeedbacks() {
  const wrapper = document.getElementById('feedback-wrapper');

  try {
    const feedbacks_all = await fetchFeedbacks();
    const feedbacks = feedbacks_all.data.slice(0, 10);

    feedbacks.forEach(({ rating, descr, name }, index) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

      slide.innerHTML = `
        <div class="feedback-card">
          <div class="feedback-rating" id="rating-${index}"></div>
          <p class="feedback-text">"${descr}"</p>
          <p class="feedback-author">${name}</p>
        </div>
      `;

      wrapper.appendChild(slide);
    });

    feedbacks.forEach(({ rating }, index) => {
        $(`#rating-${index}`).raty({
        readOnly: true,
        score: Math.round(rating),
        starType: 'img',
        starOn: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.7.1/images/star-on.png',
        starOff: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.7.1/images/star-off.png'
      });
    });

    initSwiper(feedbacks.length);
  } catch (error) {
    console.error('Error loading feedbacks:', error);
  }
}

function initSwiper(totalSlides) {
  const swiper = new Swiper('.swiper-container', {
    loop: false,
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.custom-pagination',
      clickable: true,
      renderBullet: (index, className) => {
        return `<span class="${className} dot" data-custom-index="${index}"></span>`;
      }
    },
    on: {
      init(swiperInstance) {
        renderThreeDots(swiperInstance.activeIndex, totalSlides);
      },
      slideChange(swiperInstance) {
        renderThreeDots(swiperInstance.activeIndex, totalSlides);
      }
    }
  });
}

function renderThreeDots(activeIndex, totalSlides) {
  const paginationContainer = document.querySelector('.custom-pagination');
  paginationContainer.innerHTML = '';

 
  const firstDot = document.createElement('span');
  firstDot.className = 'dot';
  if (activeIndex === 0) firstDot.classList.add('active');
  paginationContainer.appendChild(firstDot);

 
  const middleDot = document.createElement('span');
  middleDot.className = 'dot';
  if (activeIndex > 0 && activeIndex < totalSlides - 1) {
    middleDot.classList.add('active');
  }
  paginationContainer.appendChild(middleDot);

  const lastDot = document.createElement('span');
  lastDot.className = 'dot';
  if (activeIndex === totalSlides - 1) lastDot.classList.add('active');
  paginationContainer.appendChild(lastDot);
}
renderFeedbacks();
