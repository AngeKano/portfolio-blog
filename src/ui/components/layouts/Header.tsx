// ui/components/layouts/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { LuBell, LuUser, LuLogOut, LuSettings, LuChevronDown } from 'react-icons/lu';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Gérer la déconnexion
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <header className="bg-white border-b px-4 h-16 flex items-center justify-between">
      {/* Titre */}
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-medium md:hidden">Portfolio Admin</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button title='Notification' className="p-2 rounded-full hover:bg-gray-100">
          <LuBell className="w-5 h-5" />
        </button>

        {/* Menu utilisateur */}
        <div className="relative">
          <button
            className="flex items-center gap-2 hover:bg-gray-100 rounded-full pl-2 pr-3 py-1"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="relative h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Utilisateur"}
                  fill
                  className="object-cover"
                />
              ) : (
                <LuUser className="h-full w-full p-1" />
              )}
            </div>
            <span className="text-sm font-medium hidden sm:block">
              {session?.user?.name || "Admin"}
            </span>
            <LuChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              onBlur={() => setDropdownOpen(false)}
            >
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
              </div>
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                <LuSettings className="w-4 h-4" />
                <span>Paramètres</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                <LuLogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}