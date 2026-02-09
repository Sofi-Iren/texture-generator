//Отображение палитры
import { type RGB } from '../types'; 

interface ColorPaletteProps {
  colors: RGB[]; // Массив цветов [R,G,B]
}

const ColorPalette = ({ colors} : ColorPaletteProps ) => {
  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
      {colors.map((color, idx) => (
        <div
          key={idx}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          title={`RGB: ${color.join(', ')}`}
        />
      ))}
    </div>
  );
};

export default ColorPalette;