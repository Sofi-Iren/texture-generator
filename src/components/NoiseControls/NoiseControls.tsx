//Слайдеры параметров
import { type RGB } from '../../types';
import { useRef, useEffect, useState } from 'react';
import { genSimpleNoise, generatePerlinTexture } from '../../utils/noiseGenerator';
import styles from './NoiseControls.module.css';
interface NoiseTextureProps {
    colors: RGB[];
    width?: string | number;
    height?: string | number;
    size?: string | number;
}

export const NoiseTexture = ({ colors, width = 400, height = 300, size = 400 }: NoiseTextureProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [textureSeed, setTextureSeed] = useState<number>(() => Date.now());
    const [pointCount, setPointCount] = useState<number>(10000);
    const [perlin, setPerlin] = useState<boolean>(true);
    const [scale, setScale] = useState<number>(0.1);

    const handleRegenerate = () => {
        setTextureSeed(Date.now()); // Новое зерно = новая текстура
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.download = 'texture.png'; // имя файла
        link.href = canvas.toDataURL('image/png'); // конвертируем canvas в data URL
        link.click(); // программный клик для скачивания 
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (perlin) {
            generatePerlinTexture(canvas, colors, scale);
        } else {
            genSimpleNoise(canvas, colors, textureSeed, pointCount);
        }
    }, [colors, textureSeed, width, height, pointCount, perlin, scale]);

    return <>
        {colors.length > 0 && (
            <div className={styles.buttonGroup} >
                <label className='customButton' onClick={handleSave}>
                    Сохранить
                </label>
                <label className='customButton' onClick={handleRegenerate}>
                    Перегенерировать
                </label>
                {!perlin ? (
                    <div className={styles.controlGroup}>
                        <label>Количество точек: {pointCount}</label>
                        <input
                            type="range"
                            min={1}
                            max={50000}
                            step={25}
                            value={pointCount}
                            onChange={(e) => setPointCount(parseInt(e.target.value))}
                            className={styles.slider}
                        />
                    </div>
                ) : (
                    <div className={styles.controlGroup}>
                        <label>Масштаб шума: {scale}</label>
                        <input
                            type="range"
                            min={0.01}
                            max={0.5}
                            step={0.01}
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className={styles.slider}
                        />
                    </div>
                )}
                <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={perlin}
                            onChange={(e) => setPerlin(e.target.checked)}
                        />
                         Перлин
                    </label>
                </div>
            </div>
        )}
        <div className={styles.canvasWrapper} >
            <canvas className={styles.canvas} ref={canvasRef} width={size} height={size} style={{
                maxWidth: width,
                maxHeight: height,
            }} />
        </div>
    </>
};