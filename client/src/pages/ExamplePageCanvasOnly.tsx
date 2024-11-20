import { GameCanvas } from '@/components/canvas/GameCanvasExample';
import { PlayerRole } from '@/types/gameShared.types';

const ExamplePageCanvasOnly = () => {
  return (
    <div className="flex items-center justify-center">
      <GameCanvas role={PlayerRole.DEVIL} />
    </div>
  );
};

export default ExamplePageCanvasOnly;
