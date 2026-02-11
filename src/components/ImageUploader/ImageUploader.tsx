//Загрузка фото
import { type RGB } from '../../types';
import styles from './ImageUploader.module.css';
import { useRef, useState, useEffect } from 'react';
import ColorThief from 'colorthief';

interface ImageUploaderProps {
    onImageLoad: (image: HTMLImageElement, colors: RGB[]) => void;
    onError?: (error: string) => void;
    width?: number | string;
    height?: number | string;
}

const errImg = 'Не удалось загрузить изображение';
const errUnknown = 'Неизвестная ошибка';

export const ImageUploader = ({ onImageLoad, width, height, onError }: ImageUploaderProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const objectUrlRef = useRef<string | null>(null);

    // Освобождаем память при размонтировании
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
        };
    }, []);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Освобождаем предыдущую ссылку
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }

        // Создаём новое изображение
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        objectUrlRef.current = objectUrl;
        img.src = objectUrl;
        try {
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => {
                    URL.revokeObjectURL(objectUrl);
                    reject(new Error(errImg));
                };
            });

            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 6); // 6 самых частых цветов
            setPreviewUrl(objectUrl);
            onImageLoad(img, palette);
        } catch (error) {
            // Очищаем ref, так как URL уже освобождён в onerror
            objectUrlRef.current = null;

            // Вызываем onError если он передан
            const errorMessage = error instanceof Error ? error.message : errUnknown;
            onError?.(errorMessage);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
            />
            {previewUrl && (
                <div className={ styles.imgWrapper} >
                    <img
                        className={styles.baseImg }
                        src={previewUrl}
                        alt="Preview"
                        style={{                             
                            maxWidth: width,
                            maxHeight: height
                        }}
                    />
                </div>
            )}
        </div>
    );
};