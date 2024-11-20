export interface Point {
  x: number;
  y: number;
}

export interface StrokeStyle {
  color: string;
  width: number;
}

export interface DrawingData {
  points: Point[];
  style: StrokeStyle;
}
