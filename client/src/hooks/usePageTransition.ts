import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UsePageTransitionOptions {
  /**
   * 트랜지션 애니메이션의 지속 시간 (밀리초)
   * 지속 시간이 끝나면 navigate 됨
   * @default 1000
   */
  duration?: number;
}

/**
 * 페이지 전환 애니메이션을 관리하는 커스텀 훅입니다.
 *
 * @description
 * 페이지 전환 시 애니메이션을 자연스럽게 처리하며, 라우팅과 상태 관리를 캡슐화합니다.
 * 필수로 `PixelTransitionContainer` 컴포넌트와 함께 사용해야 합니다.
 *
 * @param options - 페이지 전환 옵션
 * @returns 전환 상태와 페이지 전환 함수를 포함하는 객체
 *
 * @example
 * ```tsx
 * const MyPage = () => {
 *   const { isExiting, transitionTo } = usePageTransition();
 *
 *   const handleNavigate = () => {
 *     transitionTo('/next-page');
 *   };
 *
 *   return (
 *     <PixelTransitionContainer isExiting={isExiting}>
 *       <button onClick={handleNavigate}>다음 페이지로</button>
 *     </PixelTransitionContainer>
 *   );
 * };
 * ```
 */
export const usePageTransition = ({ duration = 1000 }: UsePageTransitionOptions = {}) => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const transitionTo = useCallback(
    (path: string) => {
      setIsExiting(true);
      setTimeout(() => {
        navigate(path);
      }, duration);
    },
    [navigate, duration],
  );

  return {
    /** 현재 페이지가 전환 중인지 여부 */
    isExiting,
    /**
     * 지정된 경로로 애니메이션과 함께 페이지를 전환합니다
     * @param path - 이동할 페이지의 경로
     */
    transitionTo,
  };
};
