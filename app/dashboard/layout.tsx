import type { Metadata } from 'next'
import './dashboard.css'

export const metadata: Metadata = {
  title: 'Team Performance Dashboard | CHANGE_X',
  description: 'CHANGE_X Team Performance Dashboard — Clear, Aligned, Effective.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
