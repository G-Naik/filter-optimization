import { useRef } from 'react';

export const useDebounce = (fn: () => void, delay: number = 300) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const debounceFn = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fn();
    }, delay);
  };

  return debounceFn;
};
