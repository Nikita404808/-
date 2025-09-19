// Инициализация Swiper слайдера для hero
document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.hero-swiper', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    autoplay: {
      delay: 5000,
    },
  });
});
