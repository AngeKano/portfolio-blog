// app/admin/layout.tsx
import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/auth.config';
import { UserRole } from '../../domain/entities/User';
import Sidebar from '@/ui/components/layouts/Sidebar';
import Header from '@/ui/components/layouts/Header';
// import Header from '../../ui/components/layouts/Header';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Vérifier la session côté serveur
  const session = await getServerSession(authOptions);
  
  // Rediriger si l'utilisateur n'est pas authentifié ou n'est pas admin
  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Zone de contenu principal avec scroll */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}