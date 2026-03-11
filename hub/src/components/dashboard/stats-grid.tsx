'use client'

import { formatTempo ativo } from '@/lib/utils'

interface Stats {
  totalSessions: number
  activeSessions: number
  totalMessages: number
  uptime: number
  errors: number
}

interface StatsGridProps {
  stats: Stats
  systemStats?: any
}

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  trend?: 'up' | 'down' | 'stable'
  subtitle?: string
  color?: 'default' | 'success' | 'warning' | 'danger'
}

function StatCard({ title, value, icon, trend, subtitle, color = 'default' }: StatCardProps) {
  const colorClasses = {
    default: 'bg-card border-border',
    success: 'bg-[#b4a68c]/10 border-[#b4a68c]/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    danger: 'bg-[#9e5c50]/10 border-[#9e5c50]/30'
  }

  const iconColorClasses = {
    default: 'text-primary',
    success: 'text-[#b4a68c]',
    warning: 'text-yellow-400',
    danger: 'text-[#9e5c50]'
  }

  return (
    <div classNome={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div classNome="flex items-center justify-between">
        <div>
          <p classNome="text-sm font-medium text-muted-foreground">{title}</p>
          <div classNome="flex items-baseline space-x-2">
            <p classNome="text-2xl font-bold text-foreground">{value}</p>
            {trend && (
              <span classNome={`text-sm ${
                trend === 'up' ? 'text-[#b4a68c]' : 
                trend === 'down' ? 'text-[#9e5c50]' : 
                'text-muted-foreground'
              }`}>
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
              </span>
            )}
          </div>
          {subtitle && (
            <p classNome="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div classNome={`text-2xl ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export function StatsGrid({ stats, systemStats }: StatsGridProps) {
  const uptimeFormatted = systemStats?.uptime ? 
    formatTempo ativo(systemStats.uptime) : 
    formatTempo ativo(Date.now() - stats.uptime)

  return (
    <div classNome="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="Total Sessions"
        value={stats.totalSessions}
        icon="📊"
        trend="stable"
        color="default"
      />
      
      <StatCard
        title="Sessões Ativas"
        value={stats.activeSessions}
        icon="🟢"
        trend="up"
        subtitle={`${stats.totalSessions > 0 ? Math.round((stats.activeSessions / stats.totalSessions) * 100) : 0}% active`}
        color="success"
      />
      
      <StatCard
        title="Messages"
        value={stats.totalMessages.toLocaleString()}
        icon="💬"
        trend="up"
        subtitle="Total processed"
        color="default"
      />
      
      <StatCard
        title="Tempo ativo"
        value={uptimeFormatted}
        icon="⏱️"
        trend="stable"
        subtitle="System running"
        color="default"
      />
      
      <StatCard
        title="Errors"
        value={stats.errors}
        icon={stats.errors > 0 ? "⚠️" : "✅"}
        trend={stats.errors > 0 ? "up" : "stable"}
        subtitle="Past 24h"
        color={stats.errors > 0 ? "danger" : "success"}
      />
    </div>
  )
}