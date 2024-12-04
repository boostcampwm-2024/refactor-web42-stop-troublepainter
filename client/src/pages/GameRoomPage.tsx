import RoleModal from '@/components/modal/RoleModal';
import RoundEndModal from '@/components/modal/RoundEndModal';
import QuizStageContainer from '@/components/quiz/QuizStage';

const GameRoomPage = () => {
  return (
    <>
      <RoleModal />
      <RoundEndModal />
      <QuizStageContainer />
    </>
  );
};

export default GameRoomPage;
