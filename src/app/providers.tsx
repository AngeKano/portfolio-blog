// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../ui/context/AuthContext';
import { NotificationProvider } from '../ui/context/NotificationContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AuthProvider>
    </SessionProvider>
  );
}