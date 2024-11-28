import RoleModal from '@/components/modal/RoleModal';
import RoundEndModal from '@/components/modal/RoundEndModal';
import QuizGameContent from '@/components/quiz/QuizStage';

const GameRoomPage = () => {
  return (
    <>
      <RoleModal />
      <RoundEndModal />
      <QuizGameContent />
    </>
  );
};

export default GameRoomPage;
