import { PlayerRole } from '@troublepainter/core';
import { GameCanvas } from '@/components/canvas/GameCanvas';

const ExamplePageCanvasOnly = () => {
  return (
    <div className="flex items-center justify-center">
      <GameCanvas role={PlayerRole.DEVIL} />
    </div>
  );
};

export default ExamplePageCanvasOnly;
