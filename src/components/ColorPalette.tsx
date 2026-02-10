//Отображение палитры
import { type RGB } from '../types'; 

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