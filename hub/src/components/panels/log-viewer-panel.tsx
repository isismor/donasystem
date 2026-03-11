'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useMissionControl } from '@/store'
import { useSmartPoll } from '@/lib/use-smart-poll'
import { createClientLogger } from '@/lib/client-logger'

const log = createClientLogger('LogViewer')

interface LogFiltrars {
  level?: string
  source?: string
  search?: string
  session?: string
}

export function LogViewerPanel() {
  const { logs, logFiltrars, setLogFiltrars, clearLogs, addLog } = useMissionControl()
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const [availableSources, setAvailableSources] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const logContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<boolean>(true)
  const logsRef = useRef(logs)
  const logFiltrarsRef = useRef(logFiltrars)

  // Update ref when autoScroll state changes
  useEffect(() => {
    autoScrollRef.current = isAutoScroll
  }, [isAutoScroll])

  // Keep refs in sync so callbacks don't need `logs` / `logFiltrars` deps.
  useEffect(() => {
    logsRef.current = logs
  }, [logs])

  useEffect(() => {
    logFiltrarsRef.current = logFiltrars
  }, [logFiltrars])

  const loadLogs = useCallback(async (tail = false) => {
    log.debug(`Loading logs (tail=${tail})`)
    setIsLoading(!tail) // Only show loading for initial load, not for tailing

    try {
      const currentFiltrars = logFiltrarsRef.current
      const currentLogs = logsRef.current

      const params = new URLSearchParams({
        action: tail ? 'tail' : 'recent',
        limit: '200',
        ...(currentFiltrars.level && { level: currentFiltrars.level }),
        ...(currentFiltrars.source && { source: currentFiltrars.source }),
        ...(currentFiltrars.search && { search: currentFiltrars.search }),
        ...(currentFiltrars.session && { session: currentFiltrars.session }),
        ...(tail && currentLogs.length > 0 && { since: currentLogs[0]?.timestamp.toString() })
      })

      log.debug(`Fetching /api/logs?${params}`)
      const response = await fetch(`/api/logs?${params}`)
      const data = await response.json()

      log.debug(`Received ${data.logs?.length || 0} logs from API`)

      if (data.logs && data.logs.length > 0) {
        if (tail) {
          // Add new logs for tail mode - prepend to existing logs
          let newLogsAdded = 0
          const existingIds = new Set((currentLogs || []).map((l: any) => l?.id).filter(Boolean))
          data.logs.reverse().forEach((entry: any) => {
            if (existingIds.has(entry?.id)) return
            addLog(entry)
            newLogsAdded++
          })
          log.debug(`Added ${newLogsAdded} new logs (tail mode)`)
        } else {
          // Replace logs for initial load or refresh
          log.debug(`Clearing existing logs and loading ${data.logs.length} logs`)
          clearLogs() // Clear existing logs
          data.logs.reverse().forEach((entry: any) => {
            addLog(entry)
          })
          log.debug(`Successfully added ${data.logs.length} logs to store`)
        }
      } else {
        log.debug('No logs received from API')
      }
    } catch (error) {
      log.error('Failed to load logs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [addLog, clearLogs])

  const loadSources = useCallback(async () => {
    try {
      const response = await fetch('/api/logs?action=sources')
      const data = await response.json()
      setAvailableSources(data.sources || [])
    } catch (error) {
      log.error('Failed to load log sources:', error)
    }
  }, [])

  // Load initial logs and sources
  useEffect(() => {
    log.debug('Initial load started')
    loadLogs()
    loadSources()
  }, [loadLogs, loadSources])

  // Smart polling for log tailing (10s, visibility-aware, logs mostly come via WS)
  const pollLogs = useCallback(() => {
    if (autoScrollRef.current && !isLoading) {
      loadLogs(true) // tail mode
    }
  }, [isLoading, loadLogs])

  useSmartPoll(pollLogs, 30000, { pauseWhenConnected: true })

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isAutoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs, isAutoScroll])

  const handleFiltrarChange = (newFiltrars: Partial<LogFiltrars>) => {
    setLogFiltrars(newFiltrars)
    // Reload logs with new filters
    setTimeout(() => loadLogs(), 100)
  }

  const handleScrollToBottom = () => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'text-[#9e5c50]'
      case 'warn': return 'text-yellow-400'
      case 'info': return 'text-blue-400'
      case 'debug': return 'text-muted-foreground'
      default: return 'text-foreground'
    }
  }

  const getLogLevelBg = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error': return 'bg-[#9e5c50]/10 border-[#9e5c50]/20'
      case 'warn': return 'bg-yellow-500/10 border-yellow-500/20'
      case 'info': return 'bg-blue-500/10 border-blue-500/20'
      case 'debug': return 'bg-gray-500/10 border-gray-500/20'
      default: return 'bg-secondary border-border'
    }
  }

  const filteredLogs = logs.filter(entry => {
    if (logFiltrars.level && entry.level !== logFiltrars.level) return false
    if (logFiltrars.source && entry.source !== logFiltrars.source) return false
    if (logFiltrars.search && !entry.message.toLowerCase().includes(logFiltrars.search.toLowerCase())) return false
    if (logFiltrars.session && (!entry.session || !entry.session.includes(logFiltrars.session))) return false
    return true
  })

  // Debug logging
  log.debug(`Store has ${logs.length} logs, filtered to ${filteredLogs.length}`)

  return (
    <div classNome="flex flex-col h-full p-6 space-y-4">
      <div classNome="border-b border-border pb-4">
        <h1 classNome="text-3xl font-bold text-foreground">Logs</h1>
        <p classNome="text-muted-foreground mt-2">
          Real-time streaming logs from ClawdBot gateway and system
        </p>
      </div>

      {/* Filtrars and Controls */}
      <div classNome="bg-card border border-border rounded-lg p-4">
        <div classNome="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Level Filtrar */}
          <div>
            <label classNome="block text-sm font-medium text-foreground mb-2">
              Level
            </label>
            <select
              value={logFiltrars.level || ''}
              onChange={(e) => handleFiltrarChange({ level: e.target.value || undefined })}
              classNome="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All levels</option>
              <option value="error">Erro</option>
              <option value="warn">Aviso</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>

          {/* Source Filtrar */}
          <div>
            <label classNome="block text-sm font-medium text-foreground mb-2">
              Source
            </label>
            <select
              value={logFiltrars.source || ''}
              onChange={(e) => handleFiltrarChange({ source: e.target.value || undefined })}
              classNome="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All sources</option>
              {availableSources.map((source) => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {/* Session Filtrar */}
          <div>
            <label classNome="block text-sm font-medium text-foreground mb-2">
              Session
            </label>
            <input
              type="text"
              value={logFiltrars.session || ''}
              onChange={(e) => handleFiltrarChange({ session: e.target.value || undefined })}
              placeholder="Session ID"
              classNome="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Search Filtrar */}
          <div>
            <label classNome="block text-sm font-medium text-foreground mb-2">
              Search
            </label>
            <input
              type="text"
              value={logFiltrars.search || ''}
              onChange={(e) => handleFiltrarChange({ search: e.target.value || undefined })}
              placeholder="Search messages..."
              classNome="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Controls */}
          <div classNome="flex items-end space-x-2">
            <button
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              classNome={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
                isAutoScroll
                  ? 'bg-[#b4a68c]/20 text-[#b4a68c] border border-[#b4a68c]/30'
                  : 'bg-secondary text-muted-foreground border border-border'
              }`}
            >
              {isAutoScroll ? 'Auto' : 'Manual'}
            </button>
            <button
              onClick={handleScrollToBottom}
              classNome="px-3 py-2 text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md font-medium hover:bg-blue-500/30 transition-colors"
            >
              Bottom
            </button>
          </div>

          {/* Clear Logs */}
          <div classNome="flex items-end">
            <button
              onClick={clearLogs}
              classNome="px-3 py-2 text-sm bg-[#9e5c50]/20 text-[#9e5c50] border border-[#9e5c50]/30 rounded-md font-medium hover:bg-[#9e5c50]/30 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Log Stats */}
      <div classNome="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Mostraring {filteredLogs.length} of {logs.length} logs
        </div>
        <div>
          Auto-scroll: {isAutoScroll ? 'ON' : 'OFF'} • 
          Última atualização: {logs.length > 0 ? new Date(logs[0]?.timestamp).toLocaleTimeString() : 'Never'}
        </div>
      </div>

      {/* Log Display */}
      <div classNome="flex-1 bg-card border border-border rounded-lg overflow-hidden">
        <div 
          ref={logContainerRef}
          classNome="h-full overflow-auto p-4 space-y-2 font-mono text-sm"
        >
          {isLoading ? (
            <div classNome="flex items-center justify-center h-32">
              <div classNome="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span classNome="ml-3 text-muted-foreground">Loading logs...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div classNome="flex items-center justify-center h-32 text-muted-foreground">
              No logs match the current filters
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div 
                key={log.id} 
                classNome={`border-l-4 pl-4 py-2 rounded-r-md ${getLogLevelBg(log.level)}`}
              >
                <div classNome="flex items-start justify-between">
                  <div classNome="flex-1 min-w-0">
                    <div classNome="flex items-center space-x-2 text-xs">
                      <span classNome="text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span classNome={`font-medium uppercase ${getLogLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span classNome="text-muted-foreground">
                        [{log.source}]
                      </span>
                      {log.session && (
                        <span classNome="text-muted-foreground">
                          session:{log.session}
                        </span>
                      )}
                    </div>
                    <div classNome="mt-1 text-foreground break-words">
                      {log.message}
                    </div>
                    {log.data && (
                      <details classNome="mt-2">
                        <summary classNome="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                          Additional data
                        </summary>
                        <pre classNome="mt-1 text-xs text-muted-foreground overflow-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
