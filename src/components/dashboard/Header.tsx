"use client";

import Link from "next/link";
import { Bell, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title?: string;
  userName?: string;
  userImage?: string;
  isDbrWarning?: boolean;
}

export function Header({
  title = "Dashboard Overview",
  userName = "User",
  userImage,
  isDbrWarning = false,
}: HeaderProps) {
  return (
    <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-30 flex justify-between items-center w-full px-4 lg:px-8 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800">
      {/* Mobile Brand & Title */}
      <div className="lg:hidden flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/20">
          <Wallet className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
            {title}
          </span>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            FinTrack App
          </span>
        </div>
      </div>

      {/* Desktop Heading */}
      <div className="hidden lg:flex flex-col">
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {title}
        </h1>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Ringkasan kesehatan finansial dan arus kas Anda
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5">
        {/* Notification Bell */}
        <div className="relative">
          <button
            aria-label="Notifications"
            className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-2.5 transition-all duration-200"
          >
            <Bell className="w-5 h-5" />
            {isDbrWarning && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-900 animate-pulse" />
            )}
          </button>
        </div>

        {/* User Avatar / Profile Button */}
        <Link
          href="/settings"
          className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
        >
          <Avatar className="w-8 h-8 ring-2 ring-emerald-500/20">
            {userImage && <AvatarImage src={userImage} alt={userName} />}
            <AvatarFallback className="bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white text-xs font-bold">
              {(userName || "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 hidden sm:inline">
            {userName}
          </span>
        </Link>
      </div>
    </header>
  );
}
