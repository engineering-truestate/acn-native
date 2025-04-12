import { showMessage } from 'react-native-flash-message';

export const showToast = (message, description, type = 'default') => {
    showMessage({
        message,
        description,
        type,
    });
};