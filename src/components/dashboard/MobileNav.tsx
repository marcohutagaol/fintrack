"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  CreditCard,
  Settings,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      shortName: "Beranda",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      name: "Transactions",
      shortName: "Transaksi",
      href: "/transactions",
      icon: ReceiptText,
      active: pathname.startsWith("/transactions"),
    },
    {
      name: "Installments",
      shortName: "Cicilan",
      href: "/installments",
      icon: CreditCard,
      active: pathname.startsWith("/installments"),
    },
    {
      name: "Settings",
      shortName: "Pengaturan",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="bg-white/90 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-[0_12px_32px_rgba(0,0,0,0.12)] rounded-3xl px-3 py-2 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-2xl transition-all duration-200 ${
                item.active
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold scale-105"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95"
              }`}
            >
              {item.active && (
                <span className="absolute -top-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-tight mt-1">
                {item.shortName}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
