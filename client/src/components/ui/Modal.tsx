import { HTMLAttributes, KeyboardEvent, PropsWithChildren } from 'react';
import { cn } from '@/utils/cn';

export interface ModalProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  title: string;
  closeModal?: () => void;
  isModalOpened: boolean;
  handleKeyDown?: (e: KeyboardEvent<Element>) => void;
}

const Modal = ({ className, handleKeyDown, closeModal, isModalOpened, title, children, ...props }: ModalProps) => {
  return (
    <div
      className={cn(
        'fixed left-0 top-0 flex h-full w-full items-center justify-center',
        isModalOpened ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      onClick={closeModal}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={cn(
          'absolute left-0 top-0 h-full w-full bg-violet-950',
          isModalOpened ? 'opacity-50' : 'opacity-0',
          'transition-opacity duration-300 ease-in-out',
        )}
      />

      <div
        className={cn(
          'relative m-3 h-auto w-full flex-col justify-center overflow-hidden rounded-xl border-2 border-violet-950 bg-violet-100 transition-opacity duration-300 ease-in-out',
          isModalOpened ? 'opacity-100' : 'opacity-0',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        {...props}
      >
        <div className="flex min-h-16 items-center justify-center border-b-2 border-violet-950 bg-violet-500 px-3 py-3">
          <h2 className="translate-y-1 text-4xl text-stroke-md">{title}</h2>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

export { Modal };
