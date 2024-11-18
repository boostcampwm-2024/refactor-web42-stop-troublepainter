import { useMutation } from '@tanstack/react-query';
import { ApiError } from '@/api/api.config';
import { gameApi } from '@/api/gameApi';

/**
 * 게임 방 생성을 위한 커스텀 훅입니다.
 *
 * @returns mutation 객체를 반환합니다. onSuccess 핸들러는 컴포넌트에서 처리해야 합니다.
 *
 * @example
 * const Component = () => {
 *   const { isExiting, transitionTo } = usePageTransition();
 *   const createRoom = useCreateRoom();
 *
 *   const handleCreateRoom = async () => {
 *     const response = await createRoom.mutateAsync();
 *     transitionTo(`/lobby/${response.data.roomId}`);
 *   };
 *
 *   return (
 *     <Button
 *       onClick={handleCreateRoom}
 *       disabled={createRoom.isPending || isExiting}
 *     >
 *       방 만들기
 *     </Button>
 *   );
 * };
 */
export const useCreateRoom = () => {
  return useMutation({
    mutationFn: gameApi.createRoom,
    onError: (error) => {
      if (error instanceof ApiError) {
        console.error('API Error:', error.message);
        // TODO: 에러 처리 (예: 토스트 메시지)
      }
    },
  });
};
