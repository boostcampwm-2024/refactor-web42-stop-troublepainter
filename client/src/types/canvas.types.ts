export interface CanvasStore {
  canDrawing: boolean;
  action: {
    setCanDrawing: (canDrawing: boolean) => void;
  };
}
