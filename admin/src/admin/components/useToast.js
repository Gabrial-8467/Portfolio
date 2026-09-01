import { createContext, useContext } from 'react';

export const ToastContext = createContext({
  toast: () => {},
  addToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}