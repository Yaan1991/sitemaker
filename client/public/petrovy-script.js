// Конфигурация
const speed = 1; // Скорость движения (пиксели за кадр)
const imageUrls = [
    '/images/petrovy1.webp',
    '/images/petrovy2.webp', 
    '/images/petrovy3.webp',
    '/images/petrovy4.webp',
    '/images/petrovy5.webp',
    '/images/petrovy6.webp',
    '/images/petrovy7.webp'
];

// Получение canvas и контекста
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

// Переменные для анимации
let images = [];
let currentImageIndex = 0;
let nextImageIndex = 1;
let imageX = 0;
let canvasWidth, canvasHeight;
let imageWidth = 0;

// Загрузка изображений
function loadImages() {
    return Promise.all(imageUrls.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }));
}

// Изменение размера canvas
function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

// Расчет размеров изображения с сохранением пропорций
function calculateImageSize(img) {
    const aspectRatio = img.width / img.height;
    const height = canvasHeight;
    const width = height * aspectRatio;
    return { width, height };
}

// Отрисовка изображения
function drawImage(img, x) {
    const { width, height } = calculateImageSize(img);
    ctx.drawImage(img, x, 0, width, height);
    return { width, height };
}

// Основной цикл анимации
function animate() {
    // Очистка canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    if (images.length > 0) {
        const currentImg = images[currentImageIndex];
        const nextImg = images[nextImageIndex];
        
        // Получаем размеры текущего изображения
        const { width, height } = calculateImageSize(currentImg);
        imageWidth = width;
        
        // Рисуем текущее изображение
        drawImage(currentImg, imageX);
        
        // Рисуем следующее изображение справа от текущего
        drawImage(nextImg, imageX + width);
        
        // Если текущее изображение частично ушло за левый край, рисуем его справа
        if (imageX < 0) {
            drawImage(currentImg, imageX + width);
        }
        
        // Движение изображений слева направо
        imageX -= speed;
        
        // Когда текущее изображение полностью ушло за левый край экрана
        if (imageX <= -width) {
            imageX = 0;
            currentImageIndex = nextImageIndex;
            nextImageIndex = (nextImageIndex + 1) % images.length;
        }
    }
    
    requestAnimationFrame(animate);
}

// Обработчик изменения размера окна
window.addEventListener('resize', resizeCanvas);

// Инициализация
async function init() {
    try {
        resizeCanvas();
        images = await loadImages();
        animate();
    } catch (error) {
        console.error('Ошибка загрузки изображений:', error);
    }
}

// Запуск
init();