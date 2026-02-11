//Слайдеры параметров
import { type RGB } from '../../types';
import { useRef, useEffect, useState } from 'react';
import { genSimpleNoise } from '../../utils/noiseGenerator';
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

    const handleRegenerate = () => {
        setTextureSeed(Date.now()); // Новое зерно = новая текстура
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        genSimpleNoise(canvas, colors, textureSeed);
    }, [colors, textureSeed, width, height]);

    return <>
        {colors.length > 0 && (
            <div style={{ marginTop: '10px' }}>
                <button
                    className={styles.renderButton}
                    onClick={handleRegenerate} >
                    🔄 Перегенерировать текстуру
                </button>
            </div>
        )}
        <div className={ styles.canvasWrapper} >
            <canvas className={ styles.canvas}  ref={canvasRef} width={size} height={size} style={{
                maxWidth: width,
                maxHeight: height,
            }} />
        </div>
    </>
};