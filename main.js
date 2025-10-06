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
  const burgerBtn = document.querySelector('.burger-btn');

  const toggleMobileMenu = (shouldOpen) => {
    if (!navList || !burgerBtn) {
      return;
    }

    const nextState = typeof shouldOpen === 'boolean' ? shouldOpen : !navList.classList.contains('active');
    burgerBtn.classList.toggle('active', nextState);
    navList.classList.toggle('active', nextState);
    document.body.classList.toggle('body--locked', nextState);
    burgerBtn.setAttribute('aria-expanded', String(nextState));
    burgerBtn.setAttribute('aria-label', nextState ? 'Закрыть меню' : 'Открыть меню');
  };

  const closeMobileMenu = () => {
    toggleMobileMenu(false);
  };

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

    if (isDesktop) {
      closeMobileMenu();
    }
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

  if (burgerBtn && navList) {
    toggleMobileMenu(false);

    burgerBtn.addEventListener('click', function() {
      toggleMobileMenu();
    });

    // Закрываем меню при клике вне его области
    document.addEventListener('click', function(event) {
      if (!burgerBtn.contains(event.target) && !navList.contains(event.target)) {
        closeMobileMenu();
      }
    });

    // Закрываем меню при клике на ссылку (для мобильных)
    const navLinks = navList.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        closeMobileMenu();
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

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }

  const headerElement = document.querySelector('.header');
  const updateHeaderState = () => {
    if (!headerElement) {
      return;
    }

    if (window.scrollY > 24) {
      headerElement.classList.add('header--scrolled');
    } else {
      headerElement.classList.remove('header--scrolled');
    }
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  const eventsFeedElement = document.querySelector('[data-events-feed]');

  if (eventsFeedElement) {
    const eventsListElement = eventsFeedElement.querySelector('[data-events-list]');
    const eventsStatusElement = eventsFeedElement.querySelector('[data-events-status]');
    const moreLinkElement = eventsFeedElement.querySelector('[data-events-more]');
    const skeletonSelectors = '[data-skeleton]';

    const AFISHA_ENDPOINT = 'https://afisha.yandex.ru/api/events/nearby?city=balakovo&limit=6';
    const AFISHA_FALLBACK_URL = moreLinkElement ? moreLinkElement.href : 'https://afisha.yandex.ru/balakovo';

    const clearSkeletons = () => {
      if (!eventsListElement) {
        return;
      }
      eventsListElement.querySelectorAll(skeletonSelectors).forEach((skeleton) => skeleton.remove());
    };

    const toDate = (value) => {
      if (!value && value !== 0) {
        return null;
      }

      if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
      }

      if (typeof value === 'number') {
        const timestamp = value > 1e12 ? value : value * 1000;
        const date = new Date(timestamp);
        return Number.isNaN(date.getTime()) ? null : date;
      }

      if (typeof value === 'string') {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) {
          return date;
        }

        // Попытка разобрать строку формата `2024-03-20 19:00`
        const normalized = value.replace(' ', 'T');
        const dateWithTimezone = new Date(`${normalized}+03:00`);
        return Number.isNaN(dateWithTimezone.getTime()) ? null : dateWithTimezone;
      }

      return null;
    };

    const pickText = (...candidates) => {
      for (let index = 0; index < candidates.length; index += 1) {
        const candidate = candidates[index];
        if (!candidate) {
          continue;
        }

        if (typeof candidate === 'string' && candidate.trim()) {
          return candidate.trim();
        }

        if (typeof candidate === 'number' && !Number.isNaN(candidate)) {
          return String(candidate);
        }

        if (Array.isArray(candidate)) {
          const nested = pickText(...candidate);
          if (nested) {
            return nested;
          }
        } else if (typeof candidate === 'object') {
          const nested = pickText(candidate.text, candidate.subtitle, candidate.description, candidate.value, candidate.title, candidate.name);
          if (nested) {
            return nested;
          }
        }
      }

      return '';
    };

    const formatDateRange = (start, end) => {
      if (!start) {
        return '';
      }

      const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
      const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
      const startDatePart = dateFormatter.format(start);
      const startTimePart = timeFormatter.format(start);

      if (!end || start.toDateString() === end.toDateString()) {
        return `${startDatePart}, ${startTimePart}`;
      }

      const endDatePart = dateFormatter.format(end);
      const endTimePart = timeFormatter.format(end);
      return `${startDatePart}, ${startTimePart} — ${endDatePart}, ${endTimePart}`;
    };

    const extractDates = (rawEvent) => {
      const startCandidates = [];
      const endCandidates = [];

      if (rawEvent) {
        startCandidates.push(rawEvent.start, rawEvent.startAt, rawEvent.start_date, rawEvent.startDate, rawEvent.date, rawEvent.begin, rawEvent.time);
        endCandidates.push(rawEvent.end, rawEvent.endAt, rawEvent.end_date, rawEvent.endDate, rawEvent.finish, rawEvent.finish_at);

        if (Array.isArray(rawEvent.dates)) {
          rawEvent.dates.forEach((dateItem) => {
            startCandidates.push(dateItem.start, dateItem.startDate, dateItem.start_time, dateItem.start_datetime);
            endCandidates.push(dateItem.end, dateItem.endDate, dateItem.end_time, dateItem.end_datetime);
          });
        }

        if (Array.isArray(rawEvent.sessions)) {
          rawEvent.sessions.forEach((sessionItem) => {
            startCandidates.push(sessionItem.start, sessionItem.startAt, sessionItem.start_time, sessionItem.begin_time, sessionItem.time_start);
            endCandidates.push(sessionItem.end, sessionItem.endAt, sessionItem.end_time, sessionItem.time_end);
          });
        }

        if (rawEvent.session) {
          startCandidates.push(rawEvent.session.start, rawEvent.session.start_time);
          endCandidates.push(rawEvent.session.end, rawEvent.session.end_time);
        }

        if (rawEvent.scheduleInfo) {
          startCandidates.push(rawEvent.scheduleInfo.startAt, rawEvent.scheduleInfo.start);
          endCandidates.push(rawEvent.scheduleInfo.endAt, rawEvent.scheduleInfo.end);
        }
      }

      const startDate = startCandidates.map(toDate).find(Boolean) || null;
      const endDate = endCandidates.map(toDate).find(Boolean) || null;

      return { startDate, endDate };
    };

    const extractImage = (rawEvent) => {
      const imageCandidates = [
        rawEvent?.image?.url,
        rawEvent?.image?.sizes?.large,
        rawEvent?.cover?.url,
        rawEvent?.poster?.image?.url,
        rawEvent?.poster?.url,
        rawEvent?.logo?.url,
      ];

      const imageUrl = imageCandidates.find((candidate) => typeof candidate === 'string' && candidate.startsWith('http'));
      const altText = pickText(rawEvent?.image?.alt, rawEvent?.title, rawEvent?.name);

      if (!imageUrl) {
        return null;
      }

      return { url: imageUrl, alt: altText || 'Афиша события' };
    };

    const normalizeEvent = (rawEvent) => {
      const title = pickText(rawEvent?.title, rawEvent?.name, rawEvent?.shortTitle, rawEvent?.header) || 'Событие';
      const description = pickText(
        rawEvent?.subtitle,
        rawEvent?.description,
        rawEvent?.teaser,
        rawEvent?.announce,
        rawEvent?.scheduleInfo?.text,
        rawEvent?.shortDescription,
      );

      const place = rawEvent?.place || rawEvent?.location || rawEvent?.venue || {};
      const location = pickText(place.title, place.name, place.address?.text, place.address, rawEvent?.address);

      const priceText = pickText(
        rawEvent?.priceText,
        rawEvent?.price,
        rawEvent?.priceRange,
        rawEvent?.cost,
        rawEvent?.tickets?.price,
        rawEvent?.tickets?.text,
      );

      const rawTags = rawEvent?.tags || rawEvent?.genres || rawEvent?.categories || rawEvent?.rubrics || [];
      const tags = Array.isArray(rawTags)
        ? rawTags
          .map((tag) => pickText(tag?.title, tag?.name, tag))
          .filter((tag) => tag && tag.length <= 22)
          .slice(0, 3)
        : [];

      const linkCandidates = [
        rawEvent?.url,
        rawEvent?.link,
        rawEvent?.event_url,
        rawEvent?.shareUrl,
        rawEvent?.pageUrl,
        (rawEvent?.slug ? `/balakovo/${rawEvent.slug}` : null),
        rawEvent?.sessions && rawEvent.sessions[0]?.url,
        rawEvent?.session?.url,
      ].filter(Boolean);

      let link = linkCandidates.find((candidate) => typeof candidate === 'string' && candidate.trim());
      if (link && link.startsWith('/')) {
        link = `https://afisha.yandex.ru${link}`;
      }
      if (!link) {
        link = AFISHA_FALLBACK_URL;
      }

      const { startDate, endDate } = extractDates(rawEvent);
      const dateText = formatDateRange(startDate, endDate) || pickText(rawEvent?.scheduleInfo?.text, rawEvent?.when, rawEvent?.time_text);

      const image = extractImage(rawEvent);

      return {
        title,
        description,
        location,
        priceText,
        tags,
        link,
        startDate,
        endDate,
        dateText,
        image,
      };
    };

    const renderEventCard = (eventInfo) => {
      const cardElement = document.createElement('article');
      cardElement.className = 'events-feed__card';
      cardElement.setAttribute('role', 'article');

      const mediaElement = document.createElement('div');
      mediaElement.className = 'events-feed__media';
      if (eventInfo.image) {
        const imageElement = document.createElement('img');
        imageElement.src = eventInfo.image.url;
        imageElement.alt = eventInfo.image.alt;
        imageElement.loading = 'lazy';
        mediaElement.appendChild(imageElement);
      }
      cardElement.appendChild(mediaElement);

      const bodyElement = document.createElement('div');
      bodyElement.className = 'events-feed__body';

      if (eventInfo.dateText) {
        const dateElement = document.createElement('span');
        dateElement.className = 'events-feed__date';
        dateElement.textContent = eventInfo.dateText;
        bodyElement.appendChild(dateElement);
      }

      const titleElement = document.createElement('h3');
      titleElement.className = 'events-feed__card-title';
      titleElement.textContent = eventInfo.title;
      bodyElement.appendChild(titleElement);

      if (eventInfo.description) {
        const descriptionElement = document.createElement('p');
        descriptionElement.className = 'events-feed__description';
        descriptionElement.textContent = eventInfo.description;
        bodyElement.appendChild(descriptionElement);
      }

      const metaContainer = document.createElement('div');
      metaContainer.className = 'events-feed__meta';

      if (eventInfo.location) {
        const locationElement = document.createElement('span');
        locationElement.className = 'events-feed__meta-item';
        locationElement.textContent = eventInfo.location;
        metaContainer.appendChild(locationElement);
      }

      if (eventInfo.priceText) {
        const priceElement = document.createElement('span');
        priceElement.className = 'events-feed__meta-item';
        priceElement.textContent = eventInfo.priceText;
        metaContainer.appendChild(priceElement);
      }

      if (eventInfo.tags?.length) {
        eventInfo.tags.forEach((tag) => {
          const tagElement = document.createElement('span');
          tagElement.className = 'events-feed__meta-item';
          tagElement.textContent = tag;
          metaContainer.appendChild(tagElement);
        });
      }

      if (metaContainer.childElementCount) {
        bodyElement.appendChild(metaContainer);
      }

      const linkElement = document.createElement('a');
      linkElement.className = 'events-feed__link';
      linkElement.href = eventInfo.link;
      linkElement.target = '_blank';
      linkElement.rel = 'noopener';
      linkElement.setAttribute('aria-label', `Перейти к событию «${eventInfo.title}» на Яндекс.Афише`);
      linkElement.textContent = 'Подробнее';
      bodyElement.appendChild(linkElement);

      cardElement.appendChild(bodyElement);
      return cardElement;
    };

    const renderEvents = (events) => {
      clearSkeletons();
      if (!eventsListElement) {
        return;
      }
      eventsListElement.innerHTML = '';
      events.forEach((eventInfo) => {
        eventsListElement.appendChild(renderEventCard(eventInfo));
      });
    };

    const showFallback = (message) => {
      clearSkeletons();
      if (!eventsListElement) {
        return;
      }
      eventsListElement.innerHTML = '';
      const fallbackElement = document.createElement('div');
      fallbackElement.className = 'events-feed__empty';
      fallbackElement.innerHTML = `<strong>Не удалось загрузить афишу</strong><span>${message}</span>`;
      eventsListElement.appendChild(fallbackElement);
      if (eventsStatusElement) {
        eventsStatusElement.hidden = false;
        eventsStatusElement.textContent = 'Попробуйте открыть афишу на Яндексе — ссылка выше.';
      }
    };

    const parseResponse = (payload) => {
      if (!payload) {
        return [];
      }

      if (Array.isArray(payload)) {
        return payload;
      }

      if (Array.isArray(payload?.data)) {
        return payload.data;
      }

      if (Array.isArray(payload?.events)) {
        return payload.events;
      }

      if (Array.isArray(payload?.items)) {
        return payload.items;
      }

      if (payload?.result && Array.isArray(payload.result.events)) {
        return payload.result.events;
      }

      return [];
    };

    const parseJsonFromText = (response) => response.text().then((text) => {
      if (!text) {
        throw new Error('Пустой ответ афиши');
      }
      try {
        return JSON.parse(text);
      } catch (error) {
        throw new Error(`Не удалось распарсить ответ: ${error.message}`);
      }
    });

    const fetchAfisha = () => {
      const attemptDescriptors = [
        {
          label: 'direct',
          url: AFISHA_ENDPOINT,
          parser: (response) => response.json(),
        },
        {
          label: 'jina',
          url: `https://r.jina.ai/${AFISHA_ENDPOINT}`,
          parser: (response) => parseJsonFromText(response),
        },
        {
          label: 'allorigins',
          url: `https://api.allorigins.win/raw?url=${encodeURIComponent(AFISHA_ENDPOINT)}`,
          parser: (response) => parseJsonFromText(response),
        },
        {
          label: 'thingproxy',
          url: `https://thingproxy.freeboard.io/fetch/${AFISHA_ENDPOINT}`,
          parser: (response) => parseJsonFromText(response),
        },
      ];

      const tryFetch = (index) => {
        if (index >= attemptDescriptors.length) {
          return Promise.reject(new Error('Все доступные источники афиши недоступны.'));
        }

        const descriptor = attemptDescriptors[index];
        return fetch(descriptor.url, {
          headers: {
            Accept: 'application/json, text/plain, */*',
          },
          mode: 'cors',
          credentials: 'omit',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Ответ ${descriptor.label}: ${response.status}`);
            }
            return descriptor.parser(response);
          })
          .then((payload) => ({ payload, source: descriptor.label }))
          .catch((error) => {
            console.warn(`Афиша: попытка ${descriptor.label} не удалась`, error);
            return tryFetch(index + 1);
          });
      };

      return tryFetch(0);
    };

    Promise.resolve()
      .then(() => fetchAfisha())
      .then(({ payload, source }) => {
        const rawEvents = parseResponse(payload);
        if (!rawEvents.length) {
          throw new Error('Пустой список событий');
        }

        const normalizedEvents = rawEvents
          .slice(0, 6)
          .map((event) => normalizeEvent(event));

        renderEvents(normalizedEvents);
        if (eventsStatusElement) {
          const statusMessages = {
            direct: 'Данные подгружены напрямую из Яндекс-Афиши.',
            jina: 'Данные загружены через зеркальный источник (r.jina.ai).',
            allorigins: 'Данные загружены через публичное зеркало, возможна задержка обновления.',
            thingproxy: 'Данные загружены через резервное зеркало, возможна задержка обновления.',
          };
          eventsStatusElement.hidden = false;
          eventsStatusElement.textContent = statusMessages[source] || 'Данные подгружаются из Яндекс-Афиши.';
        }
      })
      .catch((error) => {
        console.error('Не удалось загрузить афишу Яндекса', error);
        showFallback('Мы уже работаем над тем, чтобы вернуть события на страницу. Пока что перейдите на Яндекс-Афишу.');
      });
  }

  const MAP_DEFAULT = { lat: 52.026816, lon: 47.560975, zoom: 12 };
  const MAP_FOCUS_STORAGE_KEY = 'balakovo:mapFocus';
  const MAP_SEARCH_REGION = 'Балаково, Саратовская область';
  const MAP_SEARCH_BOUNDS = [[MAP_DEFAULT.lat - 0.25, MAP_DEFAULT.lon - 0.4], [MAP_DEFAULT.lat + 0.25, MAP_DEFAULT.lon + 0.4]];
  let yandexMapsPromise;

  // Для каждого места можно указать дополнительный поисковый запрос через поле geocodeQuery,
  // если стандартного названия недостаточно для поиска по карте.
  const RAW_PLACES = [
    { name: '«Центральный»', description: 'Песчаная зона, спасательный пост, аренда шезлонгов и анимация выходного дня.', source: 'places-beaches.html' },
    { name: '«Лесной берег»', description: 'Тихое место с тенью от деревьев, волейбольной площадкой и прокатом sup-досок.', source: 'places-beaches.html' },
    { name: '«Ривер Парк»', description: 'Чистый пляж, беседки, кафе и прокат катеров на базе отдыха.', source: 'places-beaches.html' },
    { name: '«Песчаная коса»', description: 'Длинная береговая линия, зоны для семейного отдыха и food-truck ярмарка.', source: 'places-beaches.html' },
    { name: 'Wake-парк «Волна»', description: 'Катание на вейкборде, тренировки с инструкторами и лаунж-зона у воды.', source: 'places-beaches.html' },
    { name: '«Зелёная бухта»', description: 'Небольшая бухта с чистой водой, мангальными зонами и прокатом лодок.', source: 'places-beaches.html' },
    { name: '«Набережный»', description: 'Свежие продукты от местных хозяйств, дегустации и гастро-ярмарки по выходным.', source: 'places-fairs.html' },
    { name: 'Площадь Свободы', description: 'Сезонные ярмарки, уличные музыканты и тематические мастер-классы.', source: 'places-fairs.html' },
    { name: 'Гастроярмарка «Балаковские выходные»', description: 'Ежемесячные фестивали у набережной с фуд-траками и локальными брендами.', source: 'places-fairs.html' },
    { name: '«Творческая слобода»', description: 'Хендмейд, мастер-классы и локальные дизайнеры. Отлично подходит для подарков.', source: 'places-fairs.html' },
    { name: '«ЭкоДар»', description: 'Продукция без пластика, эко-товары для дома и регулярные лекции по sustainability.', source: 'places-fairs.html' },
    { name: '«Волга Ривер»', description: '4* отель на набережной, ресторан, SPA и панорамные номера.', source: 'places-hotels.html' },
    { name: '«Сити Конгресс»', description: 'Конференц-залы, бизнес-сервис, early breakfast и трансфер.', source: 'places-hotels.html' },
    { name: '«Петровский»', description: 'Стильные интерьеры, авторский ресторан и камерная атмосфера.', source: 'places-hotels.html' },
    { name: '«Loft на канале»', description: 'Современные апартаменты с кухней, само-заселением и парковкой.', source: 'places-hotels.html' },
    { name: '«Причал»', description: 'Небольшой семейный формат рядом с яхт-клубом, летняя терраса.', source: 'places-hotels.html' },
    { name: '«Energy Hub»', description: 'Коворкинг, общие и приватные комнаты, мероприятия для путешественников.', source: 'places-hotels.html' },
    { name: '«Грин Хаус»', description: 'Кинотеатр, фуд-корт, сетевые магазины и детская зона.', source: 'places-malls.html' },
    { name: '«БалкGо»', description: 'Концептуальный шопинг, pop-up магазины и мероприятия выходного дня.', source: 'places-malls.html' },
    { name: '«Модный квартал»', description: 'Бутики локальных дизайнеров, шоурумы и мастерские.', source: 'places-malls.html' },
    { name: 'Фермерский кластер «Слобода»', description: 'Фермерские продукты, кафе с локальной кухней и тематические ярмарки.', source: 'places-malls.html' },
    { name: '«Семейный двор»', description: 'Гипермаркет, детские площадки и сервисы для семьи.', source: 'places-malls.html' },
    { name: '«PlayTown»', description: 'Боулинг, лазертаг, игровые автоматы и настольные зоны.', source: 'places-malls.html' },
    { name: 'Краеведческий музей', description: 'Экспозиции об истории Балаково, интерактивные макеты и редкие фотоархивы.', source: 'places-museums.html' },
    { name: 'Галерея «Гидроэнергия»', description: 'Выставки современного искусства, резиденции художников и образовательные лекции.', source: 'places-museums.html' },
    { name: 'Музей энергетиков', description: 'Экскурсии по истории ГЭС, интерактивные макеты и VR-аттракционы для школьников.', source: 'places-museums.html' },
    { name: 'Усадьба инженера Курчатова', description: 'Аутентичные интерьеры, экскурсии о жизни ученых и тематические вечера.', source: 'places-museums.html' },
    { name: 'Детский центр «Наука на Волге»', description: 'Мастер-классы, научные шоу и интерактивные лаборатории для детей.', source: 'places-museums.html' },
    { name: 'Музей судоходного канала', description: 'Экспозиции о строителях, макеты шлюзов и прогулки по набережной.', source: 'places-museums.html' },
    { name: 'Щербакова остров', description: 'Природная зона на острове, велодорожки и экотропы.', source: 'places-nature.html' },
    { name: '«Волжские бухты»', description: 'Базы отдыха у воды, рыбалка, spa и видовые веранды.', source: 'places-nature.html' },
    { name: 'Агро-парк «Покровский двор»', description: 'Ферма, контактный зоопарк и дегустации фермерских продуктов.', source: 'places-nature.html' },
    { name: 'Зелёный маршрут «Южный»', description: 'Пешие и велосипедные маршруты, смотровые площадки и эко-точки.', source: 'places-nature.html' },
    { name: 'Балаковская пойма', description: 'Природный заказник, водно-болотные угодья и наблюдение за птицами.', source: 'places-nature.html' },
    { name: '«Берег ветра»', description: 'Станция кайтсерфинга, южные ветры и занятия с тренером.', source: 'places-nature.html' },
    { name: 'Набережная и судоходный канал', description: 'Вечером на набережной оживает прогулочная зона: подсветка мостов, уличные музыканты и виды на Волгу.', source: 'places.html' },
    { name: 'Эко-тропа «Щербакова остров»', description: 'Прогулка по натуральному ландшафту Волги: наблюдение за птицами, зоны для пикника и смотровые площадки.', source: 'places.html' },
    { name: 'Этнопарк «Покровский двор»', description: 'Интерактивные программы, фермерские ярмарки и мастер-классы для детей и взрослых.', source: 'places.html' },
    { name: 'Городской каток', description: 'Зимой — ледовый каток, летом — роллердром под открытым небом.', source: 'places.html' },
    { name: 'Дом культуры Балаково', description: 'Выставки, концерты и кинопоказы с участием местных артистов.', source: 'places.html' },
    { name: 'Парк им. Павлова', description: 'Большие аллеи, прокат самокатов, летние кафе и сцена для мероприятий.', source: 'places-parks.html' },
    { name: 'Набережная им. 50-летия ВЛКСМ', description: 'Прогулочная зона у воды, велодорожки и смотровые площадки.', source: 'places-parks.html' },
    { name: 'Сквер Энергетиков', description: 'Сквер с фонтаном, арт-объектами и фестивалями выходного дня.', source: 'places-parks.html' },
    { name: 'Парк «Молодёжный»', description: 'Спортивные площадки, скейт-парк и зона воркаута.', source: 'places-parks.html' },
    { name: 'Ботанический сад «Энерго»', description: 'Прогулочные дорожки, коллекция деревьев и тематические экскурсии.', source: 'places-parks.html' },
    { name: '«Волга Panoramic»', description: 'Вид из окон на набережную, сезонное меню и локальные продукты.', source: 'places-restaurants.html' },
    { name: '«Чайка»', description: 'Современная кухня, бар с авторскими коктейлями и вечерние диджей-сеты.', source: 'places-restaurants.html' },
    { name: '«Кофе и вид»', description: 'Спешиалти кофе, десерты и творческие завтраки на тихой улице.', source: 'places-restaurants.html' },
    { name: '«Фамильный дом»', description: 'Детская зона, просторные залы и меню с популярными блюдами.', source: 'places-restaurants.html' },
    { name: 'Фуд-холл «Причал»', description: 'Скоринговые кухни от бургеров до паназиатской еды на набережной.', source: 'places-restaurants.html' },
    { name: '«Булка&Круассан»', description: 'Свежая выпечка по утрам, кофейная карта и кондитерская витрина.', source: 'places-restaurants.html' },
    { name: '«Мир»', description: 'Современные кинозалы с Dolby Atmos, премьерный репертуар и семейные утренние сеансы.', source: 'places-theaters.html' },
    { name: 'Балаково-драм', description: 'Городской драматический театр с классическим репертуаром и гастролями федеральных коллективов.', source: 'places-theaters.html' },
    { name: 'Лофт-кино «Прожектор»', description: 'Артхаусные показы, лекции о кино и дискуссии с режиссёрами в камерной атмосфере.', source: 'places-theaters.html' },
    { name: '«Веснушки»', description: 'Интерактивные постановки для детей, творческие мастерские и встречи с артистами после спектаклей.', source: 'places-theaters.html' },
    { name: 'Дом культуры энергетиков', description: 'Большая сцена для мюзиклов, фестивалей и городских концертов с современной подсветкой.', source: 'places-theaters.html' },
    { name: 'Кинопарк на набережной', description: 'Сезонные показы под открытым небом, фудкорты и тематические вечера короткого метра.', source: 'places-theaters.html' },
    { name: 'Клиническая больница №1', description: 'Стационар на 600 мест, травмпункт и отделение скорой помощи с телемедициной.', source: 'infrastructure.html', geocodeQuery: 'Клиническая больница №1, Балаково' },
    { name: 'Центр высокоточной диагностики', description: 'Диагностика на МРТ и КТ, онлайн-результаты и телемедицина со специалистами центра.', source: 'infrastructure.html', geocodeQuery: 'Центр высокоточной диагностики, Балаково' },
    { name: 'Семейный медцентр «Волга»', description: 'Педиатры, семейные врачи и программы диспансеризации для всей семьи.', source: 'infrastructure.html', geocodeQuery: 'Медицинский центр Волга, Балаково' },
    { name: 'Центральный отдел полиции', description: 'Круглосуточный дежурный, приём заявлений и оперативные группы на выезд.', source: 'infrastructure.html', geocodeQuery: 'Центральный отдел полиции, Балаково' },
    { name: 'Участок «Северный»', description: 'Патрулирование северных микрорайонов, участковый пункт и мобильные экипажи.', source: 'infrastructure.html', geocodeQuery: 'Полиция Северный, Балаково' },
    { name: 'Отдельный батальон ГИБДД', description: 'Контроль движения на мостах и выездах из города, эвакуация и помощь на трассах.', source: 'infrastructure.html', geocodeQuery: 'ГИБДД Балаково' },
    { name: 'Мэрия Балаково', description: 'Открытые приёмы жителей, проектные офисы и публичные презентации городских программ.', source: 'infrastructure.html', geocodeQuery: 'Администрация Балаковского района, Балаково' },
    { name: 'Многофункциональный центр', description: '150 государственных услуг в одном месте, электронная очередь и помощь с госпорталом.', source: 'infrastructure.html', geocodeQuery: 'МФЦ Балаково' },
    { name: 'Центр поддержки семей', description: 'Сертификаты, пособия и психологическая помощь, отдельная линия для волонтёров.', source: 'infrastructure.html', geocodeQuery: 'Центр социальной поддержки семей, Балаково' },
    { name: 'Центральная пожарная часть', description: 'Реагирование на вызовы в центральных кварталах, выезд за 3 минуты.', source: 'infrastructure.html', geocodeQuery: 'Пожарная часть Балаково' },
    { name: 'Пожарно-спасательный пост «Набережный»', description: 'Расширенный пост на набережной, дежурства на городских мероприятиях.', source: 'infrastructure.html', geocodeQuery: 'Пожарный пост Набережный, Балаково' },
    { name: 'Пожарная часть «Индустриальная»', description: 'Работа с промышленными объектами, добровольные дружины и техника повышенной мощности.', source: 'infrastructure.html', geocodeQuery: 'Пожарная часть Индустриальная, Балаково' }
  ];

  const normalizePlaceKey = (value) => (value || '')
    .trim()
    .replace(/\s+/g, ' ');

  const PLACES_REGISTRY = (() => {
    const map = new Map();
    RAW_PLACES.forEach((place) => {
      const key = normalizePlaceKey(place.name);
      if (map.has(key)) {
        return;
      }
      map.set(key, {
        ...place,
        name: place.name.trim()
      });
    });
    return map;
  })();

  const PLACES_LIST = Array.from(PLACES_REGISTRY.values());

  const getPlaceQuery = (place) => {
    if (!place) {
      return '';
    }

    if (place.geocodeQuery && typeof place.geocodeQuery === 'string') {
      const customQuery = place.geocodeQuery.trim();
      if (customQuery) {
        return customQuery;
      }
    }

    return place.name.replace(/[«»]/g, '').trim();
  };

  const buildGeocodeQueries = (place) => {
    const candidates = [];

    const pushCandidate = (value) => {
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed) {
          candidates.push(trimmed);
        }
      }
    };

    pushCandidate(place.geocodeQuery);
    pushCandidate(place.name);
    pushCandidate(place.name ? place.name.replace(/[«»]/g, '') : '');

    const queries = [];
    const seen = new Set();

    candidates.forEach((candidate) => {
      const normalized = candidate.toLowerCase();
      const withRegion = normalized.includes('балаково') ? candidate : `${candidate}, ${MAP_SEARCH_REGION}`;

      if (!seen.has(withRegion)) {
        seen.add(withRegion);
        queries.push(withRegion);
      }

      if (!normalized.includes('балаково') && !seen.has(candidate)) {
        seen.add(candidate);
        queries.push(candidate);
      }
    });

    return queries;
  };

  const geocodeCache = new Map();

  const computeFallbackCoords = (value) => {
    const normalized = normalizePlaceKey(value).normalize('NFKD');
    let hash = 0;
    for (let index = 0; index < normalized.length; index += 1) {
      hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0;
    }
    const latComponent = (hash & 0xffff) / 0xffff - 0.5;
    const lonComponent = ((hash >>> 16) & 0xffff) / 0xffff - 0.5;
    const lat = MAP_DEFAULT.lat + latComponent * 0.12;
    const lon = MAP_DEFAULT.lon + lonComponent * 0.16;
    return [Number(lat.toFixed(6)), Number(lon.toFixed(6))];
  };

  const geocodePlace = (ymapsInstance, place) => {
    const queries = buildGeocodeQueries(place);
    if (!queries.length) {
      return Promise.reject(new Error(`Не указан поисковый запрос для «${place.name || 'места'}»`));
    }

    const attempts = [];
    queries.forEach((query) => {
      attempts.push({ query, options: { results: 1, boundedBy: MAP_SEARCH_BOUNDS, strictBounds: false } });
    });
    queries.forEach((query) => {
      attempts.push({ query, options: { results: 1 } });
    });

    const tryAttempt = (index) => {
      if (index >= attempts.length) {
        return Promise.reject(new Error(`Не удалось определить координаты для «${place.name || 'места'}»`));
      }

      const { query, options } = attempts[index];
      const cacheKey = `${query}::${options.boundedBy ? 'bounded' : 'global'}`.toLowerCase();

      if (geocodeCache.has(cacheKey)) {
        return Promise.resolve(geocodeCache.get(cacheKey));
      }

      return ymapsInstance.geocode(query, options)
        .then((response) => {
          const geoObject = response.geoObjects && response.geoObjects.get(0);
          if (!geoObject) {
            return tryAttempt(index + 1);
          }

          const coords = geoObject.geometry && typeof geoObject.geometry.getCoordinates === 'function'
            ? geoObject.geometry.getCoordinates()
            : null;

          if (!coords || coords.length !== 2) {
            return tryAttempt(index + 1);
          }

          const normalizedCoords = [
            Number.parseFloat(Number(coords[0]).toFixed(6)),
            Number.parseFloat(Number(coords[1]).toFixed(6))
          ];

          const result = { coords: normalizedCoords, precise: true };
          geocodeCache.set(cacheKey, result);
          return result;
        })
        .catch(() => tryAttempt(index + 1));
    };

    return tryAttempt(0).catch(() => {
      const fallbackCoords = computeFallbackCoords(place.name || (place.geocodeQuery || ''));
      const fallbackResult = { coords: fallbackCoords, precise: false };
      const fallbackKey = `fallback::${normalizePlaceKey(place.name || String(Date.now()))}`;
      geocodeCache.set(fallbackKey, fallbackResult);
      return fallbackResult;
    });
  };

  const runSequentially = (tasks) => tasks.reduce(
    (chain, task) => chain.then(() => task()),
    Promise.resolve()
  );

  const pullStoredMapFocus = () => {
    try {
      const rawValue = sessionStorage.getItem(MAP_FOCUS_STORAGE_KEY);
      if (!rawValue) {
        return null;
      }
      sessionStorage.removeItem(MAP_FOCUS_STORAGE_KEY);
      const parsed = JSON.parse(rawValue);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      const rawName = typeof parsed.name === 'string' ? parsed.name : '';
      const normalizedName = normalizePlaceKey(rawName);
      const registryPlace = normalizedName ? PLACES_REGISTRY.get(normalizedName) : null;
      const fallbackQuery = typeof parsed.query === 'string' ? parsed.query : rawName;

      return {
        key: normalizedName,
        place: registryPlace || null,
        rawName,
        fallbackQuery
      };
    } catch (error) {
      sessionStorage.removeItem(MAP_FOCUS_STORAGE_KEY);
    }
    return null;
  };

  const resolveRequestedMapFocus = () => {
    const params = new URLSearchParams(window.location.search);
    const rawParam = params.get('place');

    if (typeof rawParam === 'string' && rawParam.trim()) {
      const normalized = normalizePlaceKey(rawParam);
      if (normalized && PLACES_REGISTRY.has(normalized)) {
        const place = PLACES_REGISTRY.get(normalized);
        return {
          key: normalized,
          place,
          rawName: rawParam,
          fallbackQuery: getPlaceQuery(place)
        };
      }

      return {
        key: normalized || null,
        place: null,
        rawName: rawParam,
        fallbackQuery: rawParam
      };
    }

    return pullStoredMapFocus();
  };

  const createMapStatusController = (mapContainer) => {
    const statusParent = mapContainer.parentElement || mapContainer;
    let statusElement = statusParent.querySelector('[data-city-map-status]');
    if (!statusElement) {
      statusElement = document.createElement('p');
      statusElement.className = 'city-map__status';
      statusElement.dataset.cityMapStatus = 'true';
      statusElement.setAttribute('role', 'status');
      statusElement.hidden = true;
      mapContainer.insertAdjacentElement('afterend', statusElement);
    }

    return {
      show(message) {
        if (!message) {
          this.hide();
          return;
        }
        statusElement.textContent = message;
        statusElement.hidden = false;
      },
      hide() {
        statusElement.hidden = true;
      }
    };
  };

  const setupPlaceMapButtons = () => {
    const listingCards = document.querySelectorAll('.listing-card');
    if (!listingCards.length) {
      return;
    }

    listingCards.forEach((card) => {
      const titleElement = card.querySelector('.listing-card__title');
      if (!titleElement) {
        return;
      }

      const placeName = normalizePlaceKey(titleElement.textContent);
      const place = PLACES_REGISTRY.get(placeName);
      if (!place) {
        return;
      }

      if (card.querySelector('.listing-card__map-button')) {
        return;
      }

      const button = document.createElement('button');
      button.type = 'button';
      const mapQuery = getPlaceQuery(place);

      button.className = 'listing-card__map-button';
      button.textContent = 'Показать на карте';
      button.dataset.placeName = place.name;
      button.dataset.mapQuery = mapQuery;
      button.addEventListener('click', () => {
        try {
          sessionStorage.setItem(MAP_FOCUS_STORAGE_KEY, JSON.stringify({ name: place.name, query: mapQuery }));
        } catch (error) {
          // В приватном режиме браузер может запрещать использование sessionStorage
        }
        const targetUrl = `map.html?place=${encodeURIComponent(place.name)}`;
        window.location.href = targetUrl;
      });

      const metaBlock = card.querySelector('.listing-card__meta');
      if (metaBlock) {
        metaBlock.insertAdjacentElement('afterend', button);
      } else {
        card.appendChild(button);
      }
    });
  };

  const loadYandexMaps = () => {
    if (yandexMapsPromise) {
      return yandexMapsPromise;
    }

    yandexMapsPromise = new Promise((resolve, reject) => {
      const resetAndReject = (error) => {
        yandexMapsPromise = null;
        reject(error);
      };

      if (window.ymaps && typeof window.ymaps.ready === 'function') {
        window.ymaps.ready(() => resolve(window.ymaps));
        return;
      }

      const existingScript = document.querySelector('script[data-ymaps]');

      const handleReady = () => {
        if (window.ymaps && typeof window.ymaps.ready === 'function') {
          window.ymaps.ready(() => resolve(window.ymaps));
        } else {
          resetAndReject(new Error('Yandex Maps API не инициализировался'));
        }
      };

      const handleError = () => {
        resetAndReject(new Error('Не удалось загрузить Yandex Maps API'));
      };

      if (existingScript) {
        existingScript.addEventListener('load', handleReady, { once: true });
        existingScript.addEventListener('error', handleError, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      script.dataset.ymaps = 'true';
      script.addEventListener('load', handleReady, { once: true });
      script.addEventListener('error', handleError, { once: true });
      document.head.appendChild(script);
    });

    return yandexMapsPromise;
  };

  const initCityMap = () => {
    const mapContainer = document.querySelector('[data-city-map]');
    if (!mapContainer) {
      return;
    }

    const mapStatusController = createMapStatusController(mapContainer);

    loadYandexMaps()
      .then((ymapsInstance) => {
        mapContainer.innerHTML = '';

        const mapInstance = new ymapsInstance.Map(mapContainer, {
          center: [MAP_DEFAULT.lat, MAP_DEFAULT.lon],
          zoom: MAP_DEFAULT.zoom,
          controls: ['zoomControl', 'geolocationControl', 'fullscreenControl']
        }, {
          suppressMapOpenBlock: true,
          yandexMapDisablePoiInteractivity: true
        });

        const clusterer = new ymapsInstance.Clusterer({
          preset: 'islands#invertedBlueClusterIcons',
          groupByCoordinates: false,
          clusterHideIconOnBalloonOpen: false,
          clusterDisableClickZoom: false
        });

        mapInstance.geoObjects.add(clusterer);

        const processedKeys = new Set();
        const focusData = resolveRequestedMapFocus();
        const highlightAttempted = Boolean(focusData);
        let highlightSucceeded = false;

        const addPlacemark = (place, coords, { highlight } = {}) => {
          const placemark = new ymapsInstance.Placemark(coords, {
            balloonContentHeader: place.name,
            balloonContentBody: place.description || '',
            hintContent: place.name
          }, {
            preset: highlight ? 'islands#redCircleDotIcon' : 'islands#blueCircleDotIcon',
            hideIconOnBalloonOpen: false
          });

          clusterer.add(placemark);
          return placemark;
        };

        const processPlace = (place, options = {}) => {
          const {
            highlight = false,
            statusLabel,
            registryKey,
            allowDuplicateKey = false
          } = options;

          const label = statusLabel || place.name || 'Выбранное место';
          const key = registryKey || (place.name ? normalizePlaceKey(place.name) : null);

          if (!allowDuplicateKey && key && processedKeys.has(key)) {
            return Promise.resolve(null);
          }

          if (highlight) {
            mapStatusController.show(`Ищем «${label}» на карте...`);
          }

          return geocodePlace(ymapsInstance, place)
            .then((result) => {
              if (!result || !result.coords) {
                throw new Error('GEOCODE_EMPTY');
              }

              const { coords, precise } = result;

              if (key && !allowDuplicateKey) {
                processedKeys.add(key);
              }

              const placemark = addPlacemark(place, coords, { highlight });
              if (highlight) {
                highlightSucceeded = true;
                const zoomLevel = Math.max(mapInstance.getZoom(), 14);
                mapInstance.setCenter(coords, zoomLevel, { duration: 300 });
                if (precise) {
                  mapStatusController.hide();
                } else {
                  mapStatusController.show(`Не нашли точный адрес «${label}», показали ближайшую точку на карте.`);
                }
                placemark.balloon.open();
              }

              return placemark;
            })
            .catch((error) => {
              if (highlight) {
                mapStatusController.show(`Место «${label}» не найдено. Попробуйте уточнить название или адрес.`);
              } else {
                console.warn(`Не удалось определить координаты для «${place.name}»`, error);
              }
              return null;
            });
        };

        const tasks = [];

        if (focusData) {
          const focusPlace = focusData.place || {
            name: focusData.rawName || (focusData.fallbackQuery || 'Выбранное место'),
            description: '',
            geocodeQuery: focusData.fallbackQuery || focusData.rawName
          };

          const focusKey = focusData.key || normalizePlaceKey(focusPlace.name);
          tasks.push(() => processPlace(focusPlace, {
            highlight: true,
            statusLabel: focusData.rawName || focusPlace.name,
            registryKey: focusKey,
            allowDuplicateKey: !focusData.key
          }));
        } else {
          mapStatusController.hide();
        }

        PLACES_LIST.forEach((place) => {
          const key = normalizePlaceKey(place.name);
          if (focusData && focusData.key && focusData.key === key) {
            return;
          }
          tasks.push(() => processPlace(place, { registryKey: key }));
        });

        const finalizeView = () => {
          if (clusterer.getLength() > 0) {
            if (!highlightSucceeded) {
              const bounds = clusterer.getBounds();
              if (bounds) {
                const boundsResult = mapInstance.setBounds(bounds, { checkZoomRange: true, duration: 300 });
                if (boundsResult && typeof boundsResult.catch === 'function') {
                  boundsResult.catch(() => {
                    mapInstance.setCenter([MAP_DEFAULT.lat, MAP_DEFAULT.lon], MAP_DEFAULT.zoom);
                  });
                }
              } else {
                mapInstance.setCenter([MAP_DEFAULT.lat, MAP_DEFAULT.lon], MAP_DEFAULT.zoom);
              }
              if (!highlightAttempted) {
                mapStatusController.hide();
              }
            }
            return;
          }

          mapInstance.setCenter([MAP_DEFAULT.lat, MAP_DEFAULT.lon], MAP_DEFAULT.zoom);
          if (!highlightAttempted) {
            mapStatusController.show('На карте пока нет отмеченных мест.');
          }
        };

        runSequentially(tasks)
          .then(finalizeView)
          .catch((error) => {
            console.error('Не удалось отобразить часть мест на карте', error);
            finalizeView();
          });
      })
      .catch((error) => {
        console.error('Yandex Maps API: карта не загрузилась', error);
        mapContainer.innerHTML = '<p class="city-map__error">Карта временно недоступна. Проверьте подключение к интернету или попробуйте позже.</p>';
      });
  };

  setupPlaceMapButtons();
  initCityMap();
});
