
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
    const feedbacks_all = await fetchFeedbacks()
    const feedbacks = feedbacks_all.data;

    feedbacks.forEach(({rating, descr, name }, index) => {

      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

      const ratingContainer = document.createElement('div');
      ratingContainer.className = 'feedback-rating';
      ratingContainer.id = `rating-${index}`;


      slide.innerHTML = `
        <p class="feedback-text">"${descr}"</p>
        <p class="feedback-author">${name}</p>
      `;
      slide.prepend(ratingContainer);

      wrapper.appendChild(slide);
    });

    feedbacks.forEach(({ rating }, index) => {
      $(`#rating-${index}`).raty({
        readOnly: true,
        score: Math.round(rating),
        starType: 'i',
        starOn: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.7.1/images/star-on.png',
        starOff: 'https://cdnjs.cloudflare.com/ajax/libs/raty/2.7.1/images/star-off.png'
      });
    });

    initSwiper(feedbacks.length);

  } catch (error) {
    console.error('Error loading feedbacks:', error);
  }
}


function initSwiper(count) {
  const middle = Math.floor(count / 2);

  new Swiper('.swiper-container', {
    loop: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.custom-pagination',
      clickable: true,
      renderBullet: (index, className) => {
        if (index === 0 || index === count - 1 || index === middle) {
          return `<span class="${className} dot"></span>`;
        }
        return ''; 
      }
    },
    on: {
      slideChange(swiper) {
        const bullets = document.querySelectorAll('.custom-pagination .dot');
        bullets.forEach(b => b.classList.remove('active'));

        const activeIndex = swiper.activeIndex;
        const bulletIndex =
          activeIndex === 0 ? 0 :
          activeIndex === count - 1 ? 1 :
          2;

        if (bullets[bulletIndex]) {
          bullets[bulletIndex].classList.add('active');
        }
      }
    }
  });
}

renderFeedbacks();
