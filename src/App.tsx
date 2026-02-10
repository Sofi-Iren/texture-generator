import { useState, useEffect} from 'react';
import './App.css';
import styles from './App.module.css';
import { type RGB, type LayoutProps } from './types';
import ColorPalette from './components/ColorPalette.tsx';
import { ImageUploader } from './components/ImageUploader.tsx';
import { NoiseTexture } from './components/NoiseControls.tsx';
import { useMediaQuery } from './hooks/useMediaQuery.tsx';

function App() {

    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [colors, setColors] = useState<RGB[]>([]);
    const [layout, setLayout] = useState<LayoutProps>({
        photoWidth: 400,
        photoHeight: 400,
        paletteOrientation: 'horizontal' as const,
        canvasSize: 500,
        spacing: 20,
    });

    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (isMobile) {
            //Layout does not depend on isMobile => not a problem for loop 
            setLayout((prev: LayoutProps) => ({
                ...prev,
                photoWidth: '100%',
                photoHeight: 'calc(50vh - 170px)',
                paletteOrientation: 'horizontal',
                canvasSize: 300,
            }));
        } else {
            setLayout((prev: LayoutProps) => ({
                ...prev,
                photoWidth: '40vw',
                photoHeight: '50vh',
                paletteOrientation: 'vertical',
                canvasSize: 500,
            }));
        }
    }, [isMobile]);


    const handleImageLoad = (img: HTMLImageElement, extractedColors: RGB[]) => {
        setImage(img);
        setColors(extractedColors);
    };

    return (
        <div className={styles.container}>
            <h1>Генератор текстур на основе фото</h1>
            <div className={styles.content}>
                <section className={styles.photoSection}>
                    <ImageUploader onImageLoad={handleImageLoad}
                        width={layout.photoWidth}
                        height={layout.photoHeight}                    />
                </section>

                {image && (
                    <>
                        <section className={styles.palette}>
                            <ColorPalette colors={colors}
                                orientation={layout.paletteOrientation} />
                        </section>
                        <section className={styles.textureSection}>
                            <NoiseTexture colors={colors}
                                width={layout.canvasSize}
                                height={layout.canvasSize} />
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}

export default App

