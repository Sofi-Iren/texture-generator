//Слайдеры параметров
import { type RGB } from '../../types';
import { useRef, useEffect, useState } from 'react';
import { genSimpleNoise, generatePerlinTexture, generatePerlinTextureRGB, generatePerlinTextureZones } from '../../utils/noiseGenerator';
import styles from './NoiseTexture.module.css';
import { Slider } from '../../components/ui';
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
    const [scale, setScale] = useState<number>(0.016);
    const [colorNoise, setColorNoise] = useState<boolean>(false);
    const [zoneNoise, setZoneNoise] = useState<boolean>(false);

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

    const handleZoneNoiseChange = (checked: boolean) => {
        if (checked) {
            setZoneNoise(true);
            setColorNoise(false);
        } else {
            setZoneNoise(false);
        }
    };

    const handleColorNoiseChange = (checked: boolean) => {
        if (checked) {
            setColorNoise(true);
            setZoneNoise(false);
        } else {
            setColorNoise(false);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (perlin) {
            if (colorNoise) {
                generatePerlinTextureRGB(canvas, colors, scale);
            } else if (zoneNoise) {
                generatePerlinTextureZones(canvas, colors, scale);
            } else {
                generatePerlinTexture(canvas, colors, scale);
            }
        } else {
            genSimpleNoise(canvas, colors, textureSeed, pointCount);
        }
    }, [colors, textureSeed, width, height, pointCount, perlin, scale, colorNoise, zoneNoise]);

    return <>
        {colors.length > 0 && (
            <div className={styles.buttonGroup} >
                <label className='customButton' onClick={handleSave}>
                    Сохранить
                </label>                 
                {!perlin ? (
                    <Slider title='Количество точек'
                        key="points"
                        min={1}
                        max={50000}
                        step={25}
                        value={pointCount}
                        handler={setPointCount} />
                ) : (
                    <Slider title='Масштаб шума'
                        key="scale"
                        min={0.001}
                        max={0.1}
                        step={0.001}
                        value={scale}
                        handler={setScale}
                    />
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
                <div className={`${styles.checkboxGroup} ${!perlin ? styles.disabled : ''}`}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={colorNoise}
                            onChange={(e) => handleColorNoiseChange(e.target.checked)}
                        />
                        Каналы
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={zoneNoise}
                            onChange={(e) => handleZoneNoiseChange(e.target.checked)}
                        />
                        Зоны
                    </label>
                </div>
                <label className={`customButton  ${perlin ? styles.disabled : ''}`} onClick={handleRegenerate} >
                    Перегенерировать
                </label>
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