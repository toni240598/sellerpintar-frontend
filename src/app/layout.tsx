import './globals.css'
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='overflow-hidden'>
        {children}
        <Toaster
          position="top-right"
        />
      </body>
    </html>
  )
}
