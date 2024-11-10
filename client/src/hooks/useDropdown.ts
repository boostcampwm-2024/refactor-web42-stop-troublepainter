import { useEffect, useRef, useState } from 'react';

/**
 * `useDropdown` 훅에 전달할 옵션 객체의 인터페이스입니다.
 */
interface UseDropdown {
  /**
   * 선택된 값을 처리하는 콜백 함수입니다.
   *
   * @param value - 선택된 값 입니다.
   */
  handleChange: (value: string) => void;
}

/**
 * 드롭다운의 상태를 관리하는 커스텀 훅입니다.
 *
 * @param handleChange - 옵션이 선택되었을 때 호출되는 함수입니다.
 *                       선택된 값을 인자로 받습니다.
 *
 * @returns 다음과 같은 속성을 가진 객체를 반환합니다:
 * - `isOpen`: 드롭다운이 열려있는지 닫혀있는지 나타내는 불리언 값입니다.
 * - `toggleDropdown`: 드롭다운의 열림/닫힘 상태를 토글하는 함수입니다.
 * - `handleOptionClick`: 드롭다운 옵션이 선택되었을 때 호출되는 함수입니다.
 * - `dropdownRef`: 드롭다운 컴포넌트의 DOM 요소를 참조하는 React Ref입니다. 바깥 영역 클릭 감지에 사용됩니다.
 * 
 * @example 
 * const { isOpen, toggleDropdown, handleOptionClick } = useDropdown({
    handleChange,
  });

  return (
    <>
      <button
        onClick={toggleDropdown}
      >
        {isOpen ? '드롭다운 닫기' : '드롭다운 열기'}
      </button>

      {isOpen && options.map((option) => (
        <button
          key={option.id}
          onClick={() => handleOptionClick(option.value)}
        >
          {option.value}
        </button>
      ))}
    </>
  );
 * @category Hooks
 */

export const useDropdown = ({ handleChange }: UseDropdown) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (value: string) => {
    setIsOpen(false);
    handleChange(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    isOpen,
    toggleDropdown,
    handleOptionClick,
    dropdownRef,
  };
};
