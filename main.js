// Инициализация Swiper слайдера для hero
document.addEventListener('DOMContentLoaded', function () {
  const heroSwiperElement = document.querySelector('.hero-swiper');
  if (heroSwiperElement) {
    // Инициализируем слайдер только там, где он действительно есть
    new Swiper(heroSwiperElement, {
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
  }

  const navList = document.querySelector('.nav__list');
  const dropdowns = document.querySelectorAll('.dropdown');
  const desktopDropdown = document.querySelector('.dropdown');
  const dropdownMenu = desktopDropdown ? desktopDropdown.querySelector('.dropdown-menu') : null;
  const extraNavItems = dropdownMenu ? Array.from(dropdownMenu.children) : [];
  const DESKTOP_BREAKPOINT = 768;

  // Переносим дополнительные пункты меню в зависимости от ширины экрана
  const moveExtraItems = () => {
    if (!navList || !dropdownMenu || !desktopDropdown) {
      return;
    }

    const isDesktop = window.innerWidth > DESKTOP_BREAKPOINT;

    if (isDesktop) {
      desktopDropdown.classList.remove('dropdown--mobile-hidden');
      extraNavItems.forEach(item => {
        dropdownMenu.appendChild(item);
        item.classList.remove('mobile-menu-item');
      });
    } else {
      desktopDropdown.classList.add('dropdown--mobile-hidden');
      extraNavItems.forEach(item => {
        navList.appendChild(item);
        item.classList.add('mobile-menu-item');
      });
    }

    dropdowns.forEach(dropdownElement => {
      const menuElement = dropdownElement.querySelector('.dropdown-menu');
      if (!menuElement) {
        return;
      }

      menuElement.style.opacity = '0';
      menuElement.style.visibility = 'hidden';
      menuElement.style.transform = 'translateX(-50%) translateY(-10px)';
      dropdownElement.classList.remove('active');
    });
  };

  moveExtraItems();
  window.addEventListener('resize', moveExtraItems);

  const isDesktopView = () => window.innerWidth > DESKTOP_BREAKPOINT;

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (!toggle || !menu) {
      return;
    }

    dropdown.addEventListener('mouseenter', function() {
      if (!isDesktopView()) {
        return;
      }
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';
      menu.style.transform = 'translateX(-50%) translateY(0)';
    });

    dropdown.addEventListener('mouseleave', function() {
      if (!isDesktopView()) {
        return;
      }
      menu.style.opacity = '0';
      menu.style.visibility = 'hidden';
      menu.style.transform = 'translateX(-50%) translateY(-10px)';
    });

    toggle.addEventListener('click', function(e) {
      if (!isDesktopView()) {
        return;
      }

      e.preventDefault();

      dropdowns.forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
          const otherMenu = otherDropdown.querySelector('.dropdown-menu');
          if (!otherMenu) {
            return;
          }
          otherMenu.style.opacity = '0';
          otherMenu.style.visibility = 'hidden';
          otherMenu.style.transform = 'translateX(-50%) translateY(-10px)';
          otherDropdown.classList.remove('active');
        }
      });

      const isVisible = menu.style.opacity === '1';
      if (isVisible) {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateX(-50%) translateY(-10px)';
        dropdown.classList.remove('active');
      } else {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateX(-50%) translateY(0)';
        dropdown.classList.add('active');
      }
    });
  });

  // Закрыть меню при клике вне его
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateX(-50%) translateY(-10px)';
        dropdown.classList.remove('active');
      });
    }
  });

  // Бургер меню
  const burgerBtn = document.querySelector('.burger-btn');

  if (burgerBtn && navList) {
    burgerBtn.addEventListener('click', function() {
      // Переключаем активное состояние бургер-кнопки
      burgerBtn.classList.toggle('active');

      // Переключаем активное состояние меню
      navList.classList.toggle('active');
    });

    // Закрываем меню при клике вне его области
    document.addEventListener('click', function(event) {
      if (!burgerBtn.contains(event.target) && !navList.contains(event.target)) {
        burgerBtn.classList.remove('active');
        navList.classList.remove('active');
      }
    });

    // Закрываем меню при клике на ссылку (для мобильных)
    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        burgerBtn.classList.remove('active');
        navList.classList.remove('active');
      });
    });

    // Обработка выпадающего меню внутри бургер-меню
    const dropdownToggles = navList.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const dropdown = toggle.closest('.dropdown');
        dropdown.classList.toggle('active');
      });
    });
  }
});
