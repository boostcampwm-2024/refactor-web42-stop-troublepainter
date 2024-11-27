import { RefObject, useCallback } from 'react';
import { DrawingData, Point, StrokeStyle } from '@troublepainter/core';
import { useDrawingState } from './useDrawingState';
import { MAINCANVAS_RESOLUTION_HEIGHT, MAINCANVAS_RESOLUTION_WIDTH } from '@/constants/canvasConstants';
import { RGBA } from '@/types/canvas.types';
import { getCanvasContext } from '@/utils/getCanvasContext';
import { hexToRGBA } from '@/utils/hexToRGBA';

const fillTargetColor = (pos: number, fillColor: RGBA, pixelArray: Uint8ClampedArray) => {
  pixelArray[pos] = fillColor.r;
  pixelArray[pos + 1] = fillColor.g;
  pixelArray[pos + 2] = fillColor.b;
  pixelArray[pos + 3] = fillColor.a;
};

const checkColorisEqual = (pos: number, startColor: RGBA, pixelArray: Uint8ClampedArray) => {
  return (
    pixelArray[pos] === startColor.r &&
    pixelArray[pos + 1] === startColor.g &&
    pixelArray[pos + 2] === startColor.b &&
    pixelArray[pos + 3] === startColor.a
  );
};

/**
 * 캔버스의 실제 드로잉 작업을 수행하는 Hook입니다.
 *
 * @remarks
 * 캔버스의 실제 드로잉 작업들을 관리합니다.
 * - 스트로크 그리기
 * - 영역 채우기 작업
 * - 캔버스 다시 그리기
 * - 스타일 관리
 *
 * useDrawingState와 함께 작동하여 드로잉 컨텍스트를 유지하고
 * 캔버스의 실제 픽셀 조작을 처리합니다.
 *
 * @param canvasRef - 캔버스 엘리먼트의 RefObject
 * @param state - useDrawingState에서 반환된 드로잉 상태
 *
 * @example
 * ```tsx
 * const canvasRef = useRef<HTMLCanvasElement>(null);
 * const state = useDrawingState({ maxPixels: 1000 });
 * const operations = useDrawingOperation(canvasRef, state);
 *
 * // 드로잉 작업 사용 예시
 * operations.drawStroke({
 *   points: [{x: 0, y: 0}, {x: 10, y: 10}],
 *   style: operations.getCurrentStyle()
 * });
 * ```
 *
 * @returns 드로잉 작업 메소드들을 포함하는 객체
 * @property getCurrentStyle - 현재 상태를 기반으로 스트로크 스타일을 반환하는 함수
 * @property drawStroke - 캔버스에 단일 스트로크를 그리는 함수
 * @property redrawCanvas - 저장된 스트로크들을 기반으로 전체 캔버스를 다시 그리는 함수
 * @property floodFill - 지정된 좌표에서 영역 채우기를 수행하는 함수
 *
 * @category Hooks
 */
export const useDrawingOperation = (
  canvasRef: RefObject<HTMLCanvasElement>,
  state: ReturnType<typeof useDrawingState>,
) => {
  const { currentColor, brushSize, inkRemaining, setInkRemaining } = state;

  const getCurrentStyle = useCallback(
    (): StrokeStyle => ({
      color: currentColor,
      width: brushSize,
    }),
    [currentColor, brushSize],
  );

  const drawSmoothLine = (drawingData: DrawingData, canvasRef: RefObject<HTMLCanvasElement>, isLastStroke: boolean) => {
    const { ctx } = getCanvasContext(canvasRef);
    const { points } = drawingData;

    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length - 1; i++) {
      const midPoint = {
        x: (points[i].x + points[i + 1].x) / 2,
        y: (points[i].y + points[i + 1].y) / 2,
      };

      ctx.quadraticCurveTo(points[i].x, points[i].y, midPoint.x, midPoint.y);
    }

    if (isLastStroke) ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

    ctx.stroke();
  };

  const drawStroke = useCallback((drawingData: DrawingData, isLastStroke: boolean) => {
    const { ctx } = getCanvasContext(canvasRef);
    const { points, style } = drawingData;

    if (points.length === 0) return;

    ctx.strokeStyle = style.color;
    ctx.fillStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.beginPath();

    if (points.length === 1) {
      const point = points[0];
      ctx.arc(point.x, point.y, style.width / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      drawSmoothLine(drawingData, canvasRef, isLastStroke);
    }
  }, []);

  const redrawCanvas = useCallback(() => {
    if (!state.crdtRef.current) return;

    const { canvas, ctx } = getCanvasContext(canvasRef);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const strokes = state.crdtRef.current.strokes;
    const notNoneStrokes = strokes.filter((stroke) => stroke.stroke !== null);

    notNoneStrokes.forEach(({ stroke }, idx) => {
      const points = stroke.points;
      if (notNoneStrokes.length - 1 === idx) drawStroke(stroke, true);
      else if (points.length >= notNoneStrokes[idx + 1].stroke.points.length) drawStroke(stroke, true);
      else drawStroke(stroke, false);
    });
  }, [drawStroke]);

  const floodFill = useCallback(
    (startX: number, startY: number) => {
      const { canvas, ctx } = getCanvasContext(canvasRef);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelArray = imageData.data;
      const fillColor = hexToRGBA(currentColor);

      const startPos = (startY * canvas.width + startX) * 4;
      const startColor = {
        r: pixelArray[startPos],
        g: pixelArray[startPos + 1],
        b: pixelArray[startPos + 2],
        a: pixelArray[startPos + 3],
      };

      const pixelsToCheck = [[startX, startY]];
      const checkArray = new Array(MAINCANVAS_RESOLUTION_HEIGHT)
        .fill(null)
        .map(() => new Array(MAINCANVAS_RESOLUTION_WIDTH).fill(false));
      let pixelCount = 1;
      const filledPoints: Point[] = [{ x: startX, y: startY }];

      while (pixelsToCheck.length > 0 && pixelCount < inkRemaining) {
        const [currentX, currentY] = pixelsToCheck.shift()!;
        for (const move of [
          [1, 0],
          [0, -1],
          [-1, 0],
          [0, 1],
        ]) {
          const [nextX, nextY] = [currentX + move[0], currentY + move[1]];
          if (
            nextX >= 0 &&
            nextX < MAINCANVAS_RESOLUTION_WIDTH &&
            nextY >= 0 &&
            nextY < MAINCANVAS_RESOLUTION_HEIGHT &&
            !checkArray[nextY][nextX]
          ) {
            const nextArrayIndex = (nextY * MAINCANVAS_RESOLUTION_WIDTH + nextX) * 4;
            if (checkColorisEqual(nextArrayIndex, startColor, pixelArray)) {
              checkArray[nextY][nextX] = true;
              fillTargetColor(nextArrayIndex, fillColor, pixelArray);
              pixelsToCheck.push([nextX, nextY]);
              filledPoints.push({ x: nextX, y: nextY });
              pixelCount++;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setInkRemaining((prev) => Math.max(0, prev - pixelCount));

      return {
        points: filledPoints,
        style: getCurrentStyle(),
      };
    },
    [currentColor, inkRemaining, getCurrentStyle],
  );

  return {
    getCurrentStyle,
    drawStroke,
    redrawCanvas,
    floodFill,
  };
};
