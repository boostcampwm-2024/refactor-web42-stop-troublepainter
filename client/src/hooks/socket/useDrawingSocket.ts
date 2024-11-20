// 이벤트 중심적 구조, 드로잉 관련 단일 책임, 실시간 드로잉 데이터
// 특정 기능(드로잉)에 집중된 이벤트 핸들링
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { DrawUpdateResponse } from '@troublepainter/core';
import type { DrawingData } from '@troublepainter/core';
import { SocketNamespace } from '@/stores/socket/socket.config';
import { useSocketStore } from '@/stores/socket/socket.store';
import { playerIdStorageUtils } from '@/utils/playerIdStorage';

interface UseDrawingSocketProps {
  onDrawUpdate?: (response: DrawUpdateResponse) => void;
}

/**
 * 드로잉 데이터의 실시간 공유를 관리하는 Socket Hook입니다.
 *
 * @remarks
 * Canvas 컴포넌트에서 발생하는 드로잉을 실시간으로 다른 참가자들과 동기화합니다.
 * useDrawing Hook과 함께 사용되어 로컬 드로잉과 원격 드로잉을 통합 관리합니다.
 *
 * @param props - Hook 설정
 * @param props.onDrawUpdate - 원격 드로잉 데이터 수신 시 호출될 콜백
 *
 * @example
 * ```tsx
 * // GameCanvas.tsx에서의 사용 예시
 * const GameCanvas = ({ role }: GameCanvasProps) => {
 *   const { applyDrawing } = useDrawing(canvasRef);
 *
 *   // 소켓 연결 및 원격 드로잉 처리
 *   const { isConnected, sendDrawing } = useDrawingSocket({
 *     onDrawUpdate: (response) => {
 *       // 원격 드로잉 데이터를 캔버스에 적용
 *       applyDrawing(response.drawingData);
 *     }
 *   });
 *
 *   // 드로잉 종료 시 데이터 전송
 *   const handleDrawEnd = useCallback(() => {
 *     const currentDrawing = getCurrentDrawing();
 *     if (currentDrawing && isConnected) {
 *       sendDrawing(currentDrawing);
 *     }
 *     stopDrawing();
 *   }, [stopDrawing, sendDrawing]);
 *
 *   return <Canvas {...props} />;
 * };
 * ```
 *
 * @returns
 * - `isConnected` - 드로잉 소켓 연결 상태
 * - `sendDrawing` - 드로잉 데이터를 다른 참가자들에게 전송하는 함수
 *
 * @category Hooks
 */
export const useDrawingSocket = ({ onDrawUpdate }: UseDrawingSocketProps = {}) => {
  const { roomId } = useParams<{ roomId: string }>();
  const { sockets, connected, actions: socketActions } = useSocketStore();
  const currentPlayerId = playerIdStorageUtils.getPlayerId(roomId as string); // roomId가 있다고 가정

  // 소켓 연결 설정
  useEffect(() => {
    if (!roomId || !currentPlayerId) return;

    socketActions.connect(SocketNamespace.DRAWING, {
      roomId,
      playerId: currentPlayerId,
    });

    return () => {
      socketActions.disconnect(SocketNamespace.DRAWING);
    };
  }, [roomId, currentPlayerId, socketActions]);

  // 이벤트 리스너 설정
  useEffect(() => {
    const socket = sockets.drawing;
    if (!socket) return;

    const handlers = {
      drawUpdated: (response: DrawUpdateResponse) => {
        if (response.playerId !== currentPlayerId) {
          onDrawUpdate?.(response);
        }
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [sockets.drawing, currentPlayerId, onDrawUpdate]);

  // 드로잉 데이터 전송
  const sendDrawing = useCallback(
    (drawingData: DrawingData) => {
      const socket = sockets.drawing;
      if (!socket || !connected.drawing) return;

      socket.emit('draw', { drawingData });
    },
    [sockets.drawing, connected.drawing],
  );

  return {
    isConnected: connected.drawing,
    sendDrawing,
  };
};
