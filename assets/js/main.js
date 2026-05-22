document.addEventListener('DOMContentLoaded', function () {
  const overviewTexts = [
    'Is your colleague using LLMs to write “Best regards”? Paste it below and inspect the dash damage.',
    'Did someone suddenly start writing like a polished LinkedIn ghostwriter? Check whether the em dash gave them away.',
    'Suspiciously elegant paragraph? Paste the text below and let the dash detector investigate.',
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
  const THEME_KEY = 'emdashchecker:theme';
  const body = document.body;
  const overviewEl = document.querySelector('.overview');
  const inputEl = document.getElementById('inputText');
  const resultSectionEl = document.getElementById('resultSection');
  const resultEl = document.getElementById('resultText');
  const themeToggleEl = document.getElementById('themeToggle');

  if (!overviewEl || !inputEl || !resultSectionEl || !resultEl || !themeToggleEl) {
    return;
  }

  const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  let themePreference = window.localStorage.getItem(THEME_KEY);
  let lastState = null;
  let currentCleanMessage = '';
  let currentSusMessage = '';

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function debounce(fn, delay) {
    let timerId = 0;

    return function () {
      const args = arguments;
      window.clearTimeout(timerId);
      timerId = window.setTimeout(function () {
        fn.apply(null, args);
      }, delay);
    };
  }

  function typeOnce(element, text, speed) {
    element.textContent = '';
    let index = 0;

    function tick() {
      if (index >= text.length) {
        return;
      }

      element.textContent += text[index];
      index += 1;
      window.setTimeout(tick, speed);
    }

    tick();
  }

  function applyTheme(theme) {
    const isMidnight = theme === 'midnight';

    body.classList.toggle('scheme-midnight', isMidnight);
    body.classList.toggle('scheme-daylight', !isMidnight);
    themeToggleEl.textContent = isMidnight ? 'Light Mode' : 'Dark Mode';
    themeToggleEl.setAttribute('aria-pressed', String(isMidnight));
  }

  function resolveTheme() {
    if (themePreference === 'midnight' || themePreference === 'daylight') {
      return themePreference;
    }

    return colorSchemeMedia.matches ? 'midnight' : 'daylight';
  }

  function syncTheme() {
    applyTheme(resolveTheme());
  }

  function hideResult() {
    resultSectionEl.hidden = true;
    resultEl.textContent = '';
    resultEl.classList.remove('is-clean', 'is-sus');
    lastState = null;
  }

  function showResult(state, message) {
    resultSectionEl.hidden = false;
    resultEl.classList.toggle('is-clean', state === 'clean');
    resultEl.classList.toggle('is-sus', state === 'sus');
    resultEl.textContent = message;
  }

  function updateResult(text) {
    const trimmed = text.trim();

    if (!trimmed) {
      hideResult();
      return;
    }

    const nextState = trimmed.includes('—') ? 'sus' : 'clean';

    if (nextState !== lastState) {
      if (nextState === 'clean') {
        currentCleanMessage = pickRandom(cleanTexts);
      } else {
        currentSusMessage = pickRandom(susTexts);
      }

      lastState = nextState;
    }

    showResult(
      nextState,
      nextState === 'clean' ? currentCleanMessage : currentSusMessage
    );
  }

  const persistAndUpdate = debounce(function (value) {
    window.localStorage.setItem(STORAGE_KEY, value);
    updateResult(value);
  }, 250);

  syncTheme();

  if (typeof colorSchemeMedia.addEventListener === 'function') {
    colorSchemeMedia.addEventListener('change', syncTheme);
  } else if (typeof colorSchemeMedia.addListener === 'function') {
    colorSchemeMedia.addListener(syncTheme);
  }

  typeOnce(overviewEl, pickRandom(overviewTexts), 18);

  const savedValue = window.localStorage.getItem(STORAGE_KEY) || '';
  inputEl.value = savedValue;
  updateResult(savedValue);

  inputEl.addEventListener('input', function (event) {
    persistAndUpdate(event.target.value);
  });

  inputEl.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') {
      return;
    }

    inputEl.value = '';
    window.localStorage.removeItem(STORAGE_KEY);
    hideResult();
  });

  themeToggleEl.addEventListener('click', function () {
    themePreference = body.classList.contains('scheme-midnight') ? 'daylight' : 'midnight';
    window.localStorage.setItem(THEME_KEY, themePreference);
    syncTheme();
  });
});
