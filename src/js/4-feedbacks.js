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
    const feedbacks = feedbacks_all.data;

    
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

function renderThreeDots(activeIndex) {
  const paginationContainer = document.querySelector('.custom-pagination');
  const dotsCount = 3;
  paginationContainer.innerHTML = '';

  for (let i = 0; i < dotsCount; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (i === activeIndex % dotsCount) dot.classList.add('active');
    paginationContainer.appendChild(dot);
  }
}

renderFeedbacks();
