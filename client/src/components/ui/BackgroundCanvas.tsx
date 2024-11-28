import { useEffect, useRef, MouseEvent } from 'react';
import { Point } from '@troublepainter/core';
import patterns from '@/assets/patterns/pattenrs';
import { getCanvasContext } from '@/utils/getCanvasContext';
import { getDrawPoint } from '@/utils/getDrawPoint';

const SIZE = 55;
const GAP = 40;
const OFFSET = SIZE;
const PARTICLE_SIZE = SIZE / 3;

const RANDOM_POINT_RANGE_Width = 20;
const RANDOM_POINT_RANGE_HEIGHT = 30;

const CURSOR_WIDTH = 20;
const CURSOR_LENGTH = 7;
const DELETE_INTERVAL = 30;

interface PatternData {
  img: HTMLImageElement;
  type: 'particle' | 'pattern';
}

const randomizeWidth = () => Math.random() * RANDOM_POINT_RANGE_Width - RANDOM_POINT_RANGE_Width / 2;
const randomizeHeight = () => Math.random() * RANDOM_POINT_RANGE_HEIGHT - RANDOM_POINT_RANGE_HEIGHT / 2;

const redraw = (
  canvas: HTMLCanvasElement,
  cursorCanvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  patternList: { img: HTMLImageElement; type: string }[],
  particleList: { img: HTMLImageElement; type: string }[],
) => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  cursorCanvas.width = canvas.offsetWidth;
  cursorCanvas.height = canvas.offsetHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 0.3;

  const rows = Math.ceil(canvas.height / (SIZE + GAP));
  const cols = Math.ceil(canvas.width / (SIZE + GAP));

  for (let row = 0; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const patternX = col * (SIZE + GAP) + (row % 2 === 0 ? 0 : OFFSET);
      const patternY = row * (SIZE + GAP);

      const random1 = Math.random() * 10 - 5;

      ctx.beginPath();
      ctx.save();
      ctx.translate(patternX + SIZE / 2, patternY + SIZE / 2);
      ctx.rotate(Math.random() * 2 * Math.PI);
      ctx.drawImage(
        patternList[Math.floor(Math.random() * patternList.length)].img,
        -SIZE / 2 + randomizeWidth(),
        -SIZE / 2 + randomizeHeight(),
        SIZE + random1,
        SIZE + random1,
      );
      ctx.restore();

      const random2 = Math.random() * 10 - 5;
      const particleX = patternX + SIZE;
      const particleY = patternY + SIZE + (GAP - PARTICLE_SIZE) / 2 + randomizeWidth();
      ctx.save();
      ctx.translate(particleX + PARTICLE_SIZE / 2, particleY + PARTICLE_SIZE / 2);
      ctx.rotate(Math.random() * 2 * Math.PI);
      ctx.drawImage(
        particleList[Math.floor(Math.random() * particleList.length)].img,
        -PARTICLE_SIZE / 2 + randomizeWidth(),
        -PARTICLE_SIZE / 2,
        PARTICLE_SIZE + random2,
        PARTICLE_SIZE + random2,
      );
      ctx.restore();
      ctx.fill();
    }
  }
};

const getImageLists = (patterns: string[]) =>
  patterns.reduce(
    ([pattern, particle]: [PatternData[], PatternData[]], src: string): [PatternData[], PatternData[]] => {
      const paths = src.split('/');
      const type = paths[paths.length - 1].split('-')[0];
      if (!(type === 'particle' || type === 'pattern')) throw new Error('패턴 이미지 이름이 잘못됐음');

      const img = new Image();
      img.src = src;

      const patternData: PatternData = { img, type };

      if (type === 'pattern') pattern.push(patternData);
      if (type === 'particle') particle.push(patternData);

      return [pattern, particle];
    },
    [[], []],
  );

const Background = ({ className }: { className: string }) => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);

  const cursorAnimation = useRef<number>();

  const pointsRef = useRef<Point[]>([]);

  const drawTimeRef = useRef(performance.now());
  const deleteTimeRef = useRef(performance.now());

  useEffect(() => {
    const { canvas, ctx } = getCanvasContext(bgCanvasRef);
    const { canvas: cursorCanvas } = getCanvasContext(cursorCanvasRef);

    const [patternList, particleList] = getImageLists(patterns);

    Promise.all([
      Promise.all(patternList.map((imgData) => new Promise((res) => (imgData.img.onload = res)))),
      Promise.all(particleList.map((imgData) => new Promise((res) => (imgData.img.onload = res)))),
    ])
      .then(() => {
        redraw(canvas, cursorCanvas, ctx, patternList, particleList);
      })
      .catch((err) => {
        console.error(err);
      });

    window.addEventListener('resize', () => {
      redraw(canvas, cursorCanvas, ctx, patternList, particleList);
    });
  }, []);

  useEffect(() => {
    const { canvas, ctx } = getCanvasContext(cursorCanvasRef);

    const drawAni = () => {
      const now = performance.now();

      if (now - drawTimeRef.current > 16 && pointsRef.current.length > 1) {
        if (pointsRef.current.length > CURSOR_LENGTH) pointsRef.current = pointsRef.current.slice(-CURSOR_LENGTH);
        drawTimeRef.current = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.globalAlpha = 0.3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = CURSOR_WIDTH;
        ctx.strokeStyle = 'white';

        const points = pointsRef.current;
        points.forEach((point, idx) => {
          if (idx === 0) ctx.moveTo(point.x, point.y);
          else if (idx < points.length - 1) {
            const midX = (points[idx + 1].x + point.x) / 2;
            const midY = (points[idx + 1].y + point.y) / 2;
            ctx.quadraticCurveTo(point.x, point.y, midX, midY);
          } else {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        });
      }

      if (now - deleteTimeRef.current > DELETE_INTERVAL && pointsRef.current.length > 1) {
        pointsRef.current.shift();
        deleteTimeRef.current = now;
      }

      requestAnimationFrame(drawAni);
    };

    cursorAnimation.current = requestAnimationFrame(drawAni);

    return () => {
      if (cursorAnimation.current) cancelAnimationFrame(cursorAnimation.current);
    };
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const { canvas } = getCanvasContext(cursorCanvasRef);
    const point = getDrawPoint(e, canvas);
    pointsRef.current.push(point);
  };

  const handleMouseLeave = () => {
    const { canvas, ctx } = getCanvasContext(cursorCanvasRef);
    pointsRef.current.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className={className}>
      <canvas ref={bgCanvasRef} className="absolute h-full w-full" />
      <canvas
        ref={cursorCanvasRef}
        className="absolute h-full w-full cursor-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      ;
    </div>
  );
};

export default Background;
