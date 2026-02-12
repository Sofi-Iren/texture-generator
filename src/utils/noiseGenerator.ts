//Генератор шума (Perlin/Simplex)
import { type RGB } from '../types';

export const genSimpleNoise = (canvas: HTMLCanvasElement | null, colors: RGB[], textureSeed: number, pointCount: number) => {
    if (!canvas || colors.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    // Очищаем canvas
    ctx.clearRect(0, 0, width, height);

    // Используем seed для детерминированного случайного генератора
    const seededRandom = (customSeed?: number) => {
        const s = customSeed ? (customSeed + textureSeed) : textureSeed;
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
    };

    // Генерация текстуры с использованием seed
    for (let i = 0; i < pointCount; i++) {
        const x = seededRandom(i * 7) * width;
        const y = seededRandom(i * 13 + 123) * height;
        const size = seededRandom(i * 3 + 456) * 5 + 1;
        const colorIndex = Math.floor(seededRandom(i * 11) * colors.length);
        const [r, g, b] = colors[colorIndex];

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
};