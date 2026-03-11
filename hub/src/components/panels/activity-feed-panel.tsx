'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSmartPoll } from '@/lib/use-smart-poll'

interface Activity {
  id: number
  type: string
  entity_type: string
  entity_id: number
  actor: string
  description: string
  data?: any
  created_at: number
  entity?: {
    type: string
    id?: number
    title?: string
    name?: string
    status?: string
    content_preview?: string
    task_title?: string
  }
}

const activityIcons: Record<string, string> = {
  task_created: '+',
  task_updated: '~',
  task_deleted: 'x',
  comment_added: '#',
  agent_created: '@',
  agent_status_change: '~',
  standup_generated: '!',
  mention: '>',
  assignment: '=',
}

const activityColors: Record<string, string> = {
  task_created: 'text-[#b4a68c]',
  task_updated: 'text-blue-400',
  task_deleted: 'text-[#9e5c50]',
  comment_added: 'text-purple-400',
  agent_created: 'text-cyan-400',
  agent_status_change: 'text-yellow-400',
  standup_generated: 'text-orange-400',
  mention: 'text-pink-400',
  assignment: 'text-indigo-400',
}

export function ActivityFeedPanel() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [filter, setFiltrar] = useState({
    type: '',
    actor: '',
    limit: 50
  })
  const [lastRefresh, setLastRefresh] = useState(Date.now())

  // Fetch activities
  const fetchActivities = useCallback(async (since?: number) => {
    try {
      if (!since) setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filter.type) params.append('type', filter.type)
      if (filter.actor) params.append('actor', filter.actor)
      if (filter.limit) params.append('limit', filter.limit.toString())
      if (since) params.append('since', Math.floor(since / 1000).toString())

      const response = await fetch(`/api/activities?${params}`)
      if (!response.ok) throw new Error('Failed to fetch activities')

      const data = await response.json()
      
      if (since) {
        // For real-time updates, prepend new activities
        setActivities(prev => {
          const newActivities = data.activities || []
          const existingIds = new Set(prev.map((a: Activity) => a.id))
          const uniqueNew = newActivities.filter((a: Activity) => !existingIds.has(a.id))
          return [...uniqueNew, ...prev].slice(0, filter.limit)
        })
      } else {
        // For initial load or manual refresh, replace all
        setActivities(data.activities || [])
      }

      setLastRefresh(Date.now())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [filter])

  const lastRefreshRef = useRef(lastRefresh)
  useEffect(() => { lastRefreshRef.current = lastRefresh }, [lastRefresh])

  // Initial load
  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  // Smart polling for real-time updates (10s, visibility-aware)
  const pollActivities = useCallback(() => {
    fetchActivities(lastRefreshRef.current)
  }, [fetchActivities])

  useSmartPoll(pollActivities, 30000, { enabled: autoRefresh, pauseWhenSseConnected: true })

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diffMs = now - (timestamp * 1000)
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays < 7) return `${diffDays}d atrás`
    
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  // Get unique activity types for filter
  const activityTipos = Array.from(new Set(activities.map(a => a.type))).sort()
  const actors = Array.from(new Set(activities.map(a => a.actor))).sort()

  return (
    <div classNome="h-full flex flex-col">
      {/* Header */}
      <div classNome="flex justify-between items-center p-4 border-b border-border flex-shrink-0">
        <div classNome="flex items-center gap-3">
          <h2 classNome="text-xl font-bold text-foreground">Atividade</h2>
          <div classNome={`w-2.5 h-2.5 rounded-full ${autoRefresh ? 'bg-[#b4a68c] animate-pulse' : 'bg-muted-foreground/30'}`} />
        </div>

        <div classNome="flex gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            classNome={`px-3 py-1.5 text-sm rounded-md transition-smooth ${
              autoRefresh
                ? 'bg-[#b4a68c]/20 text-[#b4a68c] border border-[#b4a68c]/30'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {autoRefresh ? 'Live' : 'Paused'}
          </button>
          <button
            onClick={() => fetchActivities()}
            classNome="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filtrars */}
      <div classNome="p-4 border-b border-border bg-surface-1 flex-shrink-0">
        <div classNome="flex gap-4 flex-wrap">
          <div>
            <label classNome="block text-xs text-muted-foreground mb-1">Activity Tipo</label>
            <select
              value={filter.type}
              onChange={(e) => setFiltrar(prev => ({ ...prev, type: e.target.value }))}
              classNome="bg-surface-2 text-foreground text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50 border border-border"
            >
              <option value="">All Tipos</option>
              {activityTipos.map(type => (
                <option key={type} value={type}>
                  {activityIcons[type] || '•'} {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label classNome="block text-xs text-muted-foreground mb-1">Actor</label>
            <select
              value={filter.actor}
              onChange={(e) => setFiltrar(prev => ({ ...prev, actor: e.target.value }))}
              classNome="bg-surface-2 text-foreground text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50 border border-border"
            >
              <option value="">All Actors</option>
              {actors.map(actor => (
                <option key={actor} value={actor}>{actor}</option>
              ))}
            </select>
          </div>

          <div>
            <label classNome="block text-xs text-muted-foreground mb-1">Limit</label>
            <select
              value={filter.limit}
              onChange={(e) => setFiltrar(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
              classNome="bg-surface-2 text-foreground text-sm rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/50 border border-border"
            >
              <option value={25}>25 items</option>
              <option value={50}>50 items</option>
              <option value={100}>100 items</option>
              <option value={200}>200 items</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div classNome="bg-[#9e5c50]/10 border border-[#9e5c50]/20 text-[#9e5c50] p-3 m-4 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            classNome="text-[#9e5c50]/60 hover:text-[#9e5c50] ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Activity List */}
      <div classNome="flex-1 overflow-y-auto p-4">
        {loading && activities.length === 0 ? (
          <div classNome="flex items-center justify-center h-32">
            <div classNome="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
            <span classNome="ml-2 text-muted-foreground text-sm">Loading activities...</span>
          </div>
        ) : activities.length === 0 ? (
          <div classNome="flex flex-col items-center justify-center h-32 text-muted-foreground/50">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" classNome="mb-2">
              <path d="M2 4h12M2 8h8M2 12h10" />
            </svg>
            <p classNome="text-sm">No activities found</p>
            <p classNome="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div classNome="space-y-2">
            {activities.map((activity, index) => (
              <div
                key={`${activity.id}-${index}`}
                classNome="bg-card rounded-lg p-3 border-l-2 border-border hover:bg-surface-1 transition-smooth"
              >
                <div classNome="flex items-start gap-3">
                  {/* Activity Icon */}
                  <div classNome={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    activityColors[activity.type]?.replace('text-', 'bg-').replace('-400', '-500/15') || 'bg-surface-2'
                  } ${activityColors[activity.type] || 'text-muted-foreground'}`}>
                    {activityIcons[activity.type] || '•'}
                  </div>

                  {/* Activity Content */}
                  <div classNome="flex-1 min-w-0">
                    <div classNome="flex items-start justify-between gap-2">
                      <div classNome="flex-1">
                        <p classNome="text-foreground text-sm">
                          <span classNome="font-medium text-primary">{activity.actor}</span>
                          {' '}
                          <span classNome={activityColors[activity.type] || 'text-muted-foreground'}>
                            {activity.description}
                          </span>
                        </p>

                        {/* Entity Detalhes */}
                        {activity.entity && (
                          <div classNome="mt-2 p-2 bg-surface-1 rounded-md text-xs border border-border/50">
                            {activity.entity.type === 'task' && (
                              <div>
                                <span classNome="text-muted-foreground">Task:</span>
                                <span classNome="text-foreground ml-1">{activity.entity.title}</span>
                                {activity.entity.status && (
                                  <span classNome="ml-2 px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px]">
                                    {activity.entity.status}
                                  </span>
                                )}
                              </div>
                            )}

                            {activity.entity.type === 'comment' && (
                              <div>
                                <span classNome="text-muted-foreground">Comment on:</span>
                                <span classNome="text-foreground ml-1">{activity.entity.task_title}</span>
                                {activity.entity.content_preview && (
                                  <div classNome="mt-1 text-muted-foreground/70 italic">
                                    &quot;{activity.entity.content_preview}...&quot;
                                  </div>
                                )}
                              </div>
                            )}

                            {activity.entity.type === 'agent' && (
                              <div>
                                <span classNome="text-muted-foreground">Agent:</span>
                                <span classNome="text-foreground ml-1">{activity.entity.name}</span>
                                {activity.entity.status && (
                                  <span classNome="ml-2 px-1.5 py-0.5 bg-[#b4a68c]/10 text-[#b4a68c] rounded text-[10px]">
                                    {activity.entity.status}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Additional Data */}
                        {activity.data && Object.keys(activity.data).length > 0 && (
                          <details classNome="mt-2">
                            <summary classNome="text-xs text-muted-foreground/60 cursor-pointer hover:text-muted-foreground">
                              Mostrar details
                            </summary>
                            <pre classNome="mt-1 text-xs text-muted-foreground bg-surface-1 p-2 rounded-md overflow-auto max-h-32 border border-border/50">
                              {JSON.stringify(activity.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div classNome="flex-shrink-0 text-[10px] text-muted-foreground/50">
                        {formatRelativeTime(activity.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div classNome="border-t border-border p-3 bg-surface-1 text-xs text-muted-foreground flex-shrink-0">
        <div classNome="flex justify-between items-center">
          <span>
            Mostraring {activities.length} activities
            {filter.type || filter.actor ? ' (filtered)' : ''}
          </span>
          <span>
            Última atualização: {new Date(lastRefresh).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  )
}
