import { useState } from 'react';

interface UseDropdown {
  handleChange: (value: string) => void;
}

export const useDropdown = ({ handleChange }: UseDropdown) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (value: string) => {
    setIsOpen(false);
    handleChange(value);
  };

  return {
    isOpen,
    toggleDropdown,
    handleOptionClick,
  };
};
