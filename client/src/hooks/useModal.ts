import { useState } from 'react';
import { timer } from '@/utils/timer';

export const useModal = (autoCloseDelay: number) => {
  const [isModalOpened, setModalOpened] = useState<boolean>(false);

  const closeModal = () => {
    setModalOpened(false);
  };

  const openModal = () => {
    setModalOpened(true);
    if (autoCloseDelay) {
      return timer({ handleComplete: closeModal, delay: autoCloseDelay });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  };

  return { openModal, closeModal, handleKeyDown, isModalOpened };
};
