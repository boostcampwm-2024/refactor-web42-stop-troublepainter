import { KeyboardEvent, useState } from 'react';
import { timer } from '@/utils/timer';

/**
 * Modal을 열고 닫는 기능을 제공하는 커스텀 훅입니다.
 * 모달이 열릴 때 `autoCloseDelay`가 설정된 경우 자동으로 모달을 닫을 수 있습니다.
 * 'Escape' 키를 누르면 모달을 닫는 기능이 포함되어 있습니다.
 *
 * @param {number} autoCloseDelay - 모달이 자동으로 닫히기까지의 지연 시간(밀리초 단위)
 * @returns {Object} 모달의 상태와 조작을 위한 함수들
 * @returns {boolean} isModalOpened - 모달이 열려 있는지 여부
 * @returns {Function} openModal - 모달을 여는 함수
 * @returns {Function} closeModal - 모달을 닫는 함수
 * @returns {Function} handleKeyDown - 'Escape' 키 이벤트를 처리하여 모달을 닫는 함수
 *
 * @example
 * const { openModal, closeModal, handleKeyDown, isModalOpened } = useModal(5000);
 *
 * // 모달 열기
 * openModal();
 *
 * // 모달 닫기
 * closeModal();
 *
 * @category Hooks
 */

export const useModal = (autoCloseDelay?: number) => {
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

  const handleKeyDown = (e: KeyboardEvent<Element>) => {
    if (e.key === 'Escape') closeModal();
  };

  return { openModal, closeModal, handleKeyDown, isModalOpened };
};
