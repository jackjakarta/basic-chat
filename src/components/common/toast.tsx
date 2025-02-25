import CheckIcon from '@/components/icons/check';
import { X } from 'lucide-react';
import toast, { type ToastOptions } from 'react-hot-toast';

const successToastOptions: ToastOptions = {
  duration: 4000,
  icon: <CheckIcon className="w-8 h-8 text-green-600" />,
  style: { display: 'flex', borderRadius: '10px', backgroundColor: '#F0FFF4', color: '#10B981' },
  position: 'top-right',
};

const errorToastOptions: ToastOptions = {
  duration: 8000,
  icon: <X className="text-red-500" />,
  style: { display: 'flex', borderRadius: '10px', backgroundColor: '#FFEBE8', color: '#D93025' },
  position: 'top-right',
};

export function toastError(message: string) {
  toast.error(message, errorToastOptions);
}

export function toastSuccess(message: string) {
  toast.success(message, successToastOptions);
}
