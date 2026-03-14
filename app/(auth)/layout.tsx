import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-4">
      {children}
    </div>
  )
}
