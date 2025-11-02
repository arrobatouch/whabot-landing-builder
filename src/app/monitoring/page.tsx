'use client'

import { MonitoringDashboard } from '@/components/MonitoringDashboard'

export default function MonitoringPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <MonitoringDashboard />
      </div>
    </div>
  )
}