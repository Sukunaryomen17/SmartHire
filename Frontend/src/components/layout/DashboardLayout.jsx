import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

function DashboardLayout({
  children,
  topbarTitle = "SmartHire",
  topbarActions,
  topbarContent,
  className = "",
  contentClassName = "",
}) {
  return (
    <div className={`dashboard-canvas flex min-h-screen flex-col text-[#292d28] lg:flex-row ${className}`}>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={topbarTitle} actions={topbarActions}>
          {topbarContent}
        </Topbar>
        <main className={`min-w-0 flex-1 p-5 sm:p-6 lg:p-8 ${contentClassName}`}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout