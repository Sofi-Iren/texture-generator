import styles from './Slider.module.css';

interface SliderProps {
    min: number;
    max: number;
    step: number;
    value: number;
    title: string;
    handler: (value: number) => void;
    [key: string]: unknown;
}

export const Slider = ({ handler, value, title, min, max, step, ...rest }: SliderProps) => {

    return (
    <div className={styles.controlGroup}>
        <label>{ title}: {value}</label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => handler(parseFloat(e.target.value))}
            className={styles.slider}
            {...rest} 
        />
    </div>);
};