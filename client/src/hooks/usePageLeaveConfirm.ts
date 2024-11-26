import { useEffect, useCallback } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router-dom';

interface UsePageLeaveConfirmOptions {
  /** 경고 메시지 */
  message?: string;
  /** 경고 표시 여부를 결정하는 조건. 기본값은 게임 진행 상태 기반 */
  shouldBlock?: boolean;
}

/**
 * 페이지 새로고침 및 이탈 시 경고를 표시하는 커스텀 훅입니다.
 *
 * @param options - 설정 옵션
 * @returns void
 *
 * @example
 * ```tsx
 * // GameLayout.tsx
 * const GameLayout = () => {
 *   usePageLeaveConfirm({
 *     message: "게임을 나가시겠습니까? 진행 중인 게임은 저장되지 않습니다.",
 *   });
 *   return <div>게임 레이아웃</div>;
 * };
 *
 * // 예시: 방장일 때만 경고
 * usePageLeaveConfirm({
 *   shouldBlock: isHost
 *   message: "방장이 나가면 게임이 종료됩니다."
 * });
 *
 * // 예시: 채팅 입력 중일 때만 경고
 * usePageLeaveConfirm({
 *   shouldBlock: isTyping,
 *   message: "작성 중인 메시지가 있습니다."
 * });
 *
 * ```
 */
export const usePageLeaveConfirm = ({
  message = '페이지를 나가시겠습니까? 변경사항이 저장되지 않을 수 있습니다.',
  shouldBlock: explicitShouldBlock,
}: UsePageLeaveConfirmOptions = {}) => {
  // 명시적으로 shouldBlock이 주어지지 않은 경우 기본적으로 새로고침 방지하도록 조치
  const shouldBlock = explicitShouldBlock || true;

  // 새로고침 방지 (`beforeunload` 이벤트)
  // 브라우저의 보안 정책으로 인해 `beforeunload` 이벤트에서는 사용자 정의 메시지를 표시할 수 없음.
  // 모든 최신 브라우저는 기본 메시지만 표시하도록 강제.
  useBeforeUnload(
    useCallback(
      (event) => {
        if (shouldBlock) {
          event.preventDefault();
          return message;
        }
      },
      [shouldBlock, message],
    ),
  );

  // react-router의 블로커 설정
  const blocker = useBlocker(shouldBlock);

  // ESC 키로 뒤로가기 방지
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && shouldBlock) {
        event.preventDefault();
      }
    };

    if (shouldBlock) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldBlock]);

  // blocker 상태에 따른 처리
  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmed = window.confirm(message);
      if (confirmed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker, message]);
};
