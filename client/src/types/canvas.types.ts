export interface CanvasStore {
  canDrawing: boolean;
  action: {
    setCanDrawing: (canDrawing: boolean) => void;
  };
}

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}
