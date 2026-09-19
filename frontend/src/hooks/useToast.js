import { useContext } from 'react';
import { ToastContext } from '../components/ToastProvider.jsx';

export default function useToast() {
  return useContext(ToastContext);
}
