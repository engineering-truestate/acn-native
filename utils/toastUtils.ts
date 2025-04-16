import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  position?: 'top' | 'bottom';
  visibilityTime?: number;
  autoHide?: boolean;
}

const defaultOptions: ToastOptions = {
  position: 'top',
  visibilityTime: 3000,
  autoHide: true,
};

export const showToast = (
  type: ToastType,
  message: string,
  options: ToastOptions = {}
) => {
  const finalOptions = { ...defaultOptions, ...options };

  Toast.show({
    type,
    text1: message,
    position: finalOptions.position,
    visibilityTime: finalOptions.visibilityTime,
    autoHide: finalOptions.autoHide,
    topOffset: 60, // This accounts for the safe area at the bottom
  });
};

// Convenience methods
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  showToast('success', message, options);
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  showToast('error', message, options);
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  showToast('info', message, options);
}; 