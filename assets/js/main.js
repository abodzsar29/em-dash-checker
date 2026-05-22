document.addEventListener('DOMContentLoaded', function () {
  const sliderGroups = document.querySelectorAll('.slider-group');

  sliderGroups.forEach(function (group) {
    const sliderEl = group.querySelector('.siema');

    const siema = new Siema({
      selector: sliderEl,
      duration: 400,
      easing: 'ease-out',
      perPage: 1,
      loop: true
    });

    const prevBtn = group.querySelector('.prev');
    const nextBtn = group.querySelector('.next');

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', function () {
        siema.prev();
      });
      nextBtn.addEventListener('click', function () {
        siema.next();
      });
    }
  });

  const overviewTexts = [
    'Is your colleague being lazy? Are they using LLMs to write “Best regards”? Paste it below and inspect the dash damage.',
    'Did someone suddenly start writing like a polished LinkedIn ghostwriter? Check whether the em dash gave them away.',
    'Suspiciously elegant paragraph? Too many dramatic pauses? Paste the text below and let the dash detector investigate.',
    'Before you accuse your colleague of outsourcing their personality, check the em dash count first.',
    'Has “quick update” become a suspiciously well-structured masterpiece? Paste it here and see if the em dash snitches.'
  ];

  const cleanTexts = [
    'No em dash found. They may still be thinking for themselves.',
    'Clean. Their imagination appears to be alive, barely.',
    'No suspicious dashes. The human survived this round.',
    'No em dash detected. Either they wrote it themselves, or the robot learned restraint.',
    'Looks safe. The commas are still doing honest work.'
  ];

  const susTexts = [
    'Yep, they are asleep at the wheel.',
    'Em dash found. The machine has entered the chat.',
    'Suspicious dash activity detected. Someone may have outsourced their personality.',
    'There it is. The little horizontal confession.',
    'Em dash located. Prepare the office investigation.'
  ];

  const STORAGE_KEY = 'emdashchecker:lastInput';
  const body = document.body;
  const overviewEl = document.querySelector('.overview');
  const inputEl = document.getElementById('inputText');
  const resultSectionEl = document.getElementById('resultSection');
  const resultWrapEl = document.getElementById('resultWrap');
  const resultEl = document.getElementById('resultText');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  let lastState = null;
  let currentCleanMessage = '';
  let currentSusMessage = '';

  function applyPreferredScheme(event) {
    const useDarkScheme = event.matches;

    body.classList.remove('scheme-daylight', 'scheme-midnight');
    body.classList.add(useDarkScheme ? 'scheme-midnight' : 'scheme-daylight');
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function containsEmDash(text) {
    return text.includes('—');
  }

  function debounce(fn, delay) {
    let timerId;

    return function () {
      const args = arguments;
      clearTimeout(timerId);
      timerId = window.setTimeout(function () {
        fn.apply(null, args);
      }, delay);
    };
  }

  function typeOnce(el, text, speed) {
    el.textContent = '';
    let index = 0;

    function tick() {
      if (index < text.length) {
        el.textContent += text[index];
        index += 1;
        window.setTimeout(tick, speed);
      }
    }

    tick();
  }

  function hideResult() {
    resultSectionEl.hidden = true;
    resultEl.textContent = '';
    resultEl.classList.remove('is-clean', 'is-sus');
    lastState = null;
  }

  function showCleanResult() {
    resultSectionEl.hidden = false;
    resultEl.classList.remove('is-sus');
    resultEl.classList.add('is-clean');
    resultEl.textContent = currentCleanMessage;
  }

  function showSusResult() {
    resultSectionEl.hidden = false;
    resultEl.classList.remove('is-clean');
    resultEl.classList.add('is-sus');
    resultEl.textContent = currentSusMessage;
  }

  function updateResult(text) {
    const trimmed = text.trim();

    if (!trimmed) {
      hideResult();
      return;
    }

    const newState = containsEmDash(trimmed) ? 'sus' : 'clean';

    if (newState !== lastState) {
      if (newState === 'clean') {
        currentCleanMessage = pickRandom(cleanTexts);
      } else {
        currentSusMessage = pickRandom(susTexts);
      }
      lastState = newState;
    }

    if (newState === 'clean') {
      showCleanResult();
    } else {
      showSusResult();
    }
  }

  const debouncedUpdate = debounce(function (value) {
    window.localStorage.setItem(STORAGE_KEY, value);
    updateResult(value);
  }, 250);

  if (overviewEl && inputEl && resultSectionEl && resultWrapEl && resultEl) {
    applyPreferredScheme(prefersDark);

    if (typeof prefersDark.addEventListener === 'function') {
      prefersDark.addEventListener('change', applyPreferredScheme);
    } else if (typeof prefersDark.addListener === 'function') {
      prefersDark.addListener(applyPreferredScheme);
    }

    typeOnce(overviewEl, pickRandom(overviewTexts), 35);

    const savedValue = window.localStorage.getItem(STORAGE_KEY) || '';
    inputEl.value = savedValue;
    updateResult(savedValue);

    inputEl.addEventListener('input', function (event) {
      debouncedUpdate(event.target.value);
    });

    inputEl.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        inputEl.value = '';
        window.localStorage.removeItem(STORAGE_KEY);
        hideResult();
      }
    });
  }
});
