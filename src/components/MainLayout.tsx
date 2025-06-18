import Header from './Header'
import Sidebar from './Sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <div className="max-h-[calc(100vh-69px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
