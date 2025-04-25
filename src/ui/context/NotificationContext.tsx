// ui/context/NotificationContext.tsx
'use client';

import React, { createContext, useContext } from 'react';
import { useNotification, Notification, NotificationType } from '../hooks/useNotification';
import NotificationsContainer from '../components/common/Notification';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  } = useNotification();

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationsContainer notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
};

export default NotificationContext;