import { useState, useEffect} from 'react';
import './App.css';
import styles from './App.module.css';
import { type RGB, type LayoutProps } from './types';
import ColorPalette from './components/ColorPalette/ColorPalette.tsx';
import { ImageUploader } from './components/ImageUploader/ImageUploader.tsx';
import { NoiseTexture } from './components/NoiseControls/NoiseControls.tsx';
import { useMediaQuery } from './hooks/useMediaQuery.tsx';

function App() {

    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [colors, setColors] = useState<RGB[]>([]);
    const [layout, setLayout] = useState<LayoutProps>({
        photoWidth: 400,
        photoHeight: 400,
        paletteOrientation: 'horizontal' as const,
        canvasSize: 1000,
        spacing: 20,
        canvasWidth: 400,
        canvasHeight: 400,
    });

    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (isMobile) {
            //Layout does not depend on isMobile => not a problem for loop 
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLayout((prev: LayoutProps) => ({
                ...prev,
                photoWidth: '100%',
                photoHeight: 'calc(50vh - 170px)',
                paletteOrientation: 'horizontal',
                //canvasSize: 500,
                canvasWidth: '100%',
                canvasHeight: 'auto',
            }));
        } else {
            setLayout((prev: LayoutProps) => ({
                ...prev,
                photoWidth: '40vw',
                photoHeight: '50vh',
                paletteOrientation: 'vertical',
                //canvasSize: 500,
                canvasWidth: '40vw',
                canvasHeight: '50vh',
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
                                size={layout.canvasSize }
                                width={layout.canvasWidth}
                                height={layout.canvasHeight} />
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}

export default App

