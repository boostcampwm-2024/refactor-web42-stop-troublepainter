import { SelectHTMLAttributes } from 'react';
import ArrowDownIcon from '@/assets/arrow.svg';
import { useDropdown } from '@/hooks/useDropdown';
import { cn } from '@/utils/cn';

export interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: {
    id: number;
    value: string;
  }[];
  handleChange: (value: string) => void;
  selectedValue: string;
}

const Dropdown = ({ options, handleChange, selectedValue, className }: DropdownProps) => {
  const { isOpen, toggleDropdown, handleOptionClick, dropdownRef } = useDropdown({
    handleChange,
  });

  return (
    <div className={cn('relative bg-eastbay-50', className)} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex h-full w-full items-center justify-between rounded-lg border-2 border-violet-950 px-2 text-2xl"
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
          'absolute left-0 w-full rounded-lg bg-eastbay-50 shadow-lg',
          'origin-top transform transition-all duration-200',
          !isOpen && 'invisible scale-y-0',
        )}
      >
        <div className="overflow-hidden rounded-lg">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.value)}
              className={cn('w-full p-2 text-center text-xl hover:bg-violet-100 focus:bg-violet-200')}
            >
              {option.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
