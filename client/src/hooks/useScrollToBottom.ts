import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollToBottom {
  containerRef: RefObject<HTMLDivElement>;
  isScrollLocked: boolean;
  setScrollLocked: (locked: boolean) => void;
}

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
