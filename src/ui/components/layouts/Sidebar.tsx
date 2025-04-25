// ui/components/layouts/Sidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../../lib/utils";
import {
  LuFileText,
  LuFolderKanban,
  LuSettings,
  LuUsers,
  LuBriefcase,
  LuCode,
  LuMenu,
  LuX,
  LuLayoutDashboard,
} from "react-icons/lu";

// Définir les éléments du menu
const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LuLayoutDashboard },
  { name: "Articles", href: "/admin/articles", icon: LuFileText },
  { name: "Projets", href: "/admin/projects", icon: LuFolderKanban },
  { name: "Compétences", href: "/admin/skills", icon: LuCode },
  { name: "Expériences", href: "/admin/experiences", icon: LuBriefcase },
  { name: "Visiteurs", href: "/admin/visitors", icon: LuUsers },
  { name: "Paramètres", href: "/admin/settings", icon: LuSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Overlay pour mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Bouton pour basculer le sidebar sur mobile */}
      <button
        className="fixed bottom-4 right-4 z-30 rounded-full p-2 bg-primary text-white shadow-lg lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <LuMenu size={24} /> : <LuX size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0",
          collapsed ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* En-tête du sidebar */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold">Portfolio Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
