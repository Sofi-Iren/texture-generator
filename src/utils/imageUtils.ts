//Анализ фото, извлечение цветов
import { type RGB } from "../types";

export const extractDominantColors = ( imageData: ImageData,  colorCount: number = 5): RGB[] => {
  const pixels = imageData.data;
  const colorMap = new Map<string, number>();
  
  // Простейший алгоритм: группируем похожие цвета
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    //const key = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
    //colorMap.set(key, (colorMap.get(key) || 0) + 1);
     // Пропускаем слишком тёмные (близкие к чёрному)
    if (r < 30 && g < 30 && b < 30) continue;
    
    // Пропускаем слишком светлые (близкие к белому)
    if (r > 230 && g > 230 && b > 230) continue;
    
    // Увеличиваем вес насыщенных цветов
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);
    const weight = 1 + saturation / 100; // Насыщенные цвета весят больше
    
    const key = `${Math.round(r / 15) * 15},${Math.round(g / 15) * 15},${Math.round(b / 15) * 15}`;
    colorMap.set(key, (colorMap.get(key) || 0) + weight);
  }
  
  // Берём топ-N самых частых цветов
  return Array.from(colorMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, colorCount)
    .map(([key]) => key.split(',').map(Number) as RGB);
};