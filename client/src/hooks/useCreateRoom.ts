import { useState } from 'react';
import { ApiError } from '@/api/api.config';
import { CreateRoomResponse, gameApi } from '@/api/gameApi';
import { useToastStore } from '@/stores/toast.store';

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
  const actions = useToastStore((state) => state.actions);
  const [isLoading, setIsLoading] = useState(false);

  // 방 생성 함수
  const createRoom = async (): Promise<CreateRoomResponse | undefined> => {
    setIsLoading(true);
    try {
      const response = await gameApi.createRoom();

      // 성공 토스트 메시지
      // actions.addToast({
      //   title: '방 생성 성공',
      //   description: `방이 생성됐습니다! 초대 버튼을 눌러 초대 후 게임을 즐겨보세요!`,
      //   variant: 'success',
      // });

      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        // 에러 토스트 메시지
        actions.addToast({
          title: '방 생성 실패',
          description: error.message,
          variant: 'error',
        });
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { createRoom, isLoading };
};
