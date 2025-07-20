import CheckIcon from '@/components/icons/check';
import { X } from 'lucide-react';
import { useTheme } from 'next-themes';
import toast, { type ToastOptions } from 'react-hot-toast';

import SpinnerLoading from '../icons/animated/spinner';

type ToastType = 'success' | 'error' | 'loading';

export function useToast() {
  const { theme, systemTheme } = useTheme();
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  const successToastOptions = getSuccessToastOptions(isDarkMode);
  const errorToastOptions = getErrorToastOptions(isDarkMode);
  const loadingToastOptions = getLoadingToastOptions(isDarkMode);

  function toastError(message: string) {
    removeToast();
    toast.error(message, errorToastOptions);
  }

  function toastSuccess(message: string) {
    removeToast();
    toast.success(message, successToastOptions);
  }

  function toastLoading(message: string) {
    toast.loading(message, loadingToastOptions);
  }

  function toastCustom(
    message: string,
    options?: ToastOptions & { removePrevious?: boolean },
    type?: ToastType,
  ) {
    if (options?.removePrevious) {
      removeToast();
    }

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'loading':
        toast.loading(message, options);
        break;
      default:
        toast(message, options);
        break;
    }
  }

  function removeToast() {
    toast.remove();
  }

  return { toastError, toastSuccess, toastLoading, toastCustom, removeToast };
}

function getSuccessToastOptions(isDarkMode: boolean): ToastOptions {
  return {
    duration: 4000,
    icon: <CheckIcon className="h-8 w-8 text-green-600" />,
    style: {
      display: 'flex',
      borderRadius: '10px',
      backgroundColor: isDarkMode ? '#0D2D1A' : '#F0FFF4',
      color: isDarkMode ? '#4ADE80' : '#10B981',
    },
    position: 'top-right',
  };
}

function getErrorToastOptions(isDarkMode: boolean): ToastOptions {
  return {
    duration: 6000,
    icon: <X className="text-destructive" />,
    style: {
      display: 'flex',
      borderRadius: '10px',
      backgroundColor: isDarkMode ? '#2D1515' : '#FFEBE8',
      color: isDarkMode ? '#F87171' : '#D93025',
    },
    position: 'top-right',
  };
}

function getLoadingToastOptions(isDarkMode: boolean): ToastOptions {
  return {
    icon: <SpinnerLoading className="h-8 w-8 text-primary" />,
    style: {
      display: 'flex',
      borderRadius: '10px',
      backgroundColor: isDarkMode ? '#1E1E1E' : '#F0F0F0',
      color: isDarkMode ? '#E5E5E5' : '#333',
    },
    position: 'top-right',
  };
}
