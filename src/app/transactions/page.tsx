import { getTransactions } from "@/app/actions/transactions";
import { getDashboardData } from "@/lib/dashboard-data";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { TransactionsClient } from "@/components/transactions/TransactionsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Daftar Transaksi — FinTrack",
  description: "Manajemen dan riwayat transaksi pengeluaran dan pemasukan harian Anda.",
};

export default async function TransactionsPage() {
  const [transactions, dashboardData] = await Promise.all([
    getTransactions(),
    getDashboardData(),
  ]);

  return (
    <div className="bg-surface dark:bg-zinc-950 text-on-surface min-h-screen antialiased flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar
        userName={dashboardData.userName}
        userEmail={dashboardData.userEmail}
        userImage={dashboardData.userImage}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-24 lg:pb-10">
        {/* Sticky Top Header */}
        <Header
          title="Transactions"
          userName={dashboardData.userName}
          userImage={dashboardData.userImage}
          isDbrWarning={dashboardData.isDbrWarning}
        />

        {/* Content Canvas */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <TransactionsClient initialTransactions={transactions} />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}
