//Типы TypeScript
export type RGB = [number, number, number];

export interface LayoutProps {
	photoWidth?: number | string;   // 400 или "100%"
	photoHeight?: number | string;   // 400 или "100%"
	canvasSize?: number | string;
	paletteOrientation?: 'horizontal' | 'vertical';
	spacing?: number;
}