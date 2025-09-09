const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Массив изображений Петровых
const imageUrls = [
  '/images/petrovy1.webp',
  '/images/petrovy2.webp', 
  '/images/petrovy3.webp',
  '/images/petrovy4.webp',
  '/images/petrovy5.webp',
  '/images/petrovy6.webp',
  '/images/petrovy7.webp'
];

let currentImageIndex = 0;
let x1 = 0;
let x2;
const speed = 1; // скорость движения
const imageDuration = 5000; // длительность показа одного изображения в мс

function loadAndStartAnimation() {
  const img = new Image();
  img.src = imageUrls[currentImageIndex];

  img.onload = () => {
    const scale = canvas.height / img.height;
    const imgWidth = img.width * scale;
    x2 = imgWidth; // вторая картинка сразу за первой

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // рисуем две копии подряд
      ctx.drawImage(img, x1, 0, imgWidth, canvas.height);
      ctx.drawImage(img, x2, 0, imgWidth, canvas.height);

      // сдвигаем их
      x1 -= speed;
      x2 -= speed;

      // если картинка ушла за левый край, переносим её вправо
      if (x1 <= -imgWidth) {
        x1 = x2 + imgWidth;
      }
      if (x2 <= -imgWidth) {
        x2 = x1 + imgWidth;
      }

      requestAnimationFrame(draw);
    }
    draw();

    // Переключение на следующее изображение через заданное время
    setTimeout(() => {
      currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
      x1 = 0; // сброс позиций
      loadAndStartAnimation(); // загрузка следующего изображения
    }, imageDuration);
  };

  img.onerror = () => {
    console.error('Ошибка загрузки изображения:', imageUrls[currentImageIndex]);
    // Переход к следующему изображению при ошибке
    currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
    loadAndStartAnimation();
  };
}

// Запуск анимации
loadAndStartAnimation();