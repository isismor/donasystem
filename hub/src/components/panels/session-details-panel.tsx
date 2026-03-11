'use client'

import { useState, useCallback } from 'react'
import { useMissionControl } from '@/store'
import { useSmartPoll } from '@/lib/use-smart-poll'
import { createClientLogger } from '@/lib/client-logger'

const log = createClientLogger('SessionDetalhes')

export function SessionDetalhesPanel() {
  const { 
    sessions, 
    selectedSession, 
    setSelectedSession,
    setSessions,
    availableModels 
  } = useMissionControl()

  // Smart polling for sessions (30s, visibility-aware)
  const loadSessions = useCallback(async () => {
    try {
      const response = await fetch('/api/sessions')
      const data = await response.json()
      setSessions(data.sessions || data)
    } catch (error) {
      log.error('Failed to load sessions:', error)
    }
  }, [setSessions])

  useSmartPoll(loadSessions, 60000, { pauseWhenConnected: true })

  const [controllingSession, setControllingSession] = useState<string | null>(null)
  const [sessionFiltrar, setSessionFiltrar] = useState<'all' | 'active' | 'idle'>('all')
  const [sortBy, setSortBy] = useState<'age' | 'tokens' | 'model'>('age')
  const [expandedSession, setExpandiredSession] = useState<string | null>(null)

  const getModelInfo = (modelNome: string) => {
    const matchedAlias = availableModels
      .map(m => m.alias)
      .find(alias => modelNome.toLowerCase().includes(alias.toLowerCase()))

    return availableModels.find(m =>
      m.name === modelNome ||
      m.alias === modelNome ||
      m.alias === matchedAlias
    ) || { alias: modelNome, name: modelNome, provider: 'unknown', description: 'Unknown model' }
  }

  const parseTokenUsage = (tokenString: string) => {
    // Parse token strings like "49k/35k (139%)" or "15k/35k (43%)"
    const match = tokenString.match(/(\d+(?:\.\d+)?)(k|m)?\/(\d+(?:\.\d+)?)(k|m)?\s*\((\d+(?:\.\d+)?)%\)/)
    if (!match) return { used: 0, total: 0, percentage: 0 }

    const used = parseFloat(match[1]) * (match[2] === 'k' ? 1000 : match[2] === 'm' ? 1000000 : 1)
    const total = parseFloat(match[3]) * (match[4] === 'k' ? 1000 : match[4] === 'm' ? 1000000 : 1)
    const percentage = parseFloat(match[5])

    return { used, total, percentage }
  }

  const getSessionTipoIcon = (sessionKey: string) => {
    if (sessionKey.includes(':main:main')) return '👑' // Main session
    if (sessionKey.includes(':subagent:')) return '🤖' // Sub-agent
    if (sessionKey.includes(':cron:')) return '⏰' // Cron job
    if (sessionKey.includes(':group:')) return '👥' // Group session
    return '💬' // Default
  }

  const getSessionTipo = (sessionKey: string) => {
    if (sessionKey.includes(':main:main')) return 'Main'
    if (sessionKey.includes(':subagent:')) return 'Sub-agent'
    if (sessionKey.includes(':cron:')) return 'Cron'
    if (sessionKey.includes(':group:')) return 'Group'
    return 'Unknown'
  }

  const getSessionStatus = (session: any) => {
    if (!session.active) return 'idle'
    const tokenUsage = parseTokenUsage(session.tokens)
    if (tokenUsage.percentage > 95) return 'critical'
    if (tokenUsage.percentage > 80) return 'warning'
    return 'active'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#b4a68c]'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-[#9e5c50]'
      case 'idle': return 'text-muted-foreground'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#b4a68c]/20'
      case 'warning': return 'bg-yellow-500/20'
      case 'critical': return 'bg-[#9e5c50]/20'
      case 'idle': return 'bg-gray-500/20'
      default: return 'bg-secondary'
    }
  }

  const filteredSessions = sessions.filter(session => {
    switch (sessionFiltrar) {
      case 'active': return session.active
      case 'idle': return !session.active
      default: return true
    }
  })

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case 'tokens':
        const aUsage = parseTokenUsage(a.tokens)
        const bUsage = parseTokenUsage(b.tokens)
        return bUsage.percentage - aUsage.percentage
      case 'model':
        return a.model.localeCompare(b.model)
      case 'age':
      default:
        // Ordenar por age (newest first)
        if (a.age === 'atrásra') return -1
        if (b.age === 'atrásra') return 1
        return a.age.localeCompare(b.age)
    }
  })

  const handleSessionSelect = (session: any) => {
    setSelectedSession(session.id)
    setExpandiredSession(expandedSession === session.id ? null : session.id)
  }

  const selectedSessionData = sessions.find(s => s.id === selectedSession)

  return (
    <div classNome="p-6 space-y-6">
      <div classNome="border-b border-border pb-4">
        <h1 classNome="text-3xl font-bold text-foreground">Session Management</h1>
        <p classNome="text-muted-foreground mt-2">
          Monitor and manage active agent sessions
        </p>
      </div>

      {/* Filtrars and Controls */}
      <div classNome="bg-card border border-border rounded-lg p-4">
        <div classNome="flex items-center justify-between">
          <div classNome="flex space-x-4">
            {/* Filtrar by Status */}
            <div>
              <label classNome="block text-sm font-medium text-foreground mb-2">
                Filtrar
              </label>
              <select
                value={sessionFiltrar}
                onChange={(e) => setSessionFiltrar(e.target.value as any)}
                classNome="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Sessions</option>
                <option value="active">Active Only</option>
                <option value="idle">Idle Only</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label classNome="block text-sm font-medium text-foreground mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                classNome="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="age">Age</option>
                <option value="tokens">Uso de Tokens</option>
                <option value="model">Model</option>
              </select>
            </div>
          </div>

          {/* Session Stats */}
          <div classNome="text-sm text-muted-foreground">
            {filteredSessions.length} of {sessions.length} sessions
            • {sessions.filter(s => s.active).length} active
          </div>
        </div>
      </div>

      <div classNome="grid lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div classNome="lg:col-span-2 space-y-4">
          {sortedSessions.length === 0 ? (
            <div classNome="bg-card border border-border rounded-lg p-12 text-center">
              <div classNome="text-muted-foreground">
                No sessions match the current filter
              </div>
            </div>
          ) : (
            sortedSessions.map((session) => {
              const modelInfo = getModelInfo(session.model)
              const tokenUsage = parseTokenUsage(session.tokens)
              const status = getSessionStatus(session)
              const isExpandired = expandedSession === session.id

              return (
                <div 
                  key={session.id}
                  classNome={`bg-card border border-border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedSession === session.id 
                      ? 'ring-2 ring-primary/50 border-primary/30' 
                      : 'hover:border-primary/20'
                  }`}
                  onClick={() => handleSessionSelect(session)}
                >
                  <div classNome="space-y-4">
                    {/* Header */}
                    <div classNome="flex items-start justify-between">
                      <div classNome="flex-1 min-w-0">
                        <div classNome="flex items-center space-x-3">
                          <span classNome="text-xl">{getSessionTipoIcon(session.key)}</span>
                          <div>
                            <h3 classNome="font-medium text-foreground truncate">
                              {session.key}
                            </h3>
                            <div classNome="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{getSessionTipo(session.key)}</span>
                              <span>•</span>
                              <span classNome={getStatusColor(status)}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </span>
                              <span>•</span>
                              <span>{session.age}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div classNome="flex items-center space-x-2">
                        {session.flags.map((flag, index) => (
                          <span 
                            key={index}
                            classNome="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded"
                          >
                            {flag}
                          </span>
                        ))}
                        <div classNome={`w-3 h-3 rounded-full ${
                          session.active ? 'bg-[#b4a68c]' : 'bg-gray-500'
                        }`}></div>
                      </div>
                    </div>

                    {/* Model and Uso de Tokens */}
                    <div classNome="grid grid-cols-2 gap-4">
                      <div>
                        <div classNome="text-sm text-muted-foreground mb-1">Model</div>
                        <div classNome="font-medium text-foreground">{modelInfo.alias}</div>
                        <div classNome="text-xs text-muted-foreground">{modelInfo.provider}</div>
                      </div>
                      <div>
                        <div classNome="text-sm text-muted-foreground mb-1">Uso de Tokens</div>
                        <div classNome="font-medium text-foreground">{session.tokens}</div>
                        <div classNome="w-full bg-secondary rounded-full h-2 mt-1">
                          <div
                            classNome={`h-2 rounded-full transition-all ${
                              tokenUsage.percentage > 95 ? 'bg-[#9e5c50]' :
                              tokenUsage.percentage > 80 ? 'bg-yellow-500' : 'bg-[#b4a68c]'
                            }`}
                            style={{ width: `${Math.min(tokenUsage.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Expandired Detalhes */}
                    {isExpandired && (
                      <div classNome="pt-4 border-t border-border space-y-3">
                        <div>
                          <h4 classNome="font-medium text-foreground mb-2">Session Detalhes</h4>
                          <div classNome="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span classNome="text-muted-foreground">Kind:</span> 
                              <span classNome="ml-2 text-foreground">{session.kind}</span>
                            </div>
                            <div>
                              <span classNome="text-muted-foreground">ID:</span> 
                              <span classNome="ml-2 text-foreground font-mono text-xs">{session.id}</span>
                            </div>
                            {session.lastActivity && (
                              <div>
                                <span classNome="text-muted-foreground">Last Activity:</span> 
                                <span classNome="ml-2 text-foreground">
                                  {new Date(session.lastActivity).toLocaleTimeString()}
                                </span>
                              </div>
                            )}
                            {session.messageCount && (
                              <div>
                                <span classNome="text-muted-foreground">Messages:</span> 
                                <span classNome="ml-2 text-foreground">{session.messageCount}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Model Information */}
                        <div>
                          <h4 classNome="font-medium text-foreground mb-2">Model Information</h4>
                          <div classNome="bg-secondary rounded p-3 text-sm">
                            <div classNome="grid grid-cols-2 gap-2">
                              <div>
                                <span classNome="text-muted-foreground">Full Nome:</span> 
                                <div classNome="font-mono text-xs text-foreground mt-1">{modelInfo.name}</div>
                              </div>
                              <div>
                                <span classNome="text-muted-foreground">Provider:</span> 
                                <div classNome="text-foreground mt-1">{modelInfo.provider}</div>
                              </div>
                              <div classNome="col-span-2">
                                <span classNome="text-muted-foreground">Descrição:</span> 
                                <div classNome="text-foreground mt-1">{modelInfo.description}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div classNome="flex space-x-2">
                          <button
                            classNome="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                            disabled={controllingSession !== null}
                            onClick={async (e) => {
                              e.stopPropagation()
                              setControllingSession(`monitor-${session.id}`)
                              try {
                                const res = await fetch(`/api/sessions/${session.id}/control`, {
                                  method: 'POST',
                                  headers: { 'Content-Tipo': 'application/json' },
                                  body: JSON.stringify({ action: 'monitor' }),
                                })
                                if (!res.ok) {
                                  const data = await res.json()
                                  alert(data.error || 'Failed to monitor session')
                                }
                              } catch {
                                alert('Failed to monitor session')
                              } finally {
                                setControllingSession(null)
                              }
                            }}
                          >
                            {controllingSession === `monitor-${session.id}` ? 'Working...' : 'Monitor'}
                          </button>
                          <button
                            classNome="px-3 py-1 text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
                            disabled={controllingSession !== null}
                            onClick={async (e) => {
                              e.stopPropagation()
                              setControllingSession(`pause-${session.id}`)
                              try {
                                const res = await fetch(`/api/sessions/${session.id}/control`, {
                                  method: 'POST',
                                  headers: { 'Content-Tipo': 'application/json' },
                                  body: JSON.stringify({ action: 'pause' }),
                                })
                                if (!res.ok) {
                                  const data = await res.json()
                                  alert(data.error || 'Failed to pause session')
                                }
                              } catch {
                                alert('Failed to pause session')
                              } finally {
                                setControllingSession(null)
                              }
                            }}
                          >
                            {controllingSession === `pause-${session.id}` ? 'Working...' : 'Pause'}
                          </button>
                          <button
                            classNome="px-3 py-1 text-xs bg-[#9e5c50]/20 text-[#9e5c50] border border-[#9e5c50]/30 rounded hover:bg-[#9e5c50]/30 transition-colors disabled:opacity-50"
                            disabled={controllingSession !== null}
                            onClick={async (e) => {
                              e.stopPropagation()
                              if (!window.confirm('Are you sure you want to terminate this session?')) return
                              setControllingSession(`terminate-${session.id}`)
                              try {
                                const res = await fetch(`/api/sessions/${session.id}/control`, {
                                  method: 'POST',
                                  headers: { 'Content-Tipo': 'application/json' },
                                  body: JSON.stringify({ action: 'terminate' }),
                                })
                                if (!res.ok) {
                                  const data = await res.json()
                                  alert(data.error || 'Failed to terminate session')
                                }
                              } catch {
                                alert('Failed to terminate session')
                              } finally {
                                setControllingSession(null)
                              }
                            }}
                          >
                            {controllingSession === `terminate-${session.id}` ? 'Working...' : 'Terminate'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Session Summary */}
        <div classNome="space-y-6">
          <div classNome="bg-card border border-border rounded-lg p-6">
            <h2 classNome="text-xl font-semibold mb-4">Session Overview</h2>
            
            <div classNome="space-y-4">
              <div classNome="flex justify-between">
                <span classNome="text-muted-foreground">Total Sessions:</span>
                <span classNome="font-medium text-foreground">{sessions.length}</span>
              </div>
              <div classNome="flex justify-between">
                <span classNome="text-muted-foreground">Active:</span>
                <span classNome="font-medium text-[#b4a68c]">
                  {sessions.filter(s => s.active).length}
                </span>
              </div>
              <div classNome="flex justify-between">
                <span classNome="text-muted-foreground">Idle:</span>
                <span classNome="font-medium text-muted-foreground">
                  {sessions.filter(s => !s.active).length}
                </span>
              </div>
              <div classNome="flex justify-between">
                <span classNome="text-muted-foreground">Sub-agents:</span>
                <span classNome="font-medium text-foreground">
                  {sessions.filter(s => s.key.includes(':subagent:')).length}
                </span>
              </div>
              <div classNome="flex justify-between">
                <span classNome="text-muted-foreground">Cron Jobs:</span>
                <span classNome="font-medium text-foreground">
                  {sessions.filter(s => s.key.includes(':cron:')).length}
                </span>
              </div>
            </div>
          </div>

          {/* Model Distribution */}
          <div classNome="bg-card border border-border rounded-lg p-6">
            <h2 classNome="text-xl font-semibold mb-4">Model Distribution</h2>
            
            <div classNome="space-y-3">
              {Object.entries(
                sessions.reduce((acc, session) => {
                  const model = getModelInfo(session.model).alias
                  acc[model] = (acc[model] || 0) + 1
                  return acc
                }, {} as Record<string, number>)
              ).map(([model, count]) => (
                <div key={model} classNome="flex items-center justify-between">
                  <span classNome="text-foreground">{model}</span>
                  <div classNome="flex items-center space-x-2">
                    <span classNome="text-muted-foreground">{count}</span>
                    <div classNome="w-16 bg-secondary rounded-full h-2">
                      <div
                        classNome="bg-primary h-2 rounded-full"
                        style={{ width: `${(count / sessions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Uso de Tokens Alert */}
          {sessions.some(s => parseTokenUsage(s.tokens).percentage > 80) && (
            <div classNome="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h3 classNome="font-medium text-yellow-400 mb-2">⚠️ High Uso de Tokens</h3>
              <div classNome="text-sm text-muted-foreground">
                {sessions.filter(s => parseTokenUsage(s.tokens).percentage > 80).length} sessions 
                are using more than 80% of their token limit.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}