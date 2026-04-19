import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Placeholder for search/user profile */}
        <header className="flex h-16 items-center justify-end border-b border-white/5 px-8">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10" />
            <div className="h-8 w-24 rounded-lg bg-white/5 border border-white/10" />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 scrollbar-hide">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
