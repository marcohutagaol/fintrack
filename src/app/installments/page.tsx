import { getInstallments } from "@/app/actions/installments";
import { getDashboardData } from "@/lib/dashboard-data";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { InstallmentsClient } from "@/components/installments/InstallmentsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cicilan & Hutang — FinTrack",
  description: "Pelacakan beban cicilan berjalan, tenor pembayaran, sisa hutang, dan proyeksi pembayaran bulan depan.",
};

export default async function InstallmentsPage() {
  const [{ installments, summary }, dashboardData] = await Promise.all([
    getInstallments(),
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
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-24 lg:pb-12">
        {/* Sticky Top Header */}
        <Header
          title="Installments"
          userName={dashboardData.userName}
          userImage={dashboardData.userImage}
          isDbrWarning={dashboardData.isDbrWarning}
        />

        {/* Content Canvas */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <InstallmentsClient
            initialInstallments={installments}
            initialSummary={summary}
          />
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}
