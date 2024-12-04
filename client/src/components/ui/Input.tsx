import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, ...props }, ref) => {
  const inputId = useId();

  return (
    <>
      <label htmlFor={inputId} className="block text-violet-950">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        ref={ref}
        className={cn(
          'h-11 w-full rounded-lg border-2 border-violet-950 px-4 text-base text-violet-950 placeholder:text-eastbay-500 focus:border-violet-500 focus:outline-none lg:h-12 lg:text-lg 2xl:h-14 2xl:text-xl',
          className,
        )}
        {...props}
      />
    </>
  );
});

Input.displayName = 'Input';

export { Input };
