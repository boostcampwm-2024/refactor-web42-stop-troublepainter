import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollToBottom {
  /** 스크롤 컨테이너 요소를 참조하기 위한 ref 객체 */
  containerRef: RefObject<HTMLDivElement>;
  /** 현재 자동 스크롤 상태 여부 */
  isScrollLocked: boolean;
  /** 자동 스크롤 상태를 변경하는 함수 */
  setScrollLocked: (locked: boolean) => void;
}

/**
 * 스크롤 가능한 컨테이너의 자동 스크롤 동작을 관리하는 커스텀 훅입니다.
 *
 * @remarks
 * 하단 자동 스크롤 기능과 수동 스크롤 잠금 기능을 제공합니다.
 *
 * @param dependencies - 스크롤 업데이트를 트리거할 의존성 배열
 *
 * @returns
 * - `containerRef` - 스크롤 컨테이너에 연결할 ref
 * - `isScrollLocked` - 스크롤 자동 잠금 상태
 * - `setScrollLocked` - 스크롤 잠금 상태를 설정하는 함수
 *
 * @example
 * ```typescript
 * const { containerRef, isScrollLocked } = useScrollToBottom([messages]);
 *
 * return (
 *   <div ref={containerRef} className="overflow-auto">
 *     {messages.map(message => (
 *       <ChatMessage key={message.id} {...message} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useScrollToBottom = (dependencies: unknown[] = []): UseScrollToBottom => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrollLocked, setScrollLocked] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current && isScrollLocked) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [isScrollLocked]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 50;

    setScrollLocked(isAtBottom);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [...dependencies, scrollToBottom]);

  return {
    containerRef,
    isScrollLocked,
    setScrollLocked,
  };
};
