import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

type NotificationType = 'success' | 'error';

interface UseNotificationReturn {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showNotification: (message: string, type: NotificationType) => void;
}

export const useNotification = (): UseNotificationReturn => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  const showSuccess = (message: string) => {
    context.showNotification(message, 'success');
  };

  const showError = (message: string) => {
    context.showNotification(message, 'error');
  };

  return {
    showSuccess,
    showError,
    showNotification: context.showNotification,
  };
}; 