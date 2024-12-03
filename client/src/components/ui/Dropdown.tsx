import { HTMLAttributes } from 'react';
import ArrowDownIcon from '@/assets/arrow.svg';
import { SHORTCUT_KEYS } from '@/constants/shortcutKeys';
import { useDropdown } from '@/hooks/useDropdown';
import { cn } from '@/utils/cn';

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  options: string[];
  handleChange: (value: string) => void;
  selectedValue: string;
  shortcutKey?: keyof typeof SHORTCUT_KEYS;
}

const Dropdown = ({ options, handleChange, selectedValue, shortcutKey, className, ...props }: DropdownProps) => {
  const { isOpen, toggleDropdown, handleOptionClick, dropdownRef, optionRefs, handleOptionKeyDown } = useDropdown({
    handleChange,
    shortcutKey,
    options,
  });

  return (
    <div className={cn('relative rounded-lg bg-eastbay-50 text-2xl', className)} ref={dropdownRef} {...props}>
      <button
        onClick={toggleDropdown}
        className="flex h-full w-full items-center justify-between rounded-lg border-2 border-violet-950 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
      >
        <span className="w-full text-center">{selectedValue}</span>
        <img
          src={ArrowDownIcon}
          alt="드롭다운 메뉴 토글버튼"
          className={cn('h-5 w-5 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <div
        className={cn(
          'absolute left-0 z-10 w-full rounded-lg bg-eastbay-50 shadow-lg',
          'origin-top transform transition-all duration-200',
          !isOpen && 'invisible scale-y-0',
        )}
      >
        <div className="overflow-hidden rounded-lg">
          {options.map((option, index) => (
            <button
              key={index}
              ref={(item) => (optionRefs.current[index] = item)}
              onClick={() => handleOptionClick(option)}
              onKeyDown={handleOptionKeyDown}
              className={cn(
                'w-full p-2 text-center transition-colors duration-200 ease-in-out hover:bg-violet-100 focus:bg-violet-200',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
