//Слайдеры параметров
import { type RGB } from '../types';
import { useRef, useEffect, useState } from 'react';
import { genSimpleNoise } from '../utils/noiseGenerator';
interface NoiseTextureProps {
    colors: RGB[];
    width?: string | number;
    height?: string | number;
}

export const NoiseTexture = ({colors, width = 400, height = 300}: NoiseTextureProps) => {
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
                    onClick={handleRegenerate}
                    style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }} >
                    🔄 Перегенерировать текстуру
                </button>
            </div>
        )}
        <canvas ref={canvasRef} width={width} height={height} />
    </>
};