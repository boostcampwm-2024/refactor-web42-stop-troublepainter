import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_MAX_PIXELS, COLORS_INFO, DRAWING_MODE, LINEWIDTH_VARIABLE } from '@/constants/canvasConstants';
import { DrawingMode, RGBA } from '@/types/canvas.types';
import { Point } from '@/types/canvas.types';
import { getCanvasContext } from '@/utils/getCanvasContext';
import { hexToRGBA } from '@/utils/hexToRGBA';

// 필요한 타입 정의
interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
}

interface DrawingOptions {
  maxPixels?: number;
}

const fillTargetColor = (pos: number, fillColor: RGBA, pixelArray: Uint8ClampedArray) => {
  pixelArray[pos] = fillColor.r;
  pixelArray[pos + 1] = fillColor.g;
  pixelArray[pos + 2] = fillColor.b;
  pixelArray[pos + 3] = fillColor.a;
};

const checkColorisNotEqual = (pos: number, startColor: RGBA, pixelArray: Uint8ClampedArray) => {
  return (
    pixelArray[pos] !== startColor.r ||
    pixelArray[pos + 1] !== startColor.g ||
    pixelArray[pos + 2] !== startColor.b ||
    pixelArray[pos + 3] !== startColor.a
  );
};

const useDrawing = (canvasRef: RefObject<HTMLCanvasElement>, options?: DrawingOptions) => {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
  });
  const [currentColor, setCurrentColor] = useState(COLORS_INFO[0].backgroundColor);
  const [brushSize, setBrushSize] = useState(LINEWIDTH_VARIABLE.MIN_WIDTH);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(DRAWING_MODE.PEN);
  const [inkRemaining, setInkRemaining] = useState(options?.maxPixels ?? DEFAULT_MAX_PIXELS);

  // 그리기 기록을 위한 배열
  const drawHistoryRef = useRef<ImageData[]>([]);
  const currentStepRef = useRef(-1);

  const initCanvas = useCallback(() => {
    const { ctx } = getCanvasContext(canvasRef);

    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = brushSize;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 초기 상태 저장
    saveDrawingState();
  }, []);

  // 최초 마운트 시에만 캔버스 초기화
  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // 드로잉 상태 저장
  const saveDrawingState = useCallback(() => {
    const { canvas, ctx } = getCanvasContext(canvasRef);

    // 현재 스텝 이후의 기록은 삭제
    drawHistoryRef.current = drawHistoryRef.current.slice(0, currentStepRef.current + 1);

    // 현재 상태 저장
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawHistoryRef.current.push(imageData);
    currentStepRef.current++;
  }, []);

  // Fill 모드 구현
  const floodFill = useCallback(
    (startX: number, startY: number, fillColor: RGBA) => {
      const { canvas, ctx } = getCanvasContext(canvasRef);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelArray = imageData.data;

      // 시작 픽셀의 색상 가져오기
      const startPos = (startY * canvas.width + startX) * 4;
      const startColor = {
        r: pixelArray[startPos],
        g: pixelArray[startPos + 1],
        b: pixelArray[startPos + 2],
        a: pixelArray[startPos + 3],
      };

      // flood fill 알고리즘
      const pixelsToCheck = [[startX, startY]];
      let pixelCount = 0;

      while (pixelsToCheck.length > 0 && pixelCount < inkRemaining) {
        const [x, y] = pixelsToCheck.shift()!;
        const pos = (y * canvas.width + x) * 4;

        if (
          x < 0 ||
          x >= canvas.width ||
          y < 0 ||
          y >= canvas.height ||
          checkColorisNotEqual(pos, startColor, pixelArray)
        )
          continue;

        fillTargetColor(pos, fillColor, pixelArray);

        pixelsToCheck.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        pixelCount++;
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

      const { ctx } = getCanvasContext(canvasRef);

      if (drawingMode === DRAWING_MODE.FILL) {
        floodFill(Math.floor(point.x), Math.floor(point.y), hexToRGBA(currentColor));
        return;
      }

      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.fillStyle = currentColor;

      ctx.beginPath();
      ctx.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(point.x, point.y);

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

      const { ctx } = getCanvasContext(canvasRef);

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
      const { ctx } = getCanvasContext(canvasRef);

      ctx.putImageData(drawHistoryRef.current[currentStepRef.current], 0, 0);
    }
  }, []);

  const redo = useCallback(() => {
    if (currentStepRef.current < drawHistoryRef.current.length - 1) {
      currentStepRef.current++;
      const { ctx } = getCanvasContext(canvasRef);

      ctx.putImageData(drawHistoryRef.current[currentStepRef.current], 0, 0);
    }
  }, []);

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
