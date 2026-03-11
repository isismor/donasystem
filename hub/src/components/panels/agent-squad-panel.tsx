'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientLogger } from '@/lib/client-logger'

const log = createClientLogger('AgentSquadPanel')

interface Agent {
  id: number
  name: string
  role: string
  session_key?: string
  soul_content?: string
  status: 'offline' | 'idle' | 'busy' | 'error'
  last_seen?: number
  last_activity?: string
  created_at: number
  updated_at: number
  config?: any
  taskStats?: {
    total: number
    assigned: number
    in_progress: number
    completed: number
  }
}

const statusColors: Record<string, string> = {
  offline: 'bg-gray-500',
  idle: 'bg-[#b4a68c]',
  busy: 'bg-yellow-500',
  error: 'bg-[#9e5c50]',
}

const statusIcons: Record<string, string> = {
  offline: '⚫',
  idle: '🟢',
  busy: '🟡',
  error: '🔴',
}

export function AgentSquadPanel() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showCreateModal, setMostrarCreateModal] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Fetch agents
  const fetchAgents = useCallback(async () => {
    try {
      setError(null)
      if (agents.length === 0) setLoading(true)

      const response = await fetch('/api/agents')
      if (!response.ok) throw new Error('Failed to fetch agents')

      const data = await response.json()
      setAgents(data.agents || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [agents.length])

  // Initial load
  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchAgents, 10000) // Every 10 seconds
    return () => clearInterval(interval)
  }, [autoRefresh, fetchAgents])

  // Update agent status
  const updateAgentStatus = async (agentNome: string, status: Agent['status'], activity?: string) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'PUT',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({
          name: agentNome,
          status,
          last_activity: activity || `Status changed to ${status}`
        })
      })

      if (!response.ok) throw new Error('Failed to update agent status')
      
      // Update local state
      setAgents(prev => prev.map(agent => 
        agent.name === agentNome 
          ? { 
              ...agent, 
              status, 
              last_activity: activity || `Status changed to ${status}`,
              last_seen: Math.floor(Date.now() / 1000),
              updated_at: Math.floor(Date.now() / 1000)
            }
          : agent
      ))
    } catch (error) {
      log.error('Failed to update agent status:', error)
      setError('Failed to update agent status')
    }
  }

  // Format last seen time
  const formatLastSeen = (timestamp?: number) => {
    if (!timestamp) return 'Never'
    
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

  // Get status distribution for summary
  const statusCounts = agents.reduce((acc, agent) => {
    acc[agent.status] = (acc[agent.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading && agents.length === 0) {
    return (
      <div classNome="flex items-center justify-center h-64">
        <div classNome="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span classNome="ml-2 text-gray-400">Loading agents...</span>
      </div>
    )
  }

  return (
    <div classNome="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div classNome="flex justify-between items-center p-4 border-b border-gray-700">
        <div classNome="flex items-center gap-4">
          <h2 classNome="text-xl font-bold text-white">Agentes</h2>
          
          {/* Status Summary */}
          <div classNome="flex gap-2 text-sm">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} classNome="flex items-center gap-1">
                <div classNome={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
                <span classNome="text-gray-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div classNome="flex gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            classNome={`px-3 py-1 text-sm rounded transition-colors ${
              autoRefresh 
                ? 'bg-[#b4a68c] text-white hover:bg-[#7a6e5c]' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {autoRefresh ? 'Live' : 'Manual'}
          </button>
          <button
            onClick={() => setMostrarCreateModal(true)}
            classNome="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            + Add Agent
          </button>
          <button
            onClick={fetchAgents}
            classNome="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div classNome="bg-[#3d2520]/20 border border-[#9e5c50] text-[#9e5c50] p-3 m-4 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            classNome="float-right text-[#9e5c50] hover:text-[#c9a49c]"
          >
            ×
          </button>
        </div>
      )}

      {/* Agent Grid */}
      <div classNome="flex-1 p-4 overflow-y-auto">
        {agents.length === 0 ? (
          <div classNome="text-center text-gray-500 py-8">
            <div classNome="text-4xl mb-2">🤖</div>
            <p>Nenhum agente</p>
            <p classNome="text-sm">Add your first agent to get started</p>
          </div>
        ) : (
          <div classNome="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(agent => (
              <div
                key={agent.id}
                classNome="bg-gray-800 rounded-lg p-4 border-l-4 border-gray-600 hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => setSelectedAgent(agent)}
              >
                {/* Agent Header */}
                <div classNome="flex items-start justify-between mb-3">
                  <div>
                    <h3 classNome="font-semibold text-white text-lg">{agent.name}</h3>
                    <p classNome="text-gray-400 text-sm">{agent.role}</p>
                  </div>
                  
                  <div classNome="flex items-center gap-2">
                    <div classNome={`w-3 h-3 rounded-full ${statusColors[agent.status]} animate-pulse`}></div>
                    <span classNome="text-xs text-gray-400">{agent.status}</span>
                  </div>
                </div>

                {/* Session Info */}
                {agent.session_key && (
                  <div classNome="text-xs text-gray-400 mb-2">
                    <span classNome="font-medium">Session:</span> {agent.session_key}
                  </div>
                )}

                {/* Task Stats */}
                {agent.taskStats && (
                  <div classNome="grid grid-cols-2 gap-2 mb-3">
                    <div classNome="bg-gray-700/50 rounded p-2 text-center">
                      <div classNome="text-lg font-semibold text-white">{agent.taskStats.total}</div>
                      <div classNome="text-xs text-gray-400">Total Tasks</div>
                    </div>
                    <div classNome="bg-gray-700/50 rounded p-2 text-center">
                      <div classNome="text-lg font-semibold text-yellow-400">{agent.taskStats.in_progress}</div>
                      <div classNome="text-xs text-gray-400">In Progress</div>
                    </div>
                  </div>
                )}

                {/* Last Activity */}
                <div classNome="text-xs text-gray-400 mb-3">
                  <div>
                    <span classNome="font-medium">Last seen:</span> {formatLastSeen(agent.last_seen)}
                  </div>
                  {agent.last_activity && (
                    <div classNome="mt-1 truncate" title={agent.last_activity}>
                      <span classNome="font-medium">Activity:</span> {agent.last_activity}
                    </div>
                  )}
                </div>

                {/* Ações Rápidas */}
                <div classNome="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      updateAgentStatus(agent.name, 'idle', 'Manually activated')
                    }}
                    disabled={agent.status === 'idle'}
                    classNome="flex-1 px-2 py-1 text-xs bg-[#b4a68c] text-white rounded hover:bg-[#7a6e5c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Wake
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      updateAgentStatus(agent.name, 'busy', 'Manually set to busy')
                    }}
                    disabled={agent.status === 'busy'}
                    classNome="flex-1 px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Busy
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      updateAgentStatus(agent.name, 'offline', 'Manually set offline')
                    }}
                    disabled={agent.status === 'offline'}
                    classNome="flex-1 px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sleep
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onUpdate={fetchAgents}
          onStatusUpdate={updateAgentStatus}
        />
      )}

      {/* Create Agent Modal */}
      {showCreateModal && (
        <CreateAgentModal
          onClose={() => setMostrarCreateModal(false)}
          onCriado={fetchAgents}
        />
      )}
    </div>
  )
}

// Agent Detail Modal
function AgentDetailModal({
  agent,
  onClose,
  onUpdate,
  onStatusUpdate
}: {
  agent: Agent
  onClose: () => void
  onUpdate: () => void
  onStatusUpdate: (name: string, status: Agent['status'], activity?: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    role: agent.role,
    session_key: agent.session_key || '',
    soul_content: agent.soul_content || '',
  })

  const handleSave = async () => {
    try {
      const response = await fetch('/api/agents', {
        method: 'PUT',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({
          name: agent.name,
          ...formData
        })
      })

      if (!response.ok) throw new Error('Failed to update agent')
      
      setEditing(false)
      onUpdate()
    } catch (error) {
      log.error('Failed to update agent:', error)
    }
  }

  return (
    <div classNome="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div classNome="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div classNome="p-6">
          <div classNome="flex justify-between items-start mb-4">
            <div>
              <h3 classNome="text-xl font-bold text-white">{agent.name}</h3>
              <p classNome="text-gray-400">{agent.role}</p>
            </div>
            <div classNome="flex items-center gap-3">
              <div classNome={`w-4 h-4 rounded-full ${statusColors[agent.status]}`}></div>
              <span classNome="text-white">{agent.status}</span>
              <button onClick={onClose} classNome="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
          </div>

          {/* Status Controls */}
          <div classNome="mb-6 p-4 bg-gray-700/50 rounded-lg">
            <h4 classNome="text-sm font-medium text-white mb-2">Status Control</h4>
            <div classNome="flex gap-2">
              {(['idle', 'busy', 'offline'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => onStatusUpdate(agent.name, status)}
                  classNome={`px-3 py-1 text-sm rounded transition-colors ${
                    agent.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 text-white hover:bg-gray-500'
                  }`}
                >
                  {statusIcons[status]} {status}
                </button>
              ))}
            </div>
          </div>

          {/* Agent Detalhes */}
          <div classNome="space-y-4">
            <div>
              <label classNome="block text-sm font-medium text-gray-400 mb-1">Role</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  classNome="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p classNome="text-white">{agent.role}</p>
              )}
            </div>

            <div>
              <label classNome="block text-sm font-medium text-gray-400 mb-1">Session Key</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.session_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, session_key: e.target.value }))}
                  classNome="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p classNome="text-white font-mono">{agent.session_key || 'Not set'}</p>
              )}
            </div>

            <div>
              <label classNome="block text-sm font-medium text-gray-400 mb-1">SOUL Content</label>
              {editing ? (
                <textarea
                  value={formData.soul_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, soul_content: e.target.value }))}
                  rows={4}
                  classNome="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Agent personality and instructions..."
                />
              ) : (
                <p classNome="text-white whitespace-pre-wrap">{agent.soul_content || 'Not set'}</p>
              )}
            </div>

            {/* Task Statistics */}
            {agent.taskStats && (
              <div>
                <label classNome="block text-sm font-medium text-gray-400 mb-1">Task Statistics</label>
                <div classNome="grid grid-cols-4 gap-2">
                  <div classNome="bg-gray-700/50 rounded p-3 text-center">
                    <div classNome="text-lg font-semibold text-white">{agent.taskStats.total}</div>
                    <div classNome="text-xs text-gray-400">Total</div>
                  </div>
                  <div classNome="bg-gray-700/50 rounded p-3 text-center">
                    <div classNome="text-lg font-semibold text-blue-400">{agent.taskStats.assigned}</div>
                    <div classNome="text-xs text-gray-400">Assigned</div>
                  </div>
                  <div classNome="bg-gray-700/50 rounded p-3 text-center">
                    <div classNome="text-lg font-semibold text-yellow-400">{agent.taskStats.in_progress}</div>
                    <div classNome="text-xs text-gray-400">In Progress</div>
                  </div>
                  <div classNome="bg-gray-700/50 rounded p-3 text-center">
                    <div classNome="text-lg font-semibold text-[#b4a68c]">{agent.taskStats.completed}</div>
                    <div classNome="text-xs text-gray-400">Done</div>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div classNome="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span classNome="text-gray-400">Criado:</span>
                <span classNome="text-white ml-2">{new Date(agent.created_at * 1000).toLocaleDateString()}</span>
              </div>
              <div>
                <span classNome="text-gray-400">Last Atualizado:</span>
                <span classNome="text-white ml-2">{new Date(agent.updated_at * 1000).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div classNome="flex gap-3 mt-6">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  classNome="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  classNome="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                classNome="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Edit Agent
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Create Agent Modal
function CreateAgentModal({
  onClose,
  onCriado
}: {
  onClose: () => void
  onCriado: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    session_key: '',
    soul_content: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to create agent')
      
      onCriado()
      onClose()
    } catch (error) {
      log.error('Error creating agent:', error)
    }
  }

  return (
    <div classNome="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div classNome="bg-gray-800 rounded-lg max-w-md w-full">
        <form onSubmit={handleSubmit} classNome="p-6">
          <h3 classNome="text-xl font-bold text-white mb-4">Create New Agent</h3>
          
          <div classNome="space-y-4">
            <div>
              <label classNome="block text-sm text-gray-400 mb-1">Nome</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                classNome="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label classNome="block text-sm text-gray-400 mb-1">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                classNome="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., researcher, developer, analyst"
                required
              />
            </div>
            
            <div>
              <label classNome="block text-sm text-gray-400 mb-1">Session Key (Optional)</label>
              <input
                type="text"
                value={formData.session_key}
                onChange={(e) => setFormData(prev => ({ ...prev, session_key: e.target.value }))}
                classNome="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ClawdBot session identifier"
              />
            </div>
            
            <div>
              <label classNome="block text-sm text-gray-400 mb-1">SOUL Content (Optional)</label>
              <textarea
                value={formData.soul_content}
                onChange={(e) => setFormData(prev => ({ ...prev, soul_content: e.target.value }))}
                classNome="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Agent personality and instructions..."
              />
            </div>
          </div>
          
          <div classNome="flex gap-3 mt-6">
            <button
              type="submit"
              classNome="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Create Agent
            </button>
            <button
              type="button"
              onClick={onClose}
              classNome="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}