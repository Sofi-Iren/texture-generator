import styles from './Slider.module.css';
import { useRef, useEffect, useState} from 'react';

interface SliderProps {
    min: number;
    max: number;
    step: number;
    value: number;
    title: string;
    handler: (value: number) => void;
    debounce: number;
    [key: string]: unknown;
}

export const Slider = ({ handler, value, title, min, max, step, debounce, ...rest }: SliderProps) => {
    const timeout = useRef<number | string | NodeJS.Timeout | undefined>(null);
    const [localValue, setLocalValue] = useState(value);
        
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        setLocalValue(newValue);

        if (!handler) {
            return;
        }        
        if (debounce) {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            timeout.current = setTimeout(() => handler(newValue), debounce);
        } else {
            handler(newValue);
        }
    };

    useEffect(() => {
        return () => {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        }
    }, []);

    return (
        <div className={styles.controlGroup}>
            <label>{title}: {localValue}</label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={localValue}
                onChange={changeHandler}
                className={styles.slider}
                {...rest}
            />
        </div>);
};