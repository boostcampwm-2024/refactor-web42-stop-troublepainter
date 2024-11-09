import { SelectHTMLAttributes, useState } from 'react';
import ArrowDownIcon from '@/assets/arrow.svg';
import { cn } from '@/utils/cn';

export interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: {
    id: number;
    value: string;
  }[];
  dropdownId: string;
}

const Dropdown = ({ options, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(options[0].value);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative bg-eastbay-50', className)}>
      {/* 선택한 value */}
      <button
        onClick={toggleDropdown}
        className="flex w-full items-center justify-between rounded-lg border-2 border-violet-950 p-2 text-2xl"
      >
        <span className="w-full text-center">{selectedOption}</span>
        <img
          src={ArrowDownIcon}
          alt="드롭다운 메뉴 토글버튼"
          className={cn('h-5 w-5 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      <div
        className={cn(
          'absolute left-0 w-full rounded-lg bg-eastbay-50 shadow-lg transition-opacity ease-in-out',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
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
