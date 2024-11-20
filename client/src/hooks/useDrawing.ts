import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import type { DrawingMode, RGBA } from '@/types/canvas.types';
import type { DrawingData, Point, StrokeStyle } from '@troublepainter/core';
import { DEFAULT_MAX_PIXELS, COLORS_INFO, DRAWING_MODE, LINEWIDTH_VARIABLE } from '@/constants/canvasConstants';
import { getCanvasContext } from '@/utils/getCanvasContext';
import { hexToRGBA } from '@/utils/hexToRGBA';

interface DrawingOptions {
  maxPixels?: number;
}

// Fill 모드 유틸리티 함수들
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

/**
 * 캔버스 드로잉 기능을 관리하는 Hook입니다.
 *
 * @remarks
 * 캔버스의 실제 드로잉 작업을 처리하며 다음과 같은 핵심 기능을 제공합니다:
 * - 펜/채우기 모드 드로잉
 * - 실행 취소/다시 실행
 * - 잉크 잔량 관리
 * - 드로잉 데이터 기록 및 재생
 *
 * @param canvasRef - 캔버스 엘리먼트의 RefObject
 * @param options - 드로잉 설정 옵션
 * @param options.maxPixels - 최대 사용 가능한 픽셀 수
 *
 * @example
 * ```tsx
 * // GameCanvas.tsx에서의 사용 예시
 * const GameCanvas = ({ role, maxPixels = 100000 }: GameCanvasProps) => {
 *   const canvasRef = useRef<HTMLCanvasElement>(null);
 *
 *   const {
 *     currentColor,
 *     brushSize,
 *     drawingMode,
 *     inkRemaining,
 *     startDrawing,
 *     draw,
 *     stopDrawing,
 *     // ... 기타 반환값들
 *   } = useDrawing(canvasRef, { maxPixels });
 *
 *   // 드로잉 이벤트 핸들러
 *   const handleDrawStart = useCallback((e: ReactMouseEvent | ReactTouchEvent) => {
 *     const point = getDrawPoint(e, canvasRef.current);
 *     startDrawing(point);
 *   }, [startDrawing]);
 *
 *   return (
 *     <Canvas
 *       canvasRef={canvasRef}
 *       isDrawable={true}
 *       brushSize={brushSize}
 *       inkRemaining={inkRemaining}
 *       // ... 기타 props
 *     />
 *   );
 * };
 * ```
 *
 * @returns 드로잉 관련 상태와 메소드들
 * - `currentColor` - 현재 선택된 색상
 * - `brushSize` - 현재 브러시 크기
 * - `drawingMode` - 현재 드로잉 모드 (펜/채우기)
 * - `inkRemaining` - 남은 잉크량
 * - `startDrawing` - 드로잉 시작 함수
 * - `draw` - 드로잉 진행 함수
 * - `stopDrawing` - 드로잉 종료 함수
 * - `applyDrawing` - 외부 드로잉 데이터 적용 함수
 * - `undo/redo` - 실행 취소/다시 실행 함수
 *
 * @category Hooks
 */
const useDrawing = (canvasRef: RefObject<HTMLCanvasElement>, options?: DrawingOptions) => {
  // 기본 상태 관리
  const [currentColor, setCurrentColor] = useState(COLORS_INFO[0].backgroundColor);
  const [brushSize, setBrushSize] = useState(LINEWIDTH_VARIABLE.MIN_WIDTH);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(DRAWING_MODE.PEN);
  const [inkRemaining, setInkRemaining] = useState(options?.maxPixels ?? DEFAULT_MAX_PIXELS);

  // 현재 진행중인 DrawingData를 ref로 관리
  const currentDrawingRef = useRef<DrawingData | null>(null);
  const drawHistoryRef = useRef<ImageData[]>([]);
  const currentStepRef = useRef(-1);

  const getCurrentStyle = useCallback((): StrokeStyle => {
    return {
      color: currentColor,
      width: brushSize,
    };
  }, [currentColor, brushSize]);

  const initCanvas = useCallback(() => {
    const { ctx } = getCanvasContext(canvasRef);
    const style = getCurrentStyle();

    ctx.strokeStyle = style.color;
    ctx.fillStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    saveDrawingState();
  }, [getCurrentStyle]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const saveDrawingState = useCallback(() => {
    const { canvas, ctx } = getCanvasContext(canvasRef);
    drawHistoryRef.current = drawHistoryRef.current.slice(0, currentStepRef.current + 1);
    drawHistoryRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    currentStepRef.current++;
  }, []);

  // DrawingData를 캔버스에 그리는 함수
  const drawData = useCallback((drawingData: DrawingData) => {
    const { ctx } = getCanvasContext(canvasRef);
    const { points, style } = drawingData;

    if (points.length === 0) return;

    ctx.strokeStyle = style.color;
    ctx.fillStyle = style.color;
    ctx.lineWidth = style.width;

    ctx.beginPath();

    if (points.length === 1) {
      // 점 하나일 때는 원으로 그리기
      const point = points[0];
      ctx.arc(point.x, point.y, style.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // 선으로 연결하기
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }, []);

  // Fill 모드 로직은 유지하되 DrawingData 구조로 결과 저장
  const floodFill = useCallback(
    (startX: number, startY: number) => {
      const { canvas, ctx } = getCanvasContext(canvasRef);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelArray = imageData.data;
      const fillColor = hexToRGBA(currentColor);

      // 시작 픽셀의 색상
      const startPos = (startY * canvas.width + startX) * 4;
      const startColor = {
        r: pixelArray[startPos],
        g: pixelArray[startPos + 1],
        b: pixelArray[startPos + 2],
        a: pixelArray[startPos + 3],
      };

      const pixelsToCheck = [[startX, startY]];
      let pixelCount = 0;
      const filledPoints: Point[] = [];

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
        filledPoints.push({ x, y });

        pixelsToCheck.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        pixelCount++;
      }

      ctx.putImageData(imageData, 0, 0);
      setInkRemaining((prev) => Math.max(0, prev - pixelCount));

      // Fill 결과를 DrawingData로 저장
      currentDrawingRef.current = {
        points: filledPoints,
        style: getCurrentStyle(),
      };

      saveDrawingState();
    },
    [currentColor, inkRemaining, getCurrentStyle, saveDrawingState],
  );

  const startDrawing = useCallback(
    (point: Point) => {
      if (inkRemaining <= 0) return;

      if (drawingMode === DRAWING_MODE.FILL) {
        floodFill(Math.floor(point.x), Math.floor(point.y));
        return;
      }

      currentDrawingRef.current = {
        points: [point],
        style: getCurrentStyle(),
      };

      drawData(currentDrawingRef.current);
    },
    [drawingMode, inkRemaining, getCurrentStyle, floodFill, drawData],
  );

  const draw = useCallback(
    (point: Point) => {
      if (!currentDrawingRef.current || inkRemaining <= 0) return;

      // 새 점 추가
      currentDrawingRef.current.points.push(point);
      drawData(currentDrawingRef.current);

      // 잉크 소비량 계산
      const lastPoint = currentDrawingRef.current.points[currentDrawingRef.current.points.length - 2];
      const pixelsUsed = Math.ceil(
        Math.sqrt(Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)) * brushSize,
      );

      setInkRemaining((prev) => Math.max(0, prev - pixelsUsed));
    },
    [inkRemaining, brushSize, drawData],
  );

  const stopDrawing = useCallback(() => {
    if (currentDrawingRef.current) {
      saveDrawingState();
      currentDrawingRef.current = null;
    }
  }, [saveDrawingState]);

  // 외부에서 DrawingData 적용하기 위한 함수
  const applyDrawing = useCallback(
    (drawingData: DrawingData) => {
      drawData(drawingData);
      saveDrawingState();
    },
    [drawData, saveDrawingState],
  );

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
    applyDrawing,
    getCurrentDrawing: () => currentDrawingRef.current,
    canUndo: currentStepRef.current > 0,
    canRedo: currentStepRef.current < drawHistoryRef.current.length - 1,
    undo,
    redo,
  };
};

export { useDrawing };
