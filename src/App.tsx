import { useState } from 'react'
import './App.css'
import { type RGB } from './types';
import ColorPalette from './components/ColorPalette.tsx';
import { ImageUploader } from './components/ImageUploader.tsx';
import { NoiseTexture } from './components/NoiseControls.tsx';

function App() {

    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [colors, setColors] = useState<RGB[]>([]);


    const handleImageLoad = (img: HTMLImageElement, extractedColors: RGB[]) => {
        setImage(img);
        setColors(extractedColors);
    };

    return (
        <div className="App">
            <h1>Генератор текстур на основе фото</h1>
            <ImageUploader onImageLoad={handleImageLoad} />

            {image && (
                <div>
                    <h2>Анализ фото</h2>
                    <ColorPalette colors={colors} />

                    <h2>Сгенерированная текстура</h2>
                    <NoiseTexture colors={colors} />
                </div>
            )}
        </div>
    );
}

export default App
