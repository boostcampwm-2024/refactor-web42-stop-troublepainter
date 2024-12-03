import { KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { SHORTCUT_KEYS } from '@/constants/shortcutKeys';
import { useShortcuts } from '@/hooks/useShortcuts';

/**
 * 드롭다운을 제어하기 위한 커스텀 훅의 Props 인터페이스입니다.
 */
interface UseDropdown {
  /** 드롭다운을 열고 닫을 수 있는 키보드 단축키 입니다. `SHORTCUT_KEYS`의 키를 타입으로 가집니다. */
  shortcutKey?: keyof typeof SHORTCUT_KEYS;

  /**
   * 옵션이 선택되었을 때 호출되는 콜백 함수입니다.
   * @param value - 선택된 옵션의 값
   */
  handleChange: (value: string) => void;

  /** 드롭다운에 표시될 옵션들의 배열입니다. */
  options: string[];
}

/**
 * 드롭다운의 상태와 동작을 관리하는 커스텀 훅입니다.
 *
 * @param props - 드롭다운 설정을 위한 객체
 * @returns 드롭다운 제어에 필요한 상태와 함수들을 포함하는 객체
 *
 * @example
 * ```tsx
 * const MyDropdown = () => {
 *   const {
 *     isOpen,           // 드롭다운의 열림/닫힘 상태
 *     focusedIndex,     // 현재 포커스된 옵션의 인덱스
 *     toggleDropdown,   // 드롭다운 토글 함수
 *     handleOptionClick,// 옵션 클릭 핸들러
 *     dropdownRef,      // 드롭다운 요소의 ref
 *     handleOptionKeyDown // 옵션 키보드 이벤트 핸들러
 *   } = useDropdown({
 *     shortcutKey: 'Q',
 *     handleChange: (value) => console.log(value),
 *     options: ['옵션1', '옵션2', '옵션3']
 *   });
 *
 *   return (
 *     <div ref={dropdownRef}>
 *       <button onClick={toggleDropdown}>
 *         {isOpen ? '닫기' : '열기'}
 *       </button>
 *       {isOpen && (
 *         <ul>
 *           {options.map((option, index) => (
 *             <button
 *               key={option}
 *               ref={(el) => (optionRefs.current[index] = el)}
 *               data-focused={index === focusedIndex}
 *               onClick={() => handleOptionClick(option)}
 *               onKeyDown={handleOptionKeyDown}
 *             >
 *               {option}
 *             </button>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * 이 훅은 다음과 같은 기능을 제공합니다:
 * - 단축키를 통한 드롭다운 열기/닫기
 * - 키보드 방향키(상하)를 통한 옵션 탐색
 * - Enter키를 통한 옵션 선택
 * - Escape키를 통한 드롭다운 닫기
 * - 외부 클릭 시 자동으로 드롭다운 닫기
 * - 접근성을 위한 키보드 탐색 지원
 *
 * @category Hooks
 */

export const useDropdown = ({ shortcutKey, handleChange, options }: UseDropdown) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
    setFocusedIndex(-1);
  }, []);

  const handleOptionClick = useCallback(
    (value: string) => {
      setIsOpen(false);
      setFocusedIndex(-1);
      handleChange(value);
    },
    [handleChange],
  );

  // 드롭다운 토글 단축키 적용
  useShortcuts([
    {
      key: shortcutKey || null,
      action: toggleDropdown,
    },
  ]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'ArrowDown') {
        setFocusedIndex((prev) => (prev + 1) % options.length);
      } else if (event.key === 'ArrowUp') {
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
      } else if (event.key === 'Escape') {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    },
    [isOpen, options.length],
  );

  const handleOptionKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' && focusedIndex >= 0) {
        event.stopPropagation();
        handleOptionClick(options[focusedIndex]);
      }
    },
    [focusedIndex, handleOptionClick, options],
  );

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleKeyDown, handleClickOutside]);

  return {
    isOpen,
    focusedIndex,
    toggleDropdown,
    handleOptionClick,
    dropdownRef,
    optionRefs,
    handleOptionKeyDown,
  };
};
