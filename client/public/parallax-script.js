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

// Последовательность показа: 1; 0; 4; 2; 5; 3; 6
const sequence = [1, 0, 4, 2, 5, 3, 6];

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

// Класс для управления лентой изображений
class ImageStrip {
    constructor(imageUrls, speed, opacity) {
        this.imageUrls = imageUrls;
        this.speed = speed;
        this.opacity = opacity;
        this.images = [];
        this.positions = [];
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
            this.setupPositions();
            this.isLoaded = true;
        } catch (error) {
            console.error('Ошибка загрузки изображений:', error);
        }
    }
    
    setupPositions() {
        this.positions = [];
        let currentX = 0;
        
        // Создаем позиции для всех изображений в последовательности
        for (let i = 0; i < this.images.length; i++) {
            const img = this.images[i];
            const scale = canvas.height / img.height;
            const width = img.width * scale;
            
            this.positions.push({
                x: currentX,
                width: width,
                imageIndex: i
            });
            
            currentX += width;
        }
    }
    
    update() {
        if (!this.isLoaded) return;
        
        const moveSpeed = baseSpeed * this.speed * direction;
        
        // Двигаем все позиции
        this.positions.forEach(pos => {
            pos.x += moveSpeed;
        });
        
        // Если движение справа налево
        if (direction === -1) {
            // Проверяем, не ушло ли изображение за левый край
            const firstPos = this.positions[0];
            if (firstPos.x + firstPos.width < 0) {
                // Перемещаем его в конец ленты
                const lastPos = this.positions[this.positions.length - 1];
                firstPos.x = lastPos.x + lastPos.width;
                
                // Перемещаем в конец массива
                this.positions.push(this.positions.shift());
            }
        } else {
            // Движение слева направо
            const lastPos = this.positions[this.positions.length - 1];
            if (lastPos.x > canvas.width) {
                const firstPos = this.positions[0];
                lastPos.x = firstPos.x - lastPos.width;
                
                // Перемещаем в начало массива
                this.positions.unshift(this.positions.pop());
            }
        }
    }
    
    draw() {
        if (!this.isLoaded) return;
        
        ctx.globalAlpha = this.opacity;
        
        // Рисуем все видимые изображения
        this.positions.forEach(pos => {
            // Рисуем только если изображение видно на экране
            if (pos.x + pos.width > 0 && pos.x < canvas.width) {
                const img = this.images[pos.imageIndex];
                const scale = canvas.height / img.height;
                const height = canvas.height;
                
                ctx.drawImage(img, pos.x, 0, pos.width, height);
            }
        });
        
        ctx.globalAlpha = 1.0;
    }
}

// Создаем ленту изображений
const imageStrip = new ImageStrip(layers[0].images, layers[0].speed, layers[0].opacity);

// Основной цикл анимации
function animate() {
    // Очищаем canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Обновляем и рисуем ленту изображений
    imageStrip.update();
    imageStrip.draw();
    
    requestAnimationFrame(animate);
}

// Запуск анимации
animate();