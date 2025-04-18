import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  position?: 'top' | 'bottom';
  visibilityTime?: number;
  autoHide?: boolean;
  isInModal?: boolean; // New option to indicate if toast is shown in a modal
}

const defaultOptions: ToastOptions = {
  position: 'top',
  visibilityTime: 3000,
  autoHide: true,
  isInModal: false, // Default is not in modal
};


export const showToast = (
  type: ToastType,
  message: string,
  options: ToastOptions = {}
) => {
  const finalOptions = { ...defaultOptions, ...options };
  const topOffset = finalOptions.isInModal ? 20 : 60;
  

  Toast.show({
    type,
    text1: message,
    position: finalOptions.position,
    visibilityTime: finalOptions.visibilityTime,
    autoHide: finalOptions.autoHide,
    topOffset:  topOffset, 
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