'use client'

import { useState, useEffect } from 'react'
import { useMissionControl } from '@/store'
import { createClientLogger } from '@/lib/client-logger'

const log = createClientLogger('AgentSpawnPanel')

interface SpawnFormData {
  task: string
  model: string
  label: string
  timeoutSeconds: number
}

export function AgentSpawnPanel() {
  const { 
    availableModels, 
    spawnRequests, 
    addSpawnRequest, 
    updateSpawnRequest 
  } = useMissionControl()

  const [formData, setFormData] = useState<SpawnFormData>({
    task: '',
    model: 'sonnet',
    label: '',
    timeoutSeconds: 300
  })

  const [isSpawning, setIsSpawning] = useState(false)
  const [spawnHistory, setSpawnHistory] = useState<any[]>([])

  useEffect(() => {
    // Load spawn history on mount
    fetch('/api/spawn')
      .then(res => res.json())
      .then(data => setSpawnHistory(data.history || []))
      .catch(err => log.error('Failed to load spawn history:', err))
  }, [])

  const handleSpawn = async () => {
    if (!formData.task.trim() || !formData.label.trim()) {
      alert('Please fill in task and label fields')
      return
    }

    setIsSpawning(true)

    const spawnId = `spawn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Add to store immediately
    addSpawnRequest({
      id: spawnId,
      task: formData.task,
      model: formData.model,
      label: formData.label,
      timeoutSeconds: formData.timeoutSeconds,
      status: 'pending',
      createdAt: Date.now()
    })

    try {
      const response = await fetch('/api/spawn', {
        method: 'POST',
        headers: {
          'Content-Tipo': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        // Update the spawn request with success
        updateSpawnRequest(spawnId, {
          status: 'running',
          result: result.sessionInfo || 'Agent spawned successfully'
        })

        // Clear form
        setFormData({
          task: '',
          model: 'sonnet',
          label: '',
          timeoutSeconds: 300
        })

        // Refresh history
        const historyResponse = await fetch('/api/spawn')
        const historyData = await historyResponse.json()
        setSpawnHistory(historyData.history || [])
      } else {
        // Update with error
        updateSpawnRequest(spawnId, {
          status: 'failed',
          error: result.error || 'Unknown error'
        })
      }
    } catch (error) {
      log.error('Spawn error:', error)
      updateSpawnRequest(spawnId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Network error'
      })
    } finally {
      setIsSpawning(false)
    }
  }

  const selectedModel = availableModels.find(m => m.alias === formData.model)

  return (
    <div classNome="p-6 space-y-6">
      <div classNome="border-b border-border pb-4">
        <h1 classNome="text-3xl font-bold text-foreground">Agent Spawn Control</h1>
        <p classNome="text-muted-foreground mt-2">
          Launch new sub-agents for specific tasks with custom parameters
        </p>
      </div>

      <div classNome="grid lg:grid-cols-2 gap-6">
        {/* Spawn Form */}
        <div classNome="bg-card border border-border rounded-lg p-6">
          <h2 classNome="text-xl font-semibold mb-4">Spawn New Agent</h2>
          
          <div classNome="space-y-4">
            {/* Task Input */}
            <div>
              <label classNome="block text-sm font-medium text-foreground mb-2">
                Task Descrição
              </label>
              <textarea
                value={formData.task}
                onChange={(e) => setFormData(prev => ({ ...prev, task: e.target.value }))}
                placeholder="Describe the task for the agent to execute..."
                classNome="w-full h-24 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isSpawning}
              />
            </div>

            {/* Model Selector */}
            <div>
              <label classNome="block text-sm font-medium text-foreground mb-2">
                Model
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                classNome="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isSpawning}
              >
                {availableModels.map((model) => (
                  <option key={model.alias} value={model.alias}>
                    {model.alias} - {model.description}
                  </option>
                ))}
              </select>
              {selectedModel && (
                <div classNome="mt-2 text-sm text-muted-foreground">
                  <div>Provider: {selectedModel.provider}</div>
                  <div>Cost: ${selectedModel.costPer1k}/1k tokens</div>
                </div>
              )}
            </div>

            {/* Label Input */}
            <div>
              <label classNome="block text-sm font-medium text-foreground mb-2">
                Agent Label
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., builder, analyzer, researcher"
                classNome="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isSpawning}
              />
            </div>

            {/* Timeout Setting */}
            <div>
              <label classNome="block text-sm font-medium text-foreground mb-2">
                Timeout (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="3600"
                value={formData.timeoutSeconds}
                onChange={(e) => setFormData(prev => ({ ...prev, timeoutSeconds: parseInt(e.target.value) || 300 }))}
                classNome="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isSpawning}
              />
              <div classNome="mt-1 text-sm text-muted-foreground">
                {Math.floor(formData.timeoutSeconds / 60)} minutes, {formData.timeoutSeconds % 60} seconds
              </div>
            </div>

            {/* Spawn Button */}
            <button
              onClick={handleSpawn}
              disabled={isSpawning || !formData.task.trim() || !formData.label.trim()}
              classNome="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSpawning ? 'Spawning Agent...' : 'Iniciar Agente'}
            </button>
          </div>
        </div>

        {/* Active Spawn Requests */}
        <div classNome="bg-card border border-border rounded-lg p-6">
          <h2 classNome="text-xl font-semibold mb-4">Active Requests</h2>
          
          <div classNome="space-y-3 max-h-96 overflow-y-auto">
            {spawnRequests.length === 0 ? (
              <div classNome="text-center text-muted-foreground py-8">
                No active spawn requests
              </div>
            ) : (
              spawnRequests.slice(0, 10).map((request) => (
                <div key={request.id} classNome="border border-border rounded-lg p-4">
                  <div classNome="flex items-start justify-between">
                    <div classNome="flex-1 min-w-0">
                      <div classNome="flex items-center space-x-2">
                        <span classNome="font-medium text-foreground">{request.label}</span>
                        <span classNome={`px-2 py-1 text-xs rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          request.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          request.status === 'completed' ? 'bg-[#b4a68c]/20 text-[#b4a68c]' :
                          'bg-[#9e5c50]/20 text-[#9e5c50]'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <div classNome="text-sm text-muted-foreground mt-1">
                        Model: {request.model} • Timeout: {request.timeoutSeconds}s
                      </div>
                      <div classNome="text-sm text-muted-foreground mt-1 truncate">
                        {request.task}
                      </div>
                      {request.error && (
                        <div classNome="text-sm text-[#9e5c50] mt-2">
                          Error: {request.error}
                        </div>
                      )}
                    </div>
                    <div classNome="text-xs text-muted-foreground ml-4">
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Spawn History */}
      {spawnHistory.length > 0 && (
        <div classNome="bg-card border border-border rounded-lg p-6">
          <h2 classNome="text-xl font-semibold mb-4">Recent Spawn History</h2>
          
          <div classNome="space-y-2 max-h-64 overflow-y-auto">
            {spawnHistory.map((item, index) => (
              <div key={index} classNome="flex items-center justify-between p-3 border border-border rounded">
                <div classNome="flex-1 min-w-0">
                  <div classNome="text-sm font-medium text-foreground">
                    {item.model} - {item.task.substring(0, 50)}
                    {item.task.length > 50 && '...'}
                  </div>
                  <div classNome="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
                <div classNome="text-xs text-[#b4a68c] ml-4">
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}