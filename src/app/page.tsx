import { getDashboardData } from "@/lib/dashboard-data";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { StatCards } from "@/components/dashboard/StatCards";
import { ExpenseCategoryChart } from "@/components/dashboard/ExpenseCategoryChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ActiveInstallments } from "@/components/dashboard/ActiveInstallments";
import { QuickAddModal } from "@/components/dashboard/QuickAddModal";

export const revalidate = 30; // ISR: re-fetch from DB every 30 seconds

export const metadata = {
  title: "Dashboard — FinTrack",
  description: "Dashboard ringkasan finansial, kalkulasi saldo, rasio beban cicilan, dan analisis arus kas.",
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="bg-surface dark:bg-zinc-950 text-on-surface min-h-screen antialiased flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar
        userName={data.userName}
        userEmail={data.userEmail}
        userImage={data.userImage}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-24 lg:pb-10">
        {/* Sticky Top Header */}
        <Header
          title="Dashboard Overview"
          userName={data.userName}
          userImage={data.userImage}
          isDbrWarning={data.isDbrWarning}
        />

        {/* Content Canvas */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Financial Health Alert / Warning */}
          <AlertBanner
            dbrRatio={data.dbrRatio}
            isDbrWarning={data.isDbrWarning}
            isBalanceBelowTarget={data.isBalanceBelowTarget}
          />

          {/* Metric Stat Cards (3 Cards Grid) */}
          <StatCards
            totalBalance={data.totalBalance}
            minBalanceTarget={data.minBalanceTarget}
            estimatedNextIncome={data.estimatedNextIncome}
            monthlyInstallmentLoad={data.monthlyInstallmentLoad}
            dbrRatio={data.dbrRatio}
            isDbrWarning={data.isDbrWarning}
          />

          {/* Charts Area (2 Grid Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donut Chart: Expense Breakdown */}
            <ExpenseCategoryChart data={data.categoryExpenses} />

            {/* Bar Chart: Cashflow Income vs Expense */}
            <IncomeExpenseChart data={data.cashflow} />
          </div>

          {/* Bottom Section: Recent Transactions & Active Installments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={data.activeInstallments.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
              <RecentTransactions transactions={data.recentTransactions} />
            </div>

            {data.activeInstallments.length > 0 && (
              <div className="lg:col-span-1">
                <ActiveInstallments installments={data.activeInstallments} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Interactive Quick Add Floating Action Button & Modal */}
      <QuickAddModal />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
}
