'use client'

import { useEffect, useState } from 'react'
import { useMissionControl } from '@/store'
import { useNavigateToPanel } from '@/lib/navigation'
import { createClientLogger } from '@/lib/client-logger'

const log = createClientLogger('Sidebar')

interface MenuItem {
  id: string
  label: string
  icon: string
  description?: string
}

const menuItems: MenuItem[] = [
  { id: 'overview', label: 'Overview', icon: '📊', description: 'System dashboard' },
  { id: 'sessions', label: 'Sessions', icon: '💬', description: 'Active agent sessions' },
  { id: 'tasks', label: 'Tarefas', icon: '📋', description: 'Kanban task management' },
  { id: 'agents', label: 'Agentes', icon: '🤖', description: 'Agent management & status' },
  { id: 'activity', label: 'Atividade', icon: '📣', description: 'Real-time activity stream' },
  { id: 'notifications', label: 'Notificações', icon: '🔔', description: 'Mentions & alerts' },
  { id: 'standup', label: 'Standup Diário', icon: '📈', description: 'Generate standup reports' },
  { id: 'spawn', label: 'Iniciar Agente', icon: '🚀', description: 'Launch new sub-agents' },
  { id: 'logs', label: 'Logs', icon: '📝', description: 'Real-time log viewer' },
  { id: 'cron', label: 'Cron Jobs', icon: '⏰', description: 'Automated tasks' },
  { id: 'memory', label: 'Memória', icon: '🧠', description: 'Knowledge browser' },
  { id: 'tokens', label: 'Tokens', icon: '💰', description: 'Usage & cost tracking' },
]

export function Sidebar() {
  const { activeTab, connection, sessions } = useMissionControl()
  const navigateToPanel = useNavigateToPanel()
  const [systemStats, setSystemStats] = useState<any>(null)

  useEffect(() => {
    // Fetch system status
    fetch('/api/status?action=overview')
      .then(res => res.json())
      .then(data => setSystemStats(data))
      .catch(err => log.error('Failed to fetch system status:', err))
  }, [])

  const activeSessions = sessions.filter(s => s.active).length
  const totalSessions = sessions.length

  return (
    <aside classNome="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo/Brand */}
      <div classNome="p-6 border-b border-border">
        <div classNome="flex items-center space-x-2">
          <div classNome="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span classNome="text-primary-foreground font-bold text-sm">MC</span>
          </div>
          <div>
            <h2 classNome="font-bold text-foreground">Torre Dona</h2>
            <p classNome="text-xs text-muted-foreground">ClawdBot Orchestration</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav classNome="flex-1 p-4 overflow-y-auto">
        <ul classNome="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigateToPanel(item.id)}
                classNome={`w-full flex items-start space-x-3 px-3 py-3 rounded-lg text-left transition-colors group ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
                title={item.description}
              >
                <span classNome="text-lg mt-0.5">{item.icon}</span>
                <div classNome="flex-1 min-w-0">
                  <div classNome="font-medium">{item.label}</div>
                  <div classNome={`text-xs mt-0.5 ${
                    activeTab === item.id 
                      ? 'text-primary-foreground/80' 
                      : 'text-muted-foreground group-hover:text-foreground/70'
                  }`}>
                    {item.description}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Status Footer */}
      <div classNome="p-4 border-t border-border space-y-3">
        {/* Connection Status */}
        <div classNome="bg-secondary rounded-lg p-3">
          <div classNome="flex items-center justify-between">
            <span classNome="text-sm font-medium text-foreground">Gateway</span>
            <div classNome="flex items-center space-x-1">
              <div classNome={`w-2 h-2 rounded-full ${
                connection.isConnected 
                  ? 'bg-[#b4a68c] animate-pulse' 
                  : 'bg-[#9e5c50]'
              }`}></div>
              <span classNome="text-xs text-muted-foreground">
                {connection.isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
            <div classNome="mt-2 space-y-1">
              <div classNome="text-xs text-muted-foreground">
                {connection.url || 'ws://<gateway-host>:<gateway-port>'}
              </div>
              {connection.latency && (
                <div classNome="text-xs text-muted-foreground">
                  Latency: {connection.latency}ms
                </div>
            )}
          </div>
        </div>

        {/* Session Stats */}
        <div classNome="bg-secondary rounded-lg p-3">
          <div classNome="flex items-center justify-between">
            <span classNome="text-sm font-medium text-foreground">Sessions</span>
            <span classNome="text-xs text-muted-foreground">
              {activeSessions}/{totalSessions}
            </span>
          </div>
          <div classNome="mt-2 text-xs text-muted-foreground">
            {activeSessions} active • {totalSessions - activeSessions} idle
          </div>
        </div>

        {/* System Stats */}
        {systemStats && (
          <div classNome="bg-secondary rounded-lg p-3">
            <div classNome="text-sm font-medium text-foreground mb-2">System</div>
            <div classNome="space-y-1 text-xs text-muted-foreground">
              <div classNome="flex justify-between">
                <span>Memória:</span>
                <span>{systemStats.memory ? Math.round((systemStats.memory.used / systemStats.memory.total) * 100) : 0}%</span>
              </div>
              <div classNome="flex justify-between">
                <span>Disk:</span>
                <span>{systemStats.disk.usage || 'N/A'}</span>
              </div>
              <div classNome="flex justify-between">
                <span>Processes:</span>
                <span>{systemStats.processes?.length || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
