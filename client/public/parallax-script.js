// ========== НАСТРОЙКИ ==========
// Изображения с номерами (petrovy1 = 0, petrovy7 = 6)
const imageUrls = [
    '/images/petrovy1.webp', // 0
    '/images/petrovy2.webp', // 1
    '/images/petrovy3.webp', // 2
    '/images/petrovy4.webp', // 3
    '/images/petrovy5.webp', // 4
    '/images/petrovy6.webp', // 5
    '/images/petrovy7.webp'  // 6
];

// Последовательность показа: 0; 2; 4; 1; 5; 3; 6
const sequence = [0, 2, 4, 1, 5, 3, 6];

const layers = [
    {
        images: sequence.map(index => imageUrls[index]),
        speed: 0.5, // плавная скорость
        opacity: 1.0 // полная непрозрачность
    }
];

const baseSpeed = 2; // базовая скорость в пикселях за кадр
const direction = -1; // направление: -1 = справа налево, 1 = слева направо

// ========== ОСНОВНОЙ КОД ==========
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

// Адаптивный размер canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Класс для управления одним слоем
class ParallaxLayer {
    constructor(imageUrls, speed, opacity) {
        this.imageUrls = imageUrls;
        this.speed = speed;
        this.opacity = opacity;
        this.images = [];
        this.currentImageIndex = 0;
        this.nextImageIndex = 1;
        this.x1 = 0;
        this.x2 = 0;
        this.imageWidth = 0;
        this.isLoaded = false;
        
        this.loadImages();
    }
    
    async loadImages() {
        try {
            this.images = await Promise.all(
                this.imageUrls.map(url => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                        img.src = url;
                    });
                })
            );
            this.setupInitialPositions();
            this.isLoaded = true;
        } catch (error) {
            console.error('Ошибка загрузки изображений слоя:', error);
        }
    }
    
    setupInitialPositions() {
        if (this.images.length > 0) {
            const img = this.images[this.currentImageIndex];
            const scale = canvas.height / img.height;
            this.imageWidth = img.width * scale;
            this.x1 = 0;
            this.x2 = this.imageWidth;
        }
    }
    
    update() {
        if (!this.isLoaded || this.images.length === 0) return;
        
        const currentSpeed = baseSpeed * this.speed * direction;
        this.x1 += currentSpeed;
        this.x2 += currentSpeed;
        
        // Проверяем, нужно ли переставить изображения
        if (direction === -1) { // движение справа налево
            if (this.x1 <= -this.imageWidth) {
                this.x1 = this.x2 + this.imageWidth;
                this.switchToNextImage();
            }
            if (this.x2 <= -this.imageWidth) {
                this.x2 = this.x1 + this.imageWidth;
                this.switchToNextImage();
            }
        } else { // движение слева направо
            if (this.x1 >= canvas.width) {
                this.x1 = this.x2 - this.imageWidth;
                this.switchToNextImage();
            }
            if (this.x2 >= canvas.width) {
                this.x2 = this.x1 - this.imageWidth;
                this.switchToNextImage();
            }
        }
    }
    
    switchToNextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.nextImageIndex = (this.currentImageIndex + 1) % this.images.length;
        
        // Обновляем ширину для нового изображения
        const img = this.images[this.currentImageIndex];
        const scale = canvas.height / img.height;
        this.imageWidth = img.width * scale;
    }
    
    draw() {
        if (!this.isLoaded || this.images.length === 0) return;
        
        const currentImg = this.images[this.currentImageIndex];
        const nextImg = this.images[this.nextImageIndex];
        
        // Устанавливаем прозрачность слоя
        ctx.globalAlpha = this.opacity;
        
        // Рисуем текущие изображения
        const scale = canvas.height / currentImg.height;
        const imgWidth = currentImg.width * scale;
        const imgHeight = canvas.height;
        
        ctx.drawImage(currentImg, this.x1, 0, imgWidth, imgHeight);
        ctx.drawImage(nextImg, this.x2, 0, imgWidth, imgHeight);
        
        // Дополнительные копии для полного покрытия экрана
        if (direction === -1) {
            // Справа налево - добавляем копии справа
            if (this.x2 + imgWidth < canvas.width) {
                ctx.drawImage(currentImg, this.x2 + imgWidth, 0, imgWidth, imgHeight);
            }
        } else {
            // Слева направо - добавляем копии слева
            if (this.x1 - imgWidth > 0) {
                ctx.drawImage(currentImg, this.x1 - imgWidth, 0, imgWidth, imgHeight);
            }
        }
        
        // Сбрасываем прозрачность
        ctx.globalAlpha = 1.0;
    }
}

// Создаем слои
const parallaxLayers = layers.map(layer => 
    new ParallaxLayer(layer.images, layer.speed, layer.opacity)
);

// Основной цикл анимации
function animate() {
    // Очищаем canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Обновляем и рисуем каждый слой (от дальнего к ближнему)
    parallaxLayers.forEach(layer => {
        layer.update();
        layer.draw();
    });
    
    requestAnimationFrame(animate);
}

// Запуск анимации
animate();