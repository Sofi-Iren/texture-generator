//Отображение палитры
import { type RGB } from '../../types';
import styles from './ColorPalette.module.css';

interface ColorPaletteProps {
    colors: RGB[]; // Массив цветов [R,G,B]
    orientation?: string;
}

const ColorPalette = ({ colors, orientation = 'horizontal' }: ColorPaletteProps) => {
  const isHorizontal = orientation === 'horizontal';
  return (
      <div style={{
          display: 'flex',
          gap: '8px',
          marginTop: '64px', 
          flexDirection: isHorizontal ? 'row' : 'column',
          flexWrap: isHorizontal ? 'wrap' : 'nowrap',
          justifyContent: 'center'
      }}>
      {colors.map((color, idx) => (
          <div
              key={idx} className={ styles.colorItem}
              style={{
                  backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
              }}
          title={`RGB: ${color.join(', ')}`}
        />
      ))}
    </div>
  );
};

export default ColorPalette;