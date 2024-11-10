import { useRef } from 'react';

export const MainCanvas = () => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <section>
      <canvas className="touch-none border border-black" ref={mainCanvasRef}>
        <img src="/" /> {/* canvas 지원하지 않는 브라우저일 경우 대체 이미지 */}
      </canvas>
    </section>
  );
};
