// Генератор CSS градиентов
// Основная функция-обёртка для изоляции области видимости
(() => {
  // === СОСТОЯНИЕ ПРИЛОЖЕНИЯ ===
  // Хранит текущие настройки градиента
  const state = {
    type: "linear", // Тип градиента: linear, radial или conic
    direction: 90, // Угол направления для linear/conic градиентов (в градусах)
    radialShape: "circle", // Форма радиального градиента: circle или ellipse
    // Массив цветовых точек градиента
    colorStops: [
      { color: "#6c63ff", position: 0 }, // Первая точка: фиолетовый цвет в начале (0%)
      { color: "#ff6584", position: 100 }, // Последняя точка: розовый цвет в конце (100%)
    ],
  };

  // === ПРЕСЕТЫ ===
  // Готовые наборы цветов для быстрого выбора
  const presets = [
    { colors: ["#667eea", "#764ba2"], name: "Purple Haze" }, // Фиолетовый туман
    { colors: ["#f093fb", "#f5576c"], name: "Pink Love" }, // Розовая любовь
    { colors: ["#4facfe", "#00f2fe"], name: "Ocean Blue" }, // Океанский синий
    { colors: ["#43e97b", "#38f9d7"], name: "Green Mint" }, // Зелёная мята
    { colors: ["#fa709a", "#fee140"], name: "Sunset" }, // Закат
    { colors: ["#a18cd1", "#fbc2eb"], name: "Lavender" }, // Лаванда
    { colors: ["#fccb90", "#d57eeb"], name: "Peach" }, // Персик
    { colors: ["#e0c3fc", "#8ec5fc"], name: "Sky" }, // Небо
    { colors: ["#f5576c", "#ff9a9e"], name: "Coral" }, // Коралл
    // Градиент с тремя цветами
    { colors: ["#667eea", "#f093fb", "#f5576c"], name: "Rainbow" }, // Радуга
    { colors: ["#0c0c0c", "#434343"], name: "Dark" }, // Тёмный
    { colors: ["#ffecd2", "#fcb69f"], name: "Warm" }, // Тёплый
  ];

  // === ПОЛУЧЕНИЕ ССЫЛОК НА DOM-ЭЛЕМЕНТЫ ===
  // Основные элементы интерфейса
  const preview = document.getElementById("preview"); // Область предпросмотра градиента
  const cssCode = document.getElementById("cssCode"); // Блок для отображения CSS-кода
  const copyBtn = document.getElementById("copyBtn"); // Кнопка копирования CSS
  const directionSlider = document.getElementById("direction"); // Слайдер выбора угла направления
  const directionValue = document.getElementById("directionValue"); // Отображение текущего значения угла
  const directionGroup = document.getElementById("directionGroup"); // Группа элементов направления
  const radialGroup = document.getElementById("radialGroup"); // Группа элементов для radial градиента
  const colorStopsContainer = document.getElementById("colorStops"); // Контейнер для цветовых точек
  const addColorBtn = document.getElementById("addColorBtn"); // Кнопка добавления цвета
  const presetsGrid = document.getElementById("presets"); // Сетка пресетов

  // Кнопки экспорта
  const exportCssBtn = document.getElementById("exportCssBtn"); // Экспорт в CSS файл
  const exportClassBtn = document.getElementById("exportClassBtn"); // Экспорт готовых CSS классов
  const exportPngBtn = document.getElementById("exportPngBtn"); // Экспорт в PNG изображение
  const exportTailwindBtn = document.getElementById("exportTailwindBtn"); // Экспорт для Tailwind CSS

  // Элементы анима animateBtn = documentции
  const animateBtn = document.getElementById("animateBtn"); // Кнопка включения анимации
  const animationSettings = document.getElementById("animationSettings"); // Настройки анимации
  const animSpeed = document.getElementById("animSpeed"); // Слайдер скорости анимации
  const speedValue = document.getElementById("speedValue"); // Отображение значения скорости
  const toast = document.getElementById("toast"); // Всплывающее уведомление

  // === СОСТОЯНИЕ АНИМАЦИИ ===
  let isAnimated = false; // Флаг: включена ли анимация
  let animType = "shift"; // Тип анимации: shift (сдвиг), rotate (вращение), hue (оттенок)
  let animEase = "ease"; // Функция плавности анимации

  // === ГЕНЕРАЦИЯ CSS ДЛЯ ГРАДИЕНТА ===
  // Создаёт строку CSS-кода для текущего градиента
  function generateGradientCSS() {
    // Формируем строку цветовых точек: "color position%, color position%, ..."
    const stops = state.colorStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");

    // Выбор формата в зависимости от типа градиента
    switch (state.type) {
      case "linear":
        // Линейный градиент: linear-gradient(угол, цвета)
        return `linear-gradient(${state.direction}deg, ${stops})`;
      case "radial":
        // Радиальный градиент: radial-gradient(форма, цвета)
        return `radial-gradient(${state.radialShape}, ${stops})`;
      case "conic":
        // Конический градиент: conic-gradient(from угол, цвета)
        return `conic-gradient(from ${state.direction}deg, ${stops})`;
      default:
        // По умолчанию линейный градиент
        return `linear-gradient(${state.direction}deg, ${stops})`;
    }
  }

  // === ОБНОВЛЕНИЕ ПРЕДПРОСМОТРА И CSS-КОДА ===
  // Основная функция обновления - вызывается при любом изменении настроек
  function update() {
    const gradient = generateGradientCSS();
    // Применяем градиент к области предпросмотра
    preview.style.backgroundImage = gradient;

    // Если анимация включена - добавляем CSS анимации
    if (isAnimated) {
      let animName = "gradient-shift";
      let bgSize = "400% 400%";
      let keyframes = "";

      // Выбор типа анимации
      if (animType === "rotate") {
        animName = "gradient-rotate";
        bgSize = "100% 100%";
      } else if (animType === "hue") {
        animName = "gradient-hue";
        bgSize = "100% 100%";
      }

      // Получаем длительность анимации из слайдера
      const animDuration = animSpeed.value + "s";

      // Генерация ключевых кадров в зависимости от типа анимации
      if (animType === "shift") {
        // Анимация сдвига фона
        keyframes = `@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;
      } else if (animType === "rotate") {
        // Анимация вращения
        keyframes = `@keyframes gradient-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
      } else if (animType === "hue") {
        // Анимация смены оттенка
        keyframes = `@keyframes gradient-hue {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}`;
      }

      // Формируем полный CSS с анимацией
      cssCode.textContent = `background-image: ${gradient};
background-size: ${bgSize};
animation: ${animName} ${animDuration} ${animEase} infinite;

${keyframes}`;
    } else {
      // Простой CSS без анимации
      cssCode.textContent = `background-image: ${gradient};`;
    }
  }

  // === ОТРИСОВКА ЦВЕТОВЫХ ТОЧЕК ===
  // Создаёт HTML-элементы для каждой цветовой точки
  function renderColorStops() {
    // Очищаем контейнер перед перерисовкой
    colorStopsContainer.innerHTML = "";

    // Для каждой цветовой точки создаём элемент управления
    state.colorStops.forEach((stop, index) => {
      const el = document.createElement("div");
      el.className = "color-stop";
      // HTML шаблон элемента управления цветом
      el.innerHTML = `
                <input type="color" value="${stop.color}" data-index="${index}" class="stop-color">
                <input type="range" min="0" max="100" value="${stop.position}" data-index="${index}" class="slider stop-position">
                <span class="stop-value">${stop.position}%</span>
                ${state.colorStops.length > 2 ? `<button class="btn-remove" data-index="${index}" title="Удалить">✕</button>` : ""}
            `;
      colorStopsContainer.appendChild(el);
    });

    // === ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ЦВЕТОВЫХ ТОЧЕК ===

    // Изменение цвета
    colorStopsContainer.querySelectorAll(".stop-color").forEach((input) => {
      input.addEventListener("input", (e) => {
        const i = parseInt(e.target.dataset.index); // Получаем индекс точки
        state.colorStops[i].color = e.target.value; // Обновляем цвет в состоянии
        update(); // Перерисовываем градиент
      });
    });

    // Изменение позиции (положения) цветовой точки
    colorStopsContainer.querySelectorAll(".stop-position").forEach((input) => {
      input.addEventListener("input", (e) => {
        const i = parseInt(e.target.dataset.index);
        state.colorStops[i].position = parseInt(e.target.value); // Обновляем позицию
        e.target.nextElementSibling.textContent = e.target.value + "%"; // Обновляем текст
        update();
      });
    });

    // Удаление цветовой точки
    colorStopsContainer.querySelectorAll(".btn-remove").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const i = parseInt(e.target.dataset.index);
        state.colorStops.splice(i, 1); // Удаляем точку из массива
        renderColorStops(); // Перерисовываем элементы
        update(); // Обновляем градиент
      });
    });
  }

  // === ОТРИСОВКА ПРЕСЕТОВ ===
  // Создаёт визуальные образцы (свайпы) для быстрого выбора цветов
  function renderPresets() {
    presetsGrid.innerHTML = "";
    presets.forEach((preset, index) => {
      const swatch = document.createElement("div");
      swatch.className = "preset-swatch";

      // Вычисляем позиции для равномерного распределения цветов
      const stops = preset.colors
        .map(
          (c, i) =>
            `${c} ${Math.round((i / (preset.colors.length - 1)) * 100)}%`,
        )
        .join(", ");

      // Применяем градиент как фон свайпа
      swatch.style.background = `linear-gradient(135deg, ${stops})`;
      swatch.title = preset.name;

      // Обработчик клика - применяем пресет
      swatch.addEventListener("click", () => {
        state.colorStops = preset.colors.map((c, i) => ({
          color: c,
          position: Math.round((i / (preset.colors.length - 1)) * 100),
        }));
        renderColorStops();
        update();
      });
      presetsGrid.appendChild(swatch);
    });
  }

  // === ОБРАБОТЧИКИ КНОПОК ТИПА ГРАДИЕНТА ===
  // Линейный, радиальный, конический
  document.querySelectorAll(".btn-type").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Убираем активный класс со всех кнопок
      document
        .querySelectorAll(".btn-type")
        .forEach((b) => b.classList.remove("active"));
      // Добавляем активный класс нажатой кнопке
      btn.classList.add("active");
      // Обновляем тип градиента в состоянии
      state.type = btn.dataset.type;

      // Показываем/скрываем элементы управления в зависимости от типа
      directionGroup.classList.toggle("hidden", state.type === "radial");
      radialGroup.classList.toggle("hidden", state.type !== "radial");

      update();
    });
  });

  // === СЛАЙДЕР НАПРАВЛЕНИЯ ===
  directionSlider.addEventListener("input", (e) => {
    state.direction = parseInt(e.target.value);
    directionValue.textContent = state.direction + "°";
    update();
  });

  // === ПРЕСЕТЫ НАПРАВЛЕНИЯ ===
  // Быстрые кнопки для выбора направления (0°, 45°, 90°, 135°, 180°)
  document.querySelectorAll(".btn-preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.direction = parseInt(btn.dataset.dir);
      directionSlider.value = state.direction;
      directionValue.textContent = state.direction + "°";
      update();
    });
  });

  // === ВЫБОР ФОРМЫ РАДИАЛЬНОГО ГРАДИЕНТА ===
  document.querySelectorAll(".btn-shape").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-shape")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.radialShape = btn.dataset.shape;
      update();
    });
  });

  // === ДОБАВЛЕНИЕ НОВОГО ЦВЕТА ===
  addColorBtn.addEventListener("click", () => {
    // Ограничение: максимум 8 цветовых точек
    if (state.colorStops.length >= 8) return;

    const lastPos = state.colorStops[state.colorStops.length - 1].position;
    const newPos = Math.min(100, lastPos);

    // Генерация случайного цвета
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215) // Случайное число от 0 до 16777215
        .toString(16)
        .padStart(6, "0"); // Дополняем до 6 символов

    // Добавляем новую точку
    state.colorStops.push({ color: randomColor, position: newPos });

    // Перераспределяем позиции равномерно между всеми точками
    state.colorStops.forEach((s, i) => {
      s.position = Math.round((i / (state.colorStops.length - 1)) * 100);
    });

    renderColorStops();
    update();
  });

  // === ВКЛЮЧЕНИЕ/ВЫКЛЮЧЕНИЕ АНИМАЦИИ ===
  animateBtn.addEventListener("click", () => {
    isAnimated = !isAnimated; // Переключаем состояние
    animateBtn.classList.toggle("active", isAnimated);
    animateBtn.textContent = isAnimated ? "⏹ Остановить" : "▶ Анимировать";
    animationSettings.classList.toggle("hidden", !isAnimated);

    if (isAnimated) {
      preview.classList.add("animated");
      preview.classList.remove("shift", "rotate", "hue");
      preview.classList.add(animType); // Добавляем класс анимации
      preview.style.animationDuration = animSpeed.value + "s";
      preview.style.animationTimingFunction = animEase;
    } else {
      preview.classList.remove("animated", "shift", "rotate", "hue");
    }
    update();
  });

  // === СКОРОСТЬ АНИМАЦИИ ===
  animSpeed.addEventListener("input", (e) => {
    const speed = e.target.value;
    speedValue.textContent = speed + "s";
    preview.style.animationDuration = speed + "s";
    update();
  });

  // === КНОПКИ ТИПА АНИМАЦИИ ===
  document.querySelectorAll(".btn-anim-type").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-anim-type")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      animType = btn.dataset.anim;
      preview.classList.remove("shift", "rotate", "hue");
      preview.classList.add(animType);
      update();
    });
  });

  // === КНОПКИ ФУНКЦИИ ПЛАВНОСТИ ===
  // ease, linear, ease-in, ease-out, ease-in-out
  document.querySelectorAll(".btn-ease").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".btn-ease")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      animEase = btn.dataset.ease;
      preview.style.animationTimingFunction = animEase;
      update();
    });
  });

  // === КОПИРОВАНИЕ CSS В БУФЕР ОБМЕНА ===
  copyBtn.addEventListener("click", () => {
    let css;
    const gradient = generateGradientCSS();

    // Формируем CSS с анимацией или без
    if (isAnimated) {
      let animName = "gradient-shift";
      let bgSize = "400% 400%";
      let keyframes = "";

      if (animType === "rotate") {
        animName = "gradient-rotate";
        bgSize = "100% 100%";
      } else if (animType === "hue") {
        animName = "gradient-hue";
        bgSize = "100% 100%";
      }

      const animDuration = animSpeed.value + "s";

      // Генерация ключевых кадров
      if (animType === "shift") {
        keyframes = `@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;
      } else if (animType === "rotate") {
        keyframes = `@keyframes gradient-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
      } else if (animType === "hue") {
        keyframes = `@keyframes gradient-hue {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}`;
      }

      css = `background-image: ${gradient};
background-size: ${bgSize};
animation: ${animName} ${animDuration} ${animEase} infinite;

${keyframes}`;
    } else {
      css = `background-image: ${gradient};`;
    }

    // Пытаемся скопировать через Clipboard API
    navigator.clipboard
      .writeText(css)
      .then(() => {
        showToast("Скопировано в буфер обмена!");
      })
      .catch(() => {
        // Запасной вариант для старых браузеров
        const ta = document.createElement("textarea");
        ta.value = css;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast("Скопировано!");
      });
  });

  // === ВСПЛЫВАЮЩЕЕ УВЕДОМЛЕНИЕ (TOAST) ===
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    // Скрываем уведомление через 2 секунды
    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  // === СКАЧИВАНИЕ ФАЙЛА ===
  // Универсальная функция для скачивания файлов
  function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/css" }); // Создаём Blob из контента
    const url = URL.createObjectURL(blob); // Создаём URL для Blob
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // Имя файла при скачивании
    a.click();
    URL.revokeObjectURL(url); // Очищаем память
  }

  // === ЭКСПОРТ В CSS ФАЙЛ ===
  exportCssBtn.addEventListener("click", () => {
    const gradient = generateGradientCSS();
    // Формируем CSS с комментарием и датой
    let css = `/* Generated by CSS Gradient Generator */
/* ${new Date().toLocaleDateString("ru-RU")} */

.gradient {
    background-image: ${gradient};
}`;

    // Добавляем стили анимации если она включена
    if (isAnimated) {
      let animName = "gradient-shift";
      let bgSize = "400% 400%";

      if (animType === "rotate") {
        animName = "gradient-rotate";
        bgSize = "100% 100%";
      } else if (animType === "hue") {
        animName = "gradient-hue";
        bgSize = "100% 100%";
      }

      const animDuration = animSpeed.value + "s";
      css += `\n    background-size: ${bgSize};\n    animation: ${animName} ${animDuration} ${animEase} infinite;`;
    }

    css += "\n}";

    // Добавляем keyframes для анимации
    if (isAnimated) {
      let keyframes = "";
      if (animType === "shift") {
        keyframes = `@keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}`;
      } else if (animType === "rotate") {
        keyframes = `@keyframes gradient-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}`;
      } else if (animType === "hue") {
        keyframes = `@keyframes gradient-hue {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}`;
      }

      if (keyframes) {
        css += `\n\n${keyframes}`;
      }
    }

    downloadFile("gradient.css", css);
    showToast("CSS файл скачан!");
  });

  // === ЭКСПОРТ ДЛЯ TAILWIND CSS ===
  exportTailwindBtn.addEventListener("click", () => {
    const gradient = generateGradientCSS();
    const colors = state.colorStops.map((s) => s.color);
    const colorStopsStr = colors.join(", ");

    // Определяем направление в зависимости от типа градиента
    let direction;
    if (state.type === "linear") {
      direction = `${state.direction}deg`;
    } else if (state.type === "radial") {
      direction = "circle";
    } else {
      direction = `from-${state.direction}deg`;
    }

    // Генерируем конфигурацию для Tailwind
    const css = `/* Tailwind CSS Gradient Plugin */
/* ${new Date().toLocaleDateString("ru-RU")} */

// Add to tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'gradient-${state.type}': 'linear-gradient(${direction}, ${colorStopsStr})',
      }
    }
  }
}

// Or use arbitrary values
<div class="bg-[linear-gradient(${direction},${colorStopsStr})]">

// CSS output:
background-image: ${gradient};`;

    downloadFile("tailwind-gradient.css", css);
    showToast("Tailwind конфиг скачан!");
  });

  // === ЭКСПОРТ ГОТОВЫХ CSS КЛАССОВ ===
  // Создаёт набор готовых классов для разных применений
  exportClassBtn.addEventListener("click", () => {
    const gradient = generateGradientCSS();
    const css = `/* Generated by CSS Gradient Generator */
/* ${new Date().toLocaleDateString("ru-RU")} */

.gradient-bg {
    background-image: ${gradient};
    min-height: 100vh;
}

.gradient-text {
    background-image: ${gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.gradient-border {
    border: 3px solid transparent;
    background-image: linear-gradient(white, white), ${gradient};
    background-origin: border-box;
    background-clip: padding-box, border-box;
}

.gradient-button {
    background-image: ${gradient};
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: opacity 0.2s;
}

.gradient-button:hover {
    opacity: 0.9;
}
`;
    downloadFile("gradient-classes.css", css);
    showToast("CSS классы скачаны!");
  });

  // === ЭКСПОРТ В PNG ИЗОБРАЖЕНИЕ ===
  exportPngBtn.addEventListener("click", () => {
    // Создаём canvas для рендеринга градиента
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = 1920; // Ширина изображения
    const height = 1080; // Высота изображения
    canvas.width = width;
    canvas.height = height;

    // Создаём градиент в зависимости от типа
    let gradientObj;
    if (state.type === "linear") {
      // Вычисляем координаты для линейного градиента с учётом угла
      const angle = ((state.direction - 90) * Math.PI) / 180;
      const x1 = width / 2 - Math.cos(angle) * width;
      const y1 = height / 2 - Math.sin(angle) * height;
      const x2 = width / 2 + Math.cos(angle) * width;
      const y2 = height / 2 + Math.sin(angle) * height;
      gradientObj = ctx.createLinearGradient(x1, y1, x2, y2);
    } else if (state.type === "radial") {
      // Радиальный градиент из центра
      gradientObj = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 2,
      );
    } else {
      // Конический - приближаем радиальным для canvas
      gradientObj = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 2,
      );
    }

    // Добавляем цветовые точки на canvas
    state.colorStops.forEach((stop) => {
      gradientObj.addColorStop(stop.position / 100, stop.color);
    });

    // Рисуем градиент на всём canvas
    ctx.fillStyle = gradientObj;
    ctx.fillRect(0, 0, width, height);

    // Конвертируем в Blob и скачиваем
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "gradient.png";
      a.click();
      URL.revokeObjectURL(url);
      showToast("PNG изображение скачано!");
    });
  });

  // === ИНИЦИАЛИЗАЦИЯ ===
  // Запускаем приложение - рисуем элементы и обновляем превью
  renderColorStops(); // Рисуем цветовые точки
  renderPresets(); // Рисуем пресеты
  update(); // Первоначальное обновление превью
})();
