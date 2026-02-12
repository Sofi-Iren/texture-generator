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

// Класс для генерации Perlin шума
class PerlinNoise {
    private p: number[] = [];
    private permutation: number[] = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30,
        69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62,
        94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136,
        171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229,
        122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
        63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116,
        188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202,
        38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43,
        172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
        246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145,
        235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115,
        121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141,
        128, 195, 78, 66, 215, 61, 156, 180];

    constructor(seed?: number) {   
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const me = this;

        // Перемешиваем с seed если нужно
        if (seed) {
            const seededRandom = (max: number) => {
                seed = (seed * 9301 + 49297) % 233280;
                return Math.floor((seed / 233280) * max);
            };

            for (let i = 0; i < me.permutation.length; i++) {
                const j = seededRandom(me.permutation.length);
                [me.permutation[i], me.permutation[j]] = [me.permutation[j], me.permutation[i]];
            }
        }

        // Дублируем массив для избежания переполнения
        this.p = [...me.permutation, ...me.permutation];
    }

    // Функция шума для 2D
    noise2D(x: number, y: number): number {
        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;

        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);

        const u = this.fade(xf);
        const v = this.fade(yf);

        const aaa = this.p[this.p[xi] + yi];
        const aba = this.p[this.p[xi] + yi + 1];
        const aab = this.p[this.p[xi + 1] + yi];
        const abb = this.p[this.p[xi + 1] + yi + 1];

        const x1 = this.lerp(u, this.grad(aaa, xf, yf), this.grad(aab, xf - 1, yf));
        const x2 = this.lerp(u, this.grad(aba, xf, yf - 1), this.grad(abb, xf - 1, yf - 1));

        return (this.lerp(v, x1, x2) + 1) / 2; // Возвращает значение 0-1
    }

    // Функция плавного перехода
    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    // Линейная интерполяция
    private lerp(t: number, a: number, b: number): number {
        return a + t * (b - a);
    }

    // Градиентная функция
    private grad(hash: number, x: number, y: number): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : y;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    // Octave Perlin (наложение слоев)
    octaveNoise2D(x: number, y: number, octaves: number, persistence: number): number {
        let amplitude = 1;
        let frequency = 1;
        let noiseValue = 0;
        let maxAmplitude = 0;

        for (let i = 0; i < octaves; i++) {
            noiseValue += this.noise2D(x * frequency, y * frequency) * amplitude;
            maxAmplitude += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return noiseValue / maxAmplitude;
    }
}

// Генерация шума с палитрой из ваших цветов
export const generatePerlinTexture = (
    canvas: HTMLCanvasElement | null, 
    colors: RGB[],    
    scale: number = 0.1
) => {
    if (!canvas || colors.length === 0) return;
    const width: number = canvas.width;
    const height: number = canvas.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    const noise = new PerlinNoise();
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Генерируем шум для каждой точки (0-1)
            const nx = x * scale;
            const ny = y * scale;

            // Можно использовать одно или несколько значений
            const value = noise.octaveNoise2D(nx, ny, 4, 0.5);

            const idx = (y * width + x) * 4;

            // ИНТЕРПОЛЯЦИЯ МЕЖДУ ВСЕМИ ЦВЕТАМИ ПАЛИТРЫ
            if (colors.length === 0) {
                // Градации серого
                const gray = Math.floor(value * 255);
                data[idx] = gray;
                data[idx + 1] = gray;
                data[idx + 2] = gray;
            } else if (colors.length === 1) {
                // Монохром
                const color = colors[0];
                data[idx] = color[0] * value;
                data[idx + 1] = color[1] * value;
                data[idx + 2] = color[2]* value;
            } else {
                // Множественная интерполяция между всеми цветами
                const segment = value * (colors.length - 1);
                const index = Math.floor(segment);
                const t = segment - index;

                const color1 = colors[index];
                const color2 = colors[Math.min(index + 1, colors.length - 1)];

                data[idx] = color1[0]* (1 - t) + color2[0] * t;
                data[idx + 1] = color1[1] * (1 - t) + color2[1] * t;
                data[idx + 2] = color1[2] * (1 - t) + color2[2] * t;
            }

            data[idx + 3] = 255;
        }
    }


    ctx.putImageData(imageData, 0, 0);
};

export const generatePerlinTextureRGB = (
    canvas: HTMLCanvasElement | null,
    colors: RGB[],
    scale: number = 0.1
) => {
    if (!canvas || colors.length === 0) return;
    const width: number = canvas.width;
    const height: number = canvas.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    const noise = new PerlinNoise();
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // Три независимых канала с разными частотами
            const r_val = noise.octaveNoise2D(x * scale * 1.0, y * scale * 1.0, 4, 0.5);
            const g_val = noise.octaveNoise2D(x * scale * 1.3, y * scale * 1.3, 4, 0.5);
            const b_val = noise.octaveNoise2D(x * scale * 1.7, y * scale * 1.7, 4, 0.5);

            if (colors.length === 0) {
                data[idx] = r_val * 255;
                data[idx + 1] = g_val * 255;
                data[idx + 2] = b_val * 255;
            } else {
                // Интерполяция для каждого канала
                const getColor = (val: number, channelIndex: 0 | 1 | 2) => {
                    const segment = val * (colors.length - 1);
                    const index = Math.floor(segment);
                    const t = segment - index;

                    const c1 = colors[index];
                    const c2 = colors[Math.min(index + 1, colors.length - 1)];

                    return c1[channelIndex] * (1 - t) + c2[channelIndex] * t;
                };

                data[idx] = getColor(r_val, 0);
                data[idx + 1] = getColor(g_val, 1);
                data[idx + 2] = getColor(b_val, 2);
            }

            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
};

export const generatePerlinTextureZones = (
    canvas: HTMLCanvasElement | null,
    colors: RGB[],
    scale: number = 0.1
) => {
    if (!canvas || colors.length === 0) return;
    const width: number = canvas.width;
    const height: number = canvas.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    const noise = new PerlinNoise();
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            const value = noise.octaveNoise2D(x * scale, y * scale, 4, 0.5);

            // Дискретные зоны — каждый пиксель получает один цвет из палитры
            const colorIndex = Math.floor(value * colors.length);
            const color = colors[Math.min(colorIndex, colors.length - 1)];

            data[idx] = color[0];
            data[idx + 1] = color[1];
            data[idx + 2] = color[2];
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
};