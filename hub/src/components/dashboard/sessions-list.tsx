'use client'

import { Session } from '@/types'
import { formatAge, parseTokenUsage, getStatusBadgeColor } from '@/lib/utils'

interface SessionsListProps {
  sessions: Session[]
}

interface SessionCardProps {
  session: Session
}

function SessionCard({ session }: SessionCardProps) {
  const tokenUsage = parseTokenUsage(session.tokens)
  const statusColor = session.active ? 'success' : 'warning'
  
  const getSessionTipoIcon = (key: string) => {
    if (key.includes('main:main')) return '👑'
    if (key.includes('subagent')) return '🤖'
    if (key.includes('cron')) return '⏰'
    if (key.includes('group')) return '👥'
    return '📄'
  }

  const getModelColor = (model: string) => {
    if (model.includes('opus')) return 'text-purple-400'
    if (model.includes('sonnet')) return 'text-blue-400'
    if (model.includes('haiku')) return 'text-[#b4a68c]'
    return 'text-gray-400'
  }

  const getRoleBadge = (key: string) => {
    if (key.includes('main:main')) {
      return { label: 'LEAD', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
    }
    if (key.includes('subagent')) {
      return { label: 'WORKER', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
    }
    if (key.includes('cron')) {
      return { label: 'CRON', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
    }
    return { label: 'SYSTEM', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
  }

  const getCurrentTask = (session: Session) => {
    // Extract task from session label or key
    if (session.label && session.label !== session.key.split(':').pop()) {
      return session.label
    }
    // For sub-agents, try to extract task from key
    const parts = session.key.split(':')
    if (parts.length > 3 && parts[2] === 'subagent') {
      return parts[3] || 'Unknown task'
    }
    return session.active ? 'Active' : 'Idle'
  }

  const roleBadge = getRoleBadge(session.key)
  const currentTask = getCurrentTask(session)

  return (
    <div classNome="bg-card border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
      <div classNome="flex items-start justify-between">
        <div classNome="flex items-start space-x-3">
          <div classNome={`text-xl ${session.active ? 'working-indicator' : ''}`}>
            {getSessionTipoIcon(session.key)}
          </div>
          <div classNome="flex-1 min-w-0">
            <div classNome="flex items-center space-x-2 mb-1">
              <h4 classNome="font-medium text-foreground truncate">
                {session.key.split(':').pop() || session.key}
              </h4>
              {/* Role Badge */}
              <span classNome={`px-2 py-0.5 text-xs font-bold border rounded-full ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            </div>
            
            {/* Current Task/Status */}
            <div classNome="text-xs text-muted-foreground mb-1">
              <span classNome="font-medium">{currentTask}</span>
            </div>
            
            <p classNome="text-xs text-muted-foreground/70 truncate">
              {session.key}
            </p>
            
            <div classNome="flex items-center space-x-2 mt-2">
              <span classNome={`text-xs font-mono ${getModelColor(session.model)}`}>
                {session.model}
              </span>
              <span classNome="text-xs text-muted-foreground">
                • {formatAge(session.age)}
              </span>
            </div>
          </div>
        </div>

        <div classNome="flex flex-col items-end space-y-1">
          {/* Working/Status Badge */}
          <div classNome={`px-2 py-1 rounded-full border text-xs font-medium ${
            session.active 
              ? 'bg-[#b4a68c]/20 text-[#b4a68c] border-[#b4a68c]/30 animate-pulse'
              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          }`}>
            {session.active ? 'WORKING' : 'IDLE'}
          </div>

          {/* Uso de Tokens */}
          {session.tokens !== '-' && (
            <div classNome="text-right">
              <div classNome="text-xs text-muted-foreground">
                {session.tokens}
              </div>
              {tokenUsage.total > 0 && (
                <div classNome="w-16 h-1 bg-secondary rounded-full mt-1">
                  <div 
                    classNome={`h-full rounded-full ${
                      tokenUsage.percentage > 80 ? 'bg-[#9e5c50]' :
                      tokenUsage.percentage > 60 ? 'bg-yellow-400' :
                      'bg-[#b4a68c]'
                    }`}
                    style={{ width: `${Math.min(tokenUsage.percentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Flags */}
      {session.flags.length > 0 && (
        <div classNome="mt-2 flex flex-wrap gap-1">
          {session.flags.map((flag, index) => (
            <span
              key={index}
              classNome="px-2 py-1 bg-primary/20 text-primary rounded text-xs"
            >
              {flag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function SessionsList({ sessions }: SessionsListProps) {
  const activeSessions = sessions.filter(s => s.active)
  const idleSessions = sessions.filter(s => !s.active)

  return (
    <div classNome="bg-card rounded-lg border border-border">
      <div classNome="p-4 border-b border-border">
        <h3 classNome="font-semibold text-foreground">Sessões Ativas</h3>
        <p classNome="text-sm text-muted-foreground">
          {sessions.length} total • {activeSessions.length} active
        </p>
      </div>

      <div classNome="p-4">
        {sessions.length === 0 ? (
          <div classNome="text-center py-8 text-muted-foreground">
            <div classNome="text-4xl mb-2">🤖</div>
            <p>No sessions active</p>
            <p classNome="text-xs">Sessions will appear here when agents start</p>
          </div>
        ) : (
          <div classNome="space-y-3">
            {/* Sessões Ativas */}
            {activeSessions.length > 0 && (
              <div>
                <h4 classNome="text-sm font-medium text-foreground mb-2 flex items-center">
                  <span classNome="w-2 h-2 bg-[#b4a68c] rounded-full mr-2"></span>
                  Active ({activeSessions.length})
                </h4>
                <div classNome="space-y-2">
                  {activeSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </div>
            )}

            {/* Idle Sessions */}
            {idleSessions.length > 0 && (
              <div>
                <h4 classNome="text-sm font-medium text-foreground mb-2 flex items-center">
                  <span classNome="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Idle ({idleSessions.length})
                </h4>
                <div classNome="space-y-2">
                  {idleSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}