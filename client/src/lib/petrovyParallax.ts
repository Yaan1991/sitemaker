/**
 * Параллакс-анимация фона для страницы спектакля «Петровы в гриппе и вокруг него».
 * Загружает 7 webp-картинок и пускает их бесконечной горизонтальной лентой
 * через Canvas с requestAnimationFrame.
 *
 * Возвращает cleanup-функцию, которую нужно вызвать при размонтировании,
 * чтобы остановить анимацию и снять обработчик resize.
 */
export function initParallaxBackground(canvasId: string): () => void {
  // Уважаем системную настройку: пользователи с prefers-reduced-motion
  // получают статичный фон вместо движущейся ленты.
  if (typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  // Защита от повторной инициализации (один canvas на страницу)
  if ((window as any).isCanvasInitialized) return () => {};

  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return () => {};

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  (window as any).isCanvasInitialized = true;

  let animationFrameId: number | null = null;

  const imageUrls = [
    '/images/petrovy2.webp',
    '/images/petrovy1.webp',
    '/images/petrovy5.webp',
    '/images/petrovy3.webp',
    '/images/petrovy6.webp',
    '/images/petrovy4.webp',
    '/images/petrovy7.webp'
  ];

  const baseSpeed = 2;
  const speed = 0.5;
  const direction = -1;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class ImageStrip {
    images: HTMLImageElement[] = [];
    positions: Array<{ x: number; width: number; imageIndex: number }> = [];
    isLoaded: boolean = false;

    constructor() {
      this.loadImages();
    }

    async loadImages() {
      try {
        this.images = await Promise.all(
          imageUrls.map(url => {
            return new Promise<HTMLImageElement>((resolve, reject) => {
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
        console.error('Ошибка загрузки изображений фона:', error);
      }
    }

    setupPositions() {
      this.positions = [];
      let currentX = canvas.width;

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

      const moveSpeed = baseSpeed * speed * direction;

      this.positions.forEach(pos => {
        pos.x += moveSpeed;
      });

      if (direction === -1) {
        const firstPos = this.positions[0];
        if (firstPos && firstPos.x + firstPos.width < 0) {
          const lastPos = this.positions[this.positions.length - 1];
          firstPos.x = lastPos.x + lastPos.width;
          const removed = this.positions.shift();
          if (removed) this.positions.push(removed);
        }
      }
    }

    draw() {
      if (!this.isLoaded || !ctx) return;

      ctx.globalAlpha = 0.8;

      this.positions.forEach(pos => {
        if (pos.x + pos.width > 0 && pos.x < canvas.width) {
          const img = this.images[pos.imageIndex];
          const height = canvas.height;
          ctx.drawImage(img, pos.x, 0, pos.width, height);
        }
      });

      ctx.globalAlpha = 1.0;
    }
  }

  const imageStrip = new ImageStrip();

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    imageStrip.update();
    imageStrip.draw();
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener("resize", resizeCanvas);
    (window as any).isCanvasInitialized = false;
  };
}
