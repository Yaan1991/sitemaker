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
let imageX = 0;
let canvasWidth, canvasHeight;

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
    
    // Рисуем основное изображение
    ctx.drawImage(img, x, 0, width, height);
    
    // Рисуем копию справа для бесшовности
    if (x + width < canvasWidth) {
        ctx.drawImage(img, x + width, 0, width, height);
    }
    
    // Рисуем копию слева для бесшовности
    if (x > 0) {
        ctx.drawImage(img, x - width, 0, width, height);
    }
}

// Основной цикл анимации
function animate() {
    // Очистка canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    if (images.length > 0) {
        const currentImg = images[currentImageIndex];
        const { width } = calculateImageSize(currentImg);
        
        // Отрисовка текущего изображения
        drawImage(currentImg, imageX);
        
        // Движение изображения слева направо
        imageX += speed;
        
        // Когда изображение полностью прошло экран, переключаемся на следующее
        if (imageX >= width) {
            imageX = 0;
            currentImageIndex = (currentImageIndex + 1) % images.length;
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