import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { DrawingMode } from '@/components/canvas/CanvasUI';

// 필요한 타입 정의
interface Point {
  x: number;
  y: number;
}

interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
}

interface DrawingOptions {
  maxPixels?: number;
}

interface CanvasContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

const DEFAULT_MAX_PIXELS = 1000; // 기본값 설정

// Canvas 컨텍스트를 안전하게 가져오는 유틸리티 함수
const getCanvasContext = (canvasRef: RefObject<HTMLCanvasElement>): CanvasContext | null => {
  const canvas = canvasRef.current;
  if (!canvas) {
    console.warn('Canvas 요소를 찾지 못했습니다.');
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn('2D context를 가져오는데 실패했습니다.');
    return null;
  }

  return { canvas, ctx };
};

const useDrawing = (canvasRef: RefObject<HTMLCanvasElement>, options?: DrawingOptions) => {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
  });
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('pen');
  const [inkRemaining, setInkRemaining] = useState(options?.maxPixels ?? DEFAULT_MAX_PIXELS);

  // 그리기 기록을 위한 배열
  const drawHistoryRef = useRef<ImageData[]>([]);
  const currentStepRef = useRef(-1);

  const initCanvas = useCallback(() => {
    const context = getCanvasContext(canvasRef);
    if (!context) return;
    const { canvas, ctx } = context;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 초기 상태 저장
    saveDrawingState();
  }, []);

  // 드로잉 상태 저장
  const saveDrawingState = useCallback(() => {
    const context = getCanvasContext(canvasRef);
    if (!context) return;
    const { canvas, ctx } = context;

    // 현재 스텝 이후의 기록은 삭제
    drawHistoryRef.current = drawHistoryRef.current.slice(0, currentStepRef.current + 1);

    // 현재 상태 저장
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawHistoryRef.current.push(imageData);
    currentStepRef.current++;
  }, []);

  // Fill 모드 구현
  const floodFill = useCallback(
    (startX: number, startY: number, fillColor: string) => {
      const context = getCanvasContext(canvasRef);
      if (!context) return;
      const { canvas, ctx } = context;

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // 시작 픽셀의 색상 가져오기
      const startPos = (startY * canvas.width + startX) * 4;
      const startR = pixels[startPos];
      const startG = pixels[startPos + 1];
      const startB = pixels[startPos + 2];
      const startA = pixels[startPos + 3];

      // 새로운 색상 파싱
      const fillColorObj = new Color(fillColor);
      const newR = fillColorObj.r;
      const newG = fillColorObj.g;
      const newB = fillColorObj.b;
      const newA = 255;

      // 같은 색상이면 채우기 중단
      if (startR === newR && startG === newG && startB === newB && startA === newA) return;

      // flood fill 알고리즘
      const pixelsToCheck = [[startX, startY]];
      let pixelCount = 0;

      while (pixelsToCheck.length > 0 && pixelCount < inkRemaining) {
        const [x, y] = pixelsToCheck.pop()!;
        const pos = (y * canvas.width + x) * 4;

        if (
          x < 0 ||
          x >= canvas.width ||
          y < 0 ||
          y >= canvas.height ||
          pixels[pos] !== startR ||
          pixels[pos + 1] !== startG ||
          pixels[pos + 2] !== startB ||
          pixels[pos + 3] !== startA
        )
          continue;

        pixels[pos] = newR;
        pixels[pos + 1] = newG;
        pixels[pos + 2] = newB;
        pixels[pos + 3] = newA;
        pixelCount++;

        pixelsToCheck.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }

      ctx.putImageData(imageData, 0, 0);
      setInkRemaining((prev) => prev - pixelCount);
      saveDrawingState();
    },
    [inkRemaining, saveDrawingState],
  );

  const startDrawing = useCallback(
    (point: Point) => {
      if (inkRemaining <= 0) return;

      const context = getCanvasContext(canvasRef);
      if (!context) return;
      const { ctx } = context;

      if (drawingMode === 'fill') {
        floodFill(Math.floor(point.x), Math.floor(point.y), currentColor);
        return;
      }

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;

      setDrawingState({
        isDrawing: true,
        startPoint: point,
      });
    },
    [currentColor, brushSize, drawingMode, inkRemaining, floodFill],
  );

  const draw = useCallback(
    (point: Point) => {
      if (!drawingState.isDrawing || inkRemaining <= 0) return;

      const context = getCanvasContext(canvasRef);
      if (!context) return;
      const { ctx } = context;

      ctx.lineTo(point.x, point.y);
      ctx.stroke();

      // 그린 픽셀 수 계산 (근사치)
      const pixelsUsed = Math.ceil(
        Math.sqrt(
          Math.pow(point.x - (drawingState.startPoint?.x ?? point.x), 2) +
            Math.pow(point.y - (drawingState.startPoint?.y ?? point.y), 2),
        ) * brushSize,
      );

      setInkRemaining((prev) => Math.max(0, prev - pixelsUsed));
      setDrawingState((prev) => ({
        ...prev,
        startPoint: point,
      }));
    },
    [drawingState, brushSize, inkRemaining],
  );

  const stopDrawing = useCallback(() => {
    if (drawingState.isDrawing) {
      saveDrawingState();
    }

    setDrawingState({
      isDrawing: false,
      startPoint: null,
    });
  }, [drawingState.isDrawing, saveDrawingState]);

  const undo = useCallback(() => {
    if (currentStepRef.current > 0) {
      currentStepRef.current--;
      const context = getCanvasContext(canvasRef);
      if (!context) return;
      const { ctx } = context;

      ctx.putImageData(drawHistoryRef.current[currentStepRef.current], 0, 0);
    }
  }, []);

  const redo = useCallback(() => {
    if (currentStepRef.current < drawHistoryRef.current.length - 1) {
      currentStepRef.current++;
      const context = getCanvasContext(canvasRef);
      if (!context) return;
      const { ctx } = context;

      ctx.putImageData(drawHistoryRef.current[currentStepRef.current], 0, 0);
    }
  }, []);

  // 최초 마운트 시에만 캔버스 초기화
  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Color 유틸리티 클래스
  class Color {
    r: number;
    g: number;
    b: number;

    constructor(color: string) {
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.fillStyle = color;
      this.r = parseInt(ctx.fillStyle.slice(1, 3), 16);
      this.g = parseInt(ctx.fillStyle.slice(3, 5), 16);
      this.b = parseInt(ctx.fillStyle.slice(5, 7), 16);
    }
  }

  return {
    currentColor,
    setCurrentColor,
    brushSize,
    setBrushSize,
    drawingMode,
    setDrawingMode,
    inkRemaining,
    startDrawing,
    draw,
    stopDrawing,
    canUndo: currentStepRef.current > 0,
    canRedo: currentStepRef.current < drawHistoryRef.current.length - 1,
    undo,
    redo,
  };
};

export { useDrawing };
