"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  CreditCard,
  Settings,
  Wallet,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
}

export function Sidebar({ userName = "Admin", userEmail = "admin@fintrack.app", userImage }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: ReceiptText,
      active: pathname.startsWith("/transactions"),
    },
    {
      name: "Installments",
      href: "/installments",
      icon: CreditCard,
      active: pathname.startsWith("/installments"),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <aside className="bg-surface dark:bg-zinc-900 h-screen w-64 hidden lg:flex flex-col border-r border-outline-variant/60 fixed left-0 top-0 overflow-y-auto px-4 py-8 z-40">
      {/* Brand Logo */}
      <div className="mb-8 px-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl tracking-tight text-primary dark:text-emerald-400">
              FinTrack
            </span>
            <span className="text-[11px] font-medium text-on-surface-variant/70 -mt-1 tracking-wider uppercase">
              Financial Intelligence
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                item.active
                  ? "bg-primary text-white shadow-sm shadow-primary/25 font-semibold"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:hover:bg-zinc-800/80 active:scale-[0.98]"
              }`}
            >
              <Icon className={`w-5 h-5 ${item.active ? "text-white" : "text-on-surface-variant/80"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Card */}
      <div className="mt-auto px-2 pt-4 border-t border-outline-variant/40">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-surface-container-low dark:hover:bg-zinc-800 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="w-10 h-10 border-2 border-outline-variant/60">
              {userImage && <AvatarImage src={userImage} alt={userName} />}
              <AvatarFallback className="bg-primary-container text-white font-semibold text-sm">
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold text-on-surface truncate">
                {userName}
              </span>
              <span className="text-xs text-on-surface-variant truncate">
                Logged in as {userName}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              document.cookie = "fintrack-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              window.location.href = "/login";
            }}
            title="Keluar"
            className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
