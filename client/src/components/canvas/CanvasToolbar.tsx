import { ChangeEvent } from 'react';
import { LINEWIDTH_VARIABLE, PENMODE } from '@/constants/canvasConstants';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { CanvasStore, PenModeType } from '@/types/canvas.types';

const CV = ['#000', '#f257c9', '#e2f724', '#4eb4c2', '#d9d9d9'];
//임시 색상 코드

const CanvasToolBar = () => {
  const lineWidth = useCanvasStore((state: CanvasStore) => state.penSetting.lineWidth);
  const setPenSetting = useCanvasStore((state: CanvasStore) => state.action.setPenSetting);
  const setPenMode = useCanvasStore((state: CanvasStore) => state.action.setPenMode);

  const handleChangeToolColor = (colorNum: number) => {
    setPenSetting({ colorNum });
  };
  const handleChangeLineWidth = (lineWidth: string) => {
    setPenSetting({ lineWidth: Number(lineWidth) });
  };
  const handleChangeToolMode = (modeNum: PenModeType) => {
    setPenMode(modeNum);
  };

  return (
    <section>
      <section>
        {CV.map((color, i) => {
          return (
            <button key={i} className={`bg-canvas-${i} h-16 w-16`} onClick={() => handleChangeToolColor(i)}>
              {color}
            </button>
          );
        })}
      </section>
      <section>
        <input
          type="range"
          min={LINEWIDTH_VARIABLE.MIN_WIDTH}
          max={LINEWIDTH_VARIABLE.MAX_WIDTH}
          step={LINEWIDTH_VARIABLE.STEP_WIDTH}
          value={lineWidth}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeLineWidth(e.target.value)}
        />
      </section>
      <section>
        <button onClick={() => handleChangeToolMode(PENMODE.PEN)}>펜</button>
        <button onClick={() => handleChangeToolMode(PENMODE.PAINTER)}>페인팅</button>
      </section>
    </section>
  );
};

export default CanvasToolBar;
