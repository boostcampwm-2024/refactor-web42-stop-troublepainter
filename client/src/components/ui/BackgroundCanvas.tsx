import { useEffect, useRef, MouseEvent } from 'react';
import { Point } from '@troublepainter/core';
import particle_1 from '@/assets/patterns/particle-1.png';
import pattern_0 from '@/assets/patterns/pattern-0.png';
import pattern_1 from '@/assets/patterns/pattern-1.png';
import pattern_2 from '@/assets/patterns/pattern-2.png';
import pattern_3 from '@/assets/patterns/pattern-3.png';
import pattern_4 from '@/assets/patterns/pattern-4.png';
import pattern_5 from '@/assets/patterns/pattern-5.png';
import pattern_6 from '@/assets/patterns/pattern-6.png';
import pattern_7 from '@/assets/patterns/pattern-7.png';
import {
  CURSOR_LENGTH,
  CURSOR_WIDTH,
  DELETE_INTERVAL,
  GAP,
  OFFSET,
  PARTICLE_SIZE,
  RANDOM_POINT_RANGE_HEIGHT,
  RANDOM_POINT_RANGE_WIDTH,
  SIZE,
} from '@/constants/backgroundConstants';
import { getCanvasContext } from '@/utils/getCanvasContext';
import { getDrawPoint } from '@/utils/getDrawPoint';

type ImgType = 'particle' | 'pattern';

interface PatternData {
  img: HTMLImageElement;
  type: ImgType;
}

interface patterns {
  pattern: PatternData[];
  particle: PatternData[];
}

const randomizeWidth = () => Math.random() * RANDOM_POINT_RANGE_WIDTH - RANDOM_POINT_RANGE_WIDTH / 2;
const randomizeHeight = () => Math.random() * RANDOM_POINT_RANGE_HEIGHT - RANDOM_POINT_RANGE_HEIGHT / 2;

const redraw = (
  canvas: HTMLCanvasElement,
  cursorCanvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  pattern: { img: HTMLImageElement; type: string }[],
  particle: { img: HTMLImageElement; type: string }[],
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
        pattern[Math.floor(Math.random() * pattern.length)].img,
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
        particle[Math.floor(Math.random() * particle.length)].img,
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

/*
const getPatternType = (src: string): ImgType => {
  const paths = src.split('/');
  const type = 'pattern';
  if (!(type === 'pattern' || type === 'particle')) throw new Error('파츠 파일명이 잘못되었음.');
  debugger;
  return type;
};
*/

const getImageLists = (patterns: string[]): patterns => {
  const lists: patterns = {
    pattern: [],
    particle: [],
  };

  patterns.forEach((src, idx) => {
    const img = new Image();
    img.src = src;
    const type = idx === patterns.length - 1 ? 'particle' : 'pattern';

    //const type = getPatternType(/*src*/);

    lists[type as keyof patterns].push({ img, type });
  });

  return lists;
};

const Background = ({ className }: { className: string }) => {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);

  const cursorAnimation = useRef<number>();

  const pointsRef = useRef<Point[]>([]);

  const drawTimeRef = useRef(performance.now());
  const deleteTimeRef = useRef(performance.now());

  // 패턴 찍기
  useEffect(() => {
    const { canvas, ctx } = getCanvasContext(bgCanvasRef);
    const { canvas: cursorCanvas } = getCanvasContext(cursorCanvasRef);

    const patterns = [
      pattern_0,
      pattern_1,
      pattern_2,
      pattern_3,
      pattern_4,
      pattern_5,
      pattern_6,
      pattern_7,
      particle_1,
    ];
    /* 
    const patterns_vite: Record<string, { default: string }> = import.meta.glob('@/assets/patterns/*.png', {
      eager: true,
    });
    const patterns = Object.values(patterns_vite).map((module) => module.default);
*/
    const { pattern, particle } = getImageLists(patterns);

    Promise.all([
      Promise.all(pattern.map((imgData) => new Promise((res) => (imgData.img.onload = res)))),
      Promise.all(particle.map((imgData) => new Promise((res) => (imgData.img.onload = res)))),
    ])
      .then(() => {
        redraw(canvas, cursorCanvas, ctx, pattern, particle);
      })
      .catch((err) => {
        console.error(err);
      });

    const handleResize = () => {
      redraw(canvas, cursorCanvas, ctx, pattern, particle);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 커서 그리기
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
    </div>
  );
};

export default Background;
