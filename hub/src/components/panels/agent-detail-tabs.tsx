'use client'

import { useState, useEffect } from 'react'
import { createClientLogger } from '@/lib/client-logger'
import Link from 'next/link'

const log = createClientLogger('AgentDetailTabs')

interface Agent {
  id: number
  name: string
  role: string
  session_key?: string
  soul_content?: string
  working_memory?: string
  status: 'offline' | 'idle' | 'busy' | 'error'
  last_seen?: number
  last_activity?: string
  created_at: number
  updated_at: number
  taskStats?: {
    total: number
    assigned: number
    in_progress: number
    completed: number
  }
}

interface WorkItem {
  type: string
  count: number
  items: any[]
}

interface HeartbeatResponse {
  status: 'HEARTBEAT_OK' | 'WORK_ITEMS_FOUND'
  agent: string
  checked_at: number
  work_items?: WorkItem[]
  total_items?: number
  message?: string
}

interface SoulTemplate {
  name: string
  description: string
  size: number
}

const statusColors: Record<string, string> = {
  offline: 'bg-gray-500',
  idle: 'bg-[#b4a68c]',
  busy: 'bg-yellow-500',
  error: 'bg-[#9e5c50]',
}

const statusIcons: Record<string, string> = {
  offline: '-',
  idle: 'o',
  busy: '~',
  error: '!',
}

// Overview Tab Component
export function OverviewTab({
  agent,
  editing,
  formData,
  setFormData,
  onSave,
  onStatusUpdate,
  onWakeAgent,
  onEdit,
  onCancel,
  heartbeatData,
  loadingHeartbeat,
  onPerformHeartbeat
}: {
  agent: Agent
  editing: boolean
  formData: any
  setFormData: (data: any) => void
  onSave: () => Promise<void>
  onStatusUpdate: (name: string, status: Agent['status'], activity?: string) => Promise<void>
  onWakeAgent: (name: string, sessionKey: string) => Promise<void>
  onEdit: () => void
  onCancel: () => void
  heartbeatData: HeartbeatResponse | null
  loadingHeartbeat: boolean
  onPerformHeartbeat: () => Promise<void>
}) {
  const [directMessage, setDirectMessage] = useState('')
  const [messageStatus, setMessageStatus] = useState<string | null>(null)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!directMessage.trim()) return
    try {
      setMessageStatus(null)
      const response = await fetch('/api/agents/message', {
        method: 'POST',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({
          to: agent.name,
          message: directMessage
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to send message')
      setDirectMessage('')
      setMessageStatus('Message sent')
    } catch (error) {
      setMessageStatus('Failed to send message')
    }
  }

  return (
    <div classNome="p-6 space-y-6">
      {/* Status Controls */}
      <div classNome="p-4 bg-surface-1/50 rounded-lg">
        <h4 classNome="text-sm font-medium text-foreground mb-3">Status Control</h4>
        <div classNome="flex gap-2 mb-3">
          {(['idle', 'busy', 'offline'] as const).map(status => (
            <button
              key={status}
              onClick={() => onStatusUpdate(agent.name, status)}
              classNome={`px-3 py-1 text-sm rounded transition-smooth ${
                agent.status === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-surface-2'
              }`}
            >
              {statusIcons[status]} {status}
            </button>
          ))}
        </div>

        {/* Wake Agent Button */}
        {agent.session_key && (
          <button
            onClick={() => onWakeAgent(agent.name, agent.session_key!)}
            classNome="w-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-2 rounded-md hover:bg-cyan-500/30 transition-smooth"
          >
            Wake Agent via Session
          </button>
        )}
      </div>

      {/* Direct Message */}
      <div classNome="p-4 bg-surface-1/50 rounded-lg">
        <h4 classNome="text-sm font-medium text-foreground mb-3">Direct Message</h4>
        {messageStatus && (
          <div classNome="text-xs text-foreground/80 mb-2">{messageStatus}</div>
        )}
        <form onSubmit={handleSendMessage} classNome="space-y-2">
          <div>
            <label classNome="block text-xs text-muted-foreground mb-1">Message</label>
            <textarea
              value={directMessage}
              onChange={(e) => setDirectMessage(e.target.value)}
              classNome="w-full bg-surface-1 text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              rows={3}
            />
          </div>
          <div classNome="flex justify-end">
            <button
              type="submit"
              classNome="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth text-xs"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>

      {/* Heartbeat Check */}
      <div classNome="p-4 bg-surface-1/50 rounded-lg">
        <div classNome="flex justify-between items-center mb-3">
          <h4 classNome="text-sm font-medium text-foreground">Heartbeat Check</h4>
          <button
            onClick={onPerformHeartbeat}
            disabled={loadingHeartbeat}
            classNome="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-smooth"
          >
            {loadingHeartbeat ? 'Checking...' : 'Check Now'}
          </button>
        </div>
        
        {heartbeatData && (
          <div classNome="space-y-2">
            <div classNome="text-sm text-foreground/80">
              <strong>Status:</strong> {heartbeatData.status}
            </div>
            <div classNome="text-sm text-foreground/80">
              <strong>Checked:</strong> {new Date(heartbeatData.checked_at * 1000).toLocaleString()}
            </div>
            
            {heartbeatData.work_items && heartbeatData.work_items.length > 0 && (
              <div classNome="mt-3">
                <div classNome="text-sm font-medium text-yellow-400 mb-2">
                  Work Items Found: {heartbeatData.total_items}
                </div>
                {heartbeatData.work_items.map((item, idx) => (
                  <div key={idx} classNome="text-sm text-foreground/80 ml-2">
                    • {item.type}: {item.count} items
                  </div>
                ))}
              </div>
            )}
            
            {heartbeatData.message && (
              <div classNome="text-sm text-foreground/80">
                <strong>Message:</strong> {heartbeatData.message}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Agent Detalhes */}
      <div classNome="space-y-4">
        <div>
          <label classNome="block text-sm font-medium text-muted-foreground mb-1">Role</label>
          {editing ? (
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, role: e.target.value }))}
              classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          ) : (
            <p classNome="text-foreground">{agent.role}</p>
          )}
        </div>

        <div>
          <label classNome="block text-sm font-medium text-muted-foreground mb-1">Session Key</label>
          {editing ? (
            <input
              type="text"
              value={formData.session_key}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, session_key: e.target.value }))}
              classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="OpenClaw session identifier"
            />
          ) : (
            <div classNome="flex items-center gap-2">
              <p classNome="text-foreground font-mono">{agent.session_key || 'Not set'}</p>
              {agent.session_key && (
                <div classNome="flex items-center gap-1 text-xs text-[#b4a68c]">
                  <div classNome="w-2 h-2 rounded-full bg-[#b4a68c]"></div>
                  <span>Bound</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Task Statistics */}
        {agent.taskStats && (
          <div>
            <label classNome="block text-sm font-medium text-muted-foreground mb-1">Task Statistics</label>
            <div classNome="grid grid-cols-4 gap-2">
              <div classNome="bg-surface-1/50 rounded p-3 text-center">
                <div classNome="text-lg font-semibold text-foreground">{agent.taskStats.total}</div>
                <div classNome="text-xs text-muted-foreground">Total</div>
              </div>
              <div classNome="bg-surface-1/50 rounded p-3 text-center">
                <div classNome="text-lg font-semibold text-blue-400">{agent.taskStats.assigned}</div>
                <div classNome="text-xs text-muted-foreground">Assigned</div>
              </div>
              <div classNome="bg-surface-1/50 rounded p-3 text-center">
                <div classNome="text-lg font-semibold text-yellow-400">{agent.taskStats.in_progress}</div>
                <div classNome="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div classNome="bg-surface-1/50 rounded p-3 text-center">
                <div classNome="text-lg font-semibold text-[#b4a68c]">{agent.taskStats.completed}</div>
                <div classNome="text-xs text-muted-foreground">Done</div>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div classNome="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span classNome="text-muted-foreground">Criado:</span>
            <span classNome="text-foreground ml-2">{new Date(agent.created_at * 1000).toLocaleDateString()}</span>
          </div>
          <div>
            <span classNome="text-muted-foreground">Last Atualizado:</span>
            <span classNome="text-foreground ml-2">{new Date(agent.updated_at * 1000).toLocaleDateString()}</span>
          </div>
          {agent.last_seen && (
            <div classNome="col-span-2">
              <span classNome="text-muted-foreground">Last Seen:</span>
              <span classNome="text-foreground ml-2">{new Date(agent.last_seen * 1000).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ações */}
      <div classNome="flex gap-3 mt-6">
        {editing ? (
          <>
            <button
              onClick={onSave}
              classNome="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-smooth"
            >
              Save Changes
            </button>
            <button
              onClick={onCancel}
              classNome="flex-1 bg-secondary text-muted-foreground py-2 rounded-md hover:bg-surface-2 transition-smooth"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            classNome="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-smooth"
          >
            Edit Agent
          </button>
        )}
      </div>
    </div>
  )
}

// SOUL Tab Component
export function SoulTab({
  agent,
  soulContent,
  templates,
  onSave
}: {
  agent: Agent
  soulContent: string
  templates: SoulTemplate[]
  onSave: (content: string, templateNome?: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(soulContent)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  useEffect(() => {
    setContent(soulContent)
  }, [soulContent])

  const handleSave = async () => {
    await onSave(content)
    setEditing(false)
  }

  const handleLoadTemplate = async (templateNome: string) => {
    try {
      const response = await fetch(`/api/agents/${agent.name}/soul?template=${templateNome}`, {
        method: 'PATCH'
      })
      if (response.ok) {
        const data = await response.json()
        setContent(data.content)
        setSelectedTemplate(templateNome)
      }
    } catch (error) {
      log.error('Failed to load template:', error)
    }
  }

  return (
    <div classNome="p-6 space-y-4">
      <div classNome="flex justify-between items-center">
        <h4 classNome="text-lg font-medium text-foreground">SOUL Configuração</h4>
        <div classNome="flex gap-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              classNome="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
            >
              Edit SOUL
            </button>
          )}
        </div>
      </div>

      {/* Template Selector */}
      {editing && templates.length > 0 && (
        <div classNome="p-4 bg-surface-1/50 rounded-lg">
          <h5 classNome="text-sm font-medium text-foreground mb-2">Load Template</h5>
          <div classNome="flex gap-2">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              classNome="flex-1 bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="">Select a template...</option>
              {templates.map(template => (
                <option key={template.name} value={template.name}>
                  {template.description} ({template.size} chars)
                </option>
              ))}
            </select>
            <button
              onClick={() => selectedTemplate && handleLoadTemplate(selectedTemplate)}
              disabled={!selectedTemplate}
              classNome="px-4 py-2 bg-[#b4a68c]/20 text-[#b4a68c] border border-[#b4a68c]/30 rounded-md hover:bg-[#b4a68c]/30 disabled:opacity-50 transition-smooth"
            >
              Load
            </button>
          </div>
        </div>
      )}

      {/* SOUL Editor */}
      <div>
        <label classNome="block text-sm font-medium text-muted-foreground mb-1">
          SOUL Content ({content.length} characters)
        </label>
        {editing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-sm"
            placeholder="Define the agent's personality, instructions, and behavior patterns..."
          />
        ) : (
          <div classNome="bg-surface-1/30 rounded p-4 max-h-96 overflow-y-auto">
            {content ? (
              <pre classNome="text-foreground whitespace-pre-wrap text-sm">{content}</pre>
            ) : (
              <p classNome="text-muted-foreground italic">No SOUL content defined</p>
            )}
          </div>
        )}
      </div>

      {/* Ações */}
      {editing && (
        <div classNome="flex gap-3">
          <button
            onClick={handleSave}
            classNome="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-smooth"
          >
            Save SOUL
          </button>
          <button
            onClick={() => {
              setEditing(false)
              setContent(soulContent)
            }}
            classNome="flex-1 bg-secondary text-muted-foreground py-2 rounded-md hover:bg-surface-2 transition-smooth"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

// Memória Tab Component
export function MemóriaTab({
  agent,
  workingMemória,
  onSave
}: {
  agent: Agent
  workingMemória: string
  onSave: (content: string, append?: boolean) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(workingMemória)
  const [appendMode, setAppendMode] = useState(false)
  const [newEntry, setNewEntry] = useState('')

  useEffect(() => {
    setContent(workingMemória)
  }, [workingMemória])

  const handleSave = async () => {
    if (appendMode && newEntry.trim()) {
      await onSave(newEntry, true)
      setNewEntry('')
      setAppendMode(false)
    } else {
      await onSave(content)
    }
    setEditing(false)
  }

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear all working memory?')) {
      await onSave('')
      setContent('')
      setEditing(false)
    }
  }

  return (
    <div classNome="p-6 space-y-4">
      <div classNome="flex justify-between items-center">
        <div>
          <h4 classNome="text-lg font-medium text-foreground">Working Memória</h4>
          <p classNome="text-xs text-muted-foreground mt-1">
            This is <strong classNome="text-foreground">agent-level</strong> scratchpad memory (stored as WORKING.md in the database), not the workspace memory folder.
          </p>
        </div>
        <div classNome="flex gap-2">
          {!editing && (
            <>
              <button
                onClick={() => {
                  setAppendMode(true)
                  setEditing(true)
                }}
                classNome="px-3 py-1 text-sm bg-[#b4a68c]/20 text-[#b4a68c] border border-[#b4a68c]/30 rounded-md hover:bg-[#b4a68c]/30 transition-smooth"
              >
                Add Entry
              </button>
              <button
                onClick={() => setEditing(true)}
                classNome="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              >
                Edit Memória
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div classNome="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300">
        <strong classNome="text-blue-200">Agent Memória vs Workspace Memória:</strong>{' '}
        This tab edits only this agent&apos;s private working memory (a scratchpad stored in the database).
        To browse or edit all workspace memory files (daily logs, knowledge base, MEMORY.md, etc.), visit the{' '}
        <Link href="/memory" classNome="text-blue-400 underline hover:text-blue-300">Memória Browser</Link> page.
      </div>

      {/* Memória Content */}
      <div>
        <label classNome="block text-sm font-medium text-muted-foreground mb-1">
          Memória Content ({content.length} characters)
        </label>
        
        {editing && appendMode ? (
          <div classNome="space-y-2">
            <div classNome="bg-surface-1/30 rounded p-4 max-h-40 overflow-y-auto">
              <pre classNome="text-foreground whitespace-pre-wrap text-sm">{content}</pre>
            </div>
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              rows={5}
              classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="Add new memory entry..."
            />
          </div>
        ) : editing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-sm"
            placeholder="Working memory for temporary notes, current tasks, and session data..."
          />
        ) : (
          <div classNome="bg-surface-1/30 rounded p-4 max-h-96 overflow-y-auto">
            {content ? (
              <pre classNome="text-foreground whitespace-pre-wrap text-sm">{content}</pre>
            ) : (
              <p classNome="text-muted-foreground italic">No working memory content</p>
            )}
          </div>
        )}
      </div>

      {/* Ações */}
      {editing && (
        <div classNome="flex gap-3">
          <button
            onClick={handleSave}
            classNome="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-smooth"
          >
            {appendMode ? 'Add Entry' : 'Save Memória'}
          </button>
          <button
            onClick={() => {
              setEditing(false)
              setAppendMode(false)
              setContent(workingMemória)
              setNewEntry('')
            }}
            classNome="flex-1 bg-secondary text-muted-foreground py-2 rounded-md hover:bg-surface-2 transition-smooth"
          >
            Cancel
          </button>
          {!appendMode && (
            <button
              onClick={handleClear}
              classNome="px-4 py-2 bg-[#9e5c50]/20 text-[#9e5c50] border border-[#9e5c50]/30 rounded-md hover:bg-[#9e5c50]/30 transition-smooth"
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Tasks Tab Component
export function TasksTab({ agent }: { agent: Agent }) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks?assigned_to=${agent.name}`)
        if (response.ok) {
          const data = await response.json()
          setTasks(data.tasks || [])
        }
      } catch (error) {
        log.error('Failed to fetch tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [agent.name])

  if (loading) {
    return (
      <div classNome="p-6">
        <div classNome="flex items-center justify-center py-8">
          <div classNome="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span classNome="ml-2 text-muted-foreground">Loading tasks...</span>
        </div>
      </div>
    )
  }

  return (
    <div classNome="p-6 space-y-4">
      <h4 classNome="text-lg font-medium text-foreground">Assigned Tasks</h4>
      
      {tasks.length === 0 ? (
        <div classNome="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
          <div classNome="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center mb-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="2" width="10" height="12" rx="1" />
              <path d="M6 6h4M6 9h3" />
            </svg>
          </div>
          <p classNome="text-sm">No tasks assigned</p>
        </div>
      ) : (
        <div classNome="space-y-3">
          {tasks.map(task => (
            <div key={task.id} classNome="bg-surface-1/50 rounded-lg p-4">
              <div classNome="flex items-start justify-between">
                <div>
                  <Link href={`/tasks?taskId=${task.id}`} classNome="font-medium text-foreground hover:text-primary transition-colors">
                    {task.title}
                  </Link>
                  <div classNome="text-xs text-muted-foreground mt-1">
                    {task.ticket_ref || `Task #${task.id}`}
                    {task.project_name ? ` · ${task.project_name}` : ''}
                  </div>
                  {task.description && (
                    <p classNome="text-foreground/80 text-sm mt-1">{task.description}</p>
                  )}
                </div>
                <div classNome="flex items-center gap-2">
                  <span classNome={`px-2 py-1 text-xs rounded-md font-medium ${
                    task.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    task.status === 'done' ? 'bg-[#b4a68c]/20 text-[#b4a68c]' :
                    task.status === 'review' ? 'bg-blue-500/20 text-blue-400' :
                    task.status === 'quality_review' ? 'bg-indigo-500/20 text-indigo-400' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {task.status}
                  </span>
                  <span classNome={`px-2 py-1 text-xs rounded-md font-medium ${
                    task.priority === 'urgent' ? 'bg-[#9e5c50]/20 text-[#9e5c50]' :
                    task.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              
              {task.due_date && (
                <div classNome="text-xs text-muted-foreground mt-2">
                  Due: {new Date(task.due_date * 1000).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Activity Tab Component
export function ActivityTab({ agent }: { agent: Agent }) {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/activities?actor=${agent.name}&limit=50`)
        if (response.ok) {
          const data = await response.json()
          setActivities(data.activities || [])
        }
      } catch (error) {
        log.error('Failed to fetch activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [agent.name])

  if (loading) {
    return (
      <div classNome="p-6">
        <div classNome="flex items-center justify-center py-8">
          <div classNome="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span classNome="ml-2 text-muted-foreground">Loading activity...</span>
        </div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'agent_status_change': return '~'
      case 'task_created': return '+'
      case 'task_updated': return '>'
      case 'comment_added': return '#'
      case 'agent_heartbeat': return '*'
      case 'agent_soul_updated': return '@'
      case 'agent_memory_updated': return '='
      default: return '.'
    }
  }

  return (
    <div classNome="p-6 space-y-4">
      <h4 classNome="text-lg font-medium text-foreground">Atividade Recente</h4>
      
      {activities.length === 0 ? (
        <div classNome="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
          <div classNome="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center mb-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 4h12M2 8h8M2 12h10" />
            </svg>
          </div>
          <p classNome="text-sm">No recent activity</p>
        </div>
      ) : (
        <div classNome="space-y-3">
          {activities.map(activity => (
            <div key={activity.id} classNome="bg-surface-1/50 rounded-lg p-4">
              <div classNome="flex items-start gap-3">
                <div classNome="text-2xl">{getActivityIcon(activity.type)}</div>
                <div classNome="flex-1">
                  <p classNome="text-foreground">{activity.description}</p>
                  <div classNome="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{activity.type}</span>
                    <span>•</span>
                    <span>{new Date(activity.created_at * 1000).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ===== NEW COMPONENTS: CreateAgentModal (template wizard) + ConfigTab =====
// These replace the old CreateAgentModal and add the Config tab

// Template data for the wizard (client-side mirror of agent-templates.ts)
const TEMPLATES = [
  { type: 'orchestrator', label: 'Orchestrator', emoji: '\ud83e\udded', description: 'Primary coordinator with full tool access', modelTier: 'opus' as const, toolCount: 23, theme: 'operator strategist' },
  { type: 'developer', label: 'Developer', emoji: '\ud83d\udee0\ufe0f', description: 'Full-stack builder with Docker bridge', modelTier: 'sonnet' as const, toolCount: 21, theme: 'builder engineer' },
  { type: 'specialist-dev', label: 'Specialist Dev', emoji: '\u2699\ufe0f', description: 'Focused developer for specific domains', modelTier: 'sonnet' as const, toolCount: 15, theme: 'specialist developer' },
  { type: 'reviewer', label: 'Reviewer / QA', emoji: '\ud83d\udd2c', description: 'Read-only code review and quality gates', modelTier: 'haiku' as const, toolCount: 7, theme: 'quality reviewer' },
  { type: 'researcher', label: 'Researcher', emoji: '\ud83d\udd0d', description: 'Browser and web access for research', modelTier: 'sonnet' as const, toolCount: 8, theme: 'research analyst' },
  { type: 'content-creator', label: 'Content Creator', emoji: '\u270f\ufe0f', description: 'Write and edit for content generation', modelTier: 'haiku' as const, toolCount: 9, theme: 'content creator' },
  { type: 'security-auditor', label: 'Security Auditor', emoji: '\ud83d\udee1\ufe0f', description: 'Read-only + bash for security scanning', modelTier: 'sonnet' as const, toolCount: 10, theme: 'security auditor' },
]

const MODEL_TIER_COLORS: Record<string, string> = {
  opus: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  sonnet: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  haiku: 'bg-[#b4a68c]/20 text-[#b4a68c] border-[#b4a68c]/30',
}

const MODEL_TIER_LABELS: Record<string, string> = {
  opus: 'Opus $$$',
  sonnet: 'Sonnet $$',
  haiku: 'Haiku $',
}

const DEFAULT_MODEL_BY_TIER: Record<'opus' | 'sonnet' | 'haiku', string> = {
  opus: 'anthropic/claude-opus-4-5',
  sonnet: 'anthropic/claude-sonnet-4-20250514',
  haiku: 'anthropic/claude-haiku-4-5',
}

// Enhanced Create Agent Modal with Template Wizard
export function CreateAgentModal({
  onClose,
  onCriado
}: {
  onClose: () => void
  onCriado: () => void
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    role: '',
    emoji: '',
    modelTier: 'sonnet' as 'opus' | 'sonnet' | 'haiku',
    modelPrimary: DEFAULT_MODEL_BY_TIER.sonnet,
    workspaceAccess: 'rw' as 'rw' | 'ro' | 'none',
    sandboxMode: 'all' as 'all' | 'non-main',
    dockerNetwork: 'none' as 'none' | 'bridge',
    session_key: '',
    write_to_gateway: true,
    provision_openclaw_workspace: true,
  })
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedTemplateData = TEMPLATES.find(t => t.type === selectedTemplate)

  // Auto-generate kebab-case ID from name
  const updateNome = (name: string) => {
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setFormData(prev => ({ ...prev, name, id }))
  }

  useEffect(() => {
    const loadAvailableModels = async () => {
      try {
        const response = await fetch('/api/status?action=models')
        if (!response.ok) return
        const data = await response.json()
        const models = Array.isArray(data.models) ? data.models : []
        const names = models
          .map((model: any) => String(model.name || model.alias || '').trim())
          .filter(Boolean)
        setAvailableModels(Array.from(new Set<string>(names)))
      } catch {
        // Keep modal usable without model suggestions.
      }
    }
    loadAvailableModels()
  }, [])

  // When template is selected, pre-fill form
  const selectTemplate = (type: string | null) => {
    setSelectedTemplate(type)
    if (type) {
      const tmpl = TEMPLATES.find(t => t.type === type)
      if (tmpl) {
        setFormData(prev => ({
          ...prev,
          role: tmpl.theme,
          emoji: tmpl.emoji,
          modelTier: tmpl.modelTier,
          modelPrimary: DEFAULT_MODEL_BY_TIER[tmpl.modelTier],
          workspaceAccess: type === 'researcher' || type === 'content-creator' ? 'none' : type === 'reviewer' || type === 'security-auditor' ? 'ro' : 'rw',
          sandboxMode: type === 'orchestrator' ? 'non-main' : 'all',
          dockerNetwork: type === 'developer' || type === 'specialist-dev' ? 'bridge' : 'none',
        }))
      }
    }
  }

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setError('Nome is required')
      return
    }
    setIsCreating(true)
    setError(null)
    try {
      const primaryModel = formData.modelPrimary.trim() || DEFAULT_MODEL_BY_TIER[formData.modelTier]
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          openclaw_id: formData.id || undefined,
          role: formData.role,
          session_key: formData.session_key || undefined,
          template: selectedTemplate || undefined,
          write_to_gateway: formData.write_to_gateway,
          provision_openclaw_workspace: formData.provision_openclaw_workspace,
          gateway_config: {
            model: { primary: primaryModel },
            identity: { name: formData.name, theme: formData.role, emoji: formData.emoji },
            sandbox: {
              mode: formData.sandboxMode,
              workspaceAccess: formData.workspaceAccess,
              scope: 'agent',
              ...(formData.dockerNetwork === 'bridge' ? { docker: { network: 'bridge' } } : {}),
            },
          },
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create agent')
      }
      onCriado()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div classNome="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div classNome="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div classNome="p-6 border-b border-border flex-shrink-0">
          <div classNome="flex justify-between items-center">
            <div>
              <h3 classNome="text-xl font-bold text-foreground">Create New Agent</h3>
              <div classNome="flex gap-3 mt-2">
                {[1, 2, 3].map(s => (
                  <div key={s} classNome="flex items-center gap-1.5">
                    <div classNome={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      step === s ? 'bg-primary text-primary-foreground' :
                      step > s ? 'bg-[#b4a68c]/20 text-[#b4a68c]' :
                      'bg-surface-2 text-muted-foreground'
                    }`}>
                      {step > s ? '\u2713' : s}
                    </div>
                    <span classNome={`text-xs ${step === s ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {s === 1 ? 'Template' : s === 2 ? 'Configure' : 'Review'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={onClose} classNome="text-muted-foreground hover:text-foreground text-2xl">x</button>
          </div>
        </div>

        {/* Content */}
        <div classNome="flex-1 overflow-y-auto p-6">
          {error && (
            <div classNome="bg-[#9e5c50]/10 border border-[#9e5c50]/20 text-[#9e5c50] p-3 mb-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Choose Template */}
          {step === 1 && (
            <div classNome="grid grid-cols-2 gap-3">
              {TEMPLATES.map(tmpl => (
                <button
                  key={tmpl.type}
                  onClick={() => { selectTemplate(tmpl.type); setStep(2) }}
                  classNome={`p-4 rounded-lg border text-left transition-smooth hover:bg-surface-1 ${
                    selectedTemplate === tmpl.type ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div classNome="flex items-center gap-2 mb-2">
                    <span classNome="text-2xl">{tmpl.emoji}</span>
                    <span classNome="font-semibold text-foreground">{tmpl.label}</span>
                  </div>
                  <p classNome="text-xs text-muted-foreground mb-2">{tmpl.description}</p>
                  <div classNome="flex gap-2">
                    <span classNome={`px-2 py-0.5 text-xs rounded border ${MODEL_TIER_COLORS[tmpl.modelTier]}`}>
                      {MODEL_TIER_LABELS[tmpl.modelTier]}
                    </span>
                    <span classNome="px-2 py-0.5 text-xs rounded bg-surface-2 text-muted-foreground">
                      {tmpl.toolCount} tools
                    </span>
                  </div>
                </button>
              ))}
              {/* Custom option */}
              <button
                onClick={() => { selectTemplate(null); setStep(2) }}
                classNome={`p-4 rounded-lg border text-left transition-smooth hover:bg-surface-1 border-dashed ${
                  selectedTemplate === null ? 'border-primary' : 'border-border'
                }`}
              >
                <div classNome="flex items-center gap-2 mb-2">
                  <span classNome="text-2xl">+</span>
                  <span classNome="font-semibold text-foreground">Custom</span>
                </div>
                <p classNome="text-xs text-muted-foreground">Start from scratch with blank config</p>
              </button>
            </div>
          )}

          {/* Step 2: Configure */}
          {step === 2 && (
            <div classNome="space-y-4">
              <div classNome="grid grid-cols-2 gap-4">
                <div>
                  <label classNome="block text-sm text-muted-foreground mb-1">Display Nome *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateNome(e.target.value)}
                    classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    placeholder="e.g., Frontend Dev"
                    autoFocus
                  />
                </div>
                <div>
                  <label classNome="block text-sm text-muted-foreground mb-1">Agent ID</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                    classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-sm"
                    placeholder="frontend-dev"
                  />
                </div>
              </div>

              <div classNome="grid grid-cols-2 gap-4">
                <div>
                  <label classNome="block text-sm text-muted-foreground mb-1">Role / Tema</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    placeholder="builder engineer"
                  />
                </div>
                <div>
                  <label classNome="block text-sm text-muted-foreground mb-1">Emoji</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                    classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    placeholder="e.g. \ud83d\udee0\ufe0f"
                  />
                </div>
              </div>

              <div>
                <label classNome="block text-sm text-muted-foreground mb-1">Model Tier</label>
                <div classNome="flex gap-2">
                  {(['opus', 'sonnet', 'haiku'] as const).map(tier => (
                    <button
                      key={tier}
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        modelTier: tier,
                        modelPrimary: DEFAULT_MODEL_BY_TIER[tier],
                      }))}
                      classNome={`flex-1 px-3 py-2 text-sm rounded-md border transition-smooth ${
                        formData.modelTier === tier ? MODEL_TIER_COLORS[tier] + ' border' : 'bg-surface-1 text-muted-foreground border-border'
                      }`}
                    >
                      {MODEL_TIER_LABELS[tier]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label classNome="block text-sm text-muted-foreground mb-1">Primary Model</label>
                <input
                  type="text"
                  value={formData.modelPrimary}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelPrimary: e.target.value }))}
                  list="create-agent-model-suggestions"
                  classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono text-sm"
                  placeholder={DEFAULT_MODEL_BY_TIER[formData.modelTier]}
                />
                <datalist id="create-agent-model-suggestions">
                  {availableModels.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              <div classNome="grid grid-cols-3 gap-4">
                <div>
                  <label classNome="block text-sm text-muted-foreground mb-1">Workspace</label>
                  <select
                    value={formData.workspaceAccess}
                    onChange={(e) => setFormData(prev => ({ ...prev, workspaceAccess: e.target.value as any }))}
                    classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    <option value="rw">Read/Write</option>
                    <option value="ro">Read Only</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label classNome="block text-sm text-muted-foreground mb-1">Sandbox</label>
                  <select
                    value={formData.sandboxMode}
                    onChange={(e) => setFormData(prev => ({ ...prev, sandboxMode: e.target.value as any }))}
                    classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    <option value="all">All (Docker)</option>
                    <option value="non-main">Non-main</option>
                  </select>
                </div>
                <div>
                  <label classNome="block text-sm text-muted-foreground mb-1">Network</label>
                  <select
                    value={formData.dockerNetwork}
                    onChange={(e) => setFormData(prev => ({ ...prev, dockerNetwork: e.target.value as any }))}
                    classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    <option value="none">None (isolated)</option>
                    <option value="bridge">Bridge (internet)</option>
                  </select>
                </div>
              </div>

              <div>
                <label classNome="block text-sm text-muted-foreground mb-1">Session Key (optional)</label>
                <input
                  type="text"
                  value={formData.session_key}
                  onChange={(e) => setFormData(prev => ({ ...prev, session_key: e.target.value }))}
                  classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="OpenClaw session identifier"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div classNome="space-y-4">
              <div classNome="bg-surface-1/50 rounded-lg p-4 space-y-3">
                <div classNome="flex items-center gap-3">
                  <span classNome="text-3xl">{formData.emoji || (selectedTemplateData?.emoji || '?')}</span>
                  <div>
                    <h4 classNome="text-lg font-bold text-foreground">{formData.name || 'Unnamed'}</h4>
                    <p classNome="text-muted-foreground text-sm">{formData.role}</p>
                  </div>
                </div>

                <div classNome="grid grid-cols-2 gap-2 text-sm">
                  <div><span classNome="text-muted-foreground">ID:</span> <span classNome="text-foreground font-mono">{formData.id}</span></div>
                  <div><span classNome="text-muted-foreground">Template:</span> <span classNome="text-foreground">{selectedTemplateData?.label || 'Custom'}</span></div>
                  <div><span classNome="text-muted-foreground">Model:</span> <span classNome={`px-2 py-0.5 rounded text-xs ${MODEL_TIER_COLORS[formData.modelTier]}`}>{MODEL_TIER_LABELS[formData.modelTier]}</span></div>
                  <div><span classNome="text-muted-foreground">Tools:</span> <span classNome="text-foreground">{selectedTemplateData?.toolCount || 'Custom'}</span></div>
                  <div classNome="col-span-2"><span classNome="text-muted-foreground">Primary Model:</span> <span classNome="text-foreground font-mono">{formData.modelPrimary || DEFAULT_MODEL_BY_TIER[formData.modelTier]}</span></div>
                  <div><span classNome="text-muted-foreground">Workspace:</span> <span classNome="text-foreground">{formData.workspaceAccess}</span></div>
                  <div><span classNome="text-muted-foreground">Sandbox:</span> <span classNome="text-foreground">{formData.sandboxMode}</span></div>
                  <div><span classNome="text-muted-foreground">Network:</span> <span classNome="text-foreground">{formData.dockerNetwork}</span></div>
                  {formData.session_key && (
                    <div><span classNome="text-muted-foreground">Session:</span> <span classNome="text-foreground font-mono">{formData.session_key}</span></div>
                  )}
                </div>
              </div>

              <label classNome="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.write_to_gateway}
                  onChange={(e) => setFormData(prev => ({ ...prev, write_to_gateway: e.target.checked }))}
                  classNome="w-4 h-4 rounded border-border"
                />
                <span classNome="text-sm text-foreground">Add to gateway config (openclaw.json)</span>
              </label>

              <label classNome="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.provision_openclaw_workspace}
                  onChange={(e) => setFormData(prev => ({ ...prev, provision_openclaw_workspace: e.target.checked }))}
                  classNome="w-4 h-4 rounded border-border"
                />
                <span classNome="text-sm text-foreground">Provision full OpenClaw workspace (`openclaw agents add`)</span>
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div classNome="p-6 border-t border-border flex gap-3 flex-shrink-0">
          {step > 1 && (
            <button
              onClick={() => setStep((step - 1) as 1 | 2)}
              classNome="px-4 py-2 bg-secondary text-muted-foreground rounded-md hover:bg-surface-2 transition-smooth"
            >
              Back
            </button>
          )}
          <div classNome="flex-1" />
          {step < 3 ? (
            <button
              onClick={() => setStep((step + 1) as 2 | 3)}
              disabled={step === 2 && !formData.name.trim()}
              classNome="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-smooth"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={isCreating || !formData.name.trim()}
              classNome="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-smooth"
            >
              {isCreating ? 'Creating...' : 'Create Agent'}
            </button>
          )}
          <button onClick={onClose} classNome="px-4 py-2 bg-secondary text-muted-foreground rounded-md hover:bg-surface-2 transition-smooth">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// Config Tab Component for Agent Detail Modal
export function ConfigTab({
  agent,
  onSave
}: {
  agent: Agent & { config?: any }
  onSave: () => void
}) {
  const [config, setConfig] = useState<any>(agent.config || {})
  const [editing, setEditing] = useState(false)
  const [showJson, setMostrarJson] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jsonInput, setJsonInput] = useState('')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [newFallbackModel, setNewFallbackModel] = useState('')
  const [newAllowTool, setNewAllowTool] = useState('')
  const [newDenyTool, setNewDenyTool] = useState('')

  useEffect(() => {
    setConfig(agent.config || {})
    setJsonInput(JSON.stringify(agent.config || {}, null, 2))
  }, [agent.config])

  useEffect(() => {
    const loadAvailableModels = async () => {
      try {
        const response = await fetch('/api/status?action=models')
        if (!response.ok) return
        const data = await response.json()
        const models = Array.isArray(data.models) ? data.models : []
        const names = models
          .map((model: any) => String(model.name || model.alias || '').trim())
          .filter(Boolean)
        setAvailableModels(Array.from(new Set<string>(names)))
      } catch {
        // Ignore model suggestions if unavailable.
      }
    }
    loadAvailableModels()
  }, [])

  const updateModelConfig = (updater: (current: { primary?: string; fallbacks?: string[] }) => { primary?: string; fallbacks?: string[] }) => {
    setConfig((prev: any) => {
      const nextModel = updater({ ...(prev?.model || {}) })
      const dedupedFallbacks = [...new Set((nextModel.fallbacks || []).map((value) => value.trim()).filter(Boolean))]
      return {
        ...prev,
        model: {
          ...nextModel,
          fallbacks: dedupedFallbacks,
        },
      }
    })
  }

  const addFallbackModel = () => {
    const trimmed = newFallbackModel.trim()
    if (!trimmed) return
    updateModelConfig((current) => ({
      ...current,
      fallbacks: [...(current.fallbacks || []), trimmed],
    }))
    setNewFallbackModel('')
  }

  const updateIdentityField = (field: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      identity: { ...(prev.identity || {}), [field]: value },
    }))
  }

  const updateSandboxField = (field: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      sandbox: { ...(prev.sandbox || {}), [field]: value },
    }))
  }

  const addTool = (list: 'allow' | 'deny', value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    setConfig((prev: any) => {
      const tools = prev.tools || {}
      const existing = Array.isArray(tools[list]) ? tools[list] : []
      if (existing.includes(trimmed)) return prev
      return { ...prev, tools: { ...tools, [list]: [...existing, trimmed] } }
    })
  }

  const removeTool = (list: 'allow' | 'deny', index: number) => {
    setConfig((prev: any) => {
      const tools = prev.tools || {}
      const existing = Array.isArray(tools[list]) ? [...tools[list]] : []
      existing.splice(index, 1)
      return { ...prev, tools: { ...tools, [list]: existing } }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      if (!showJson) {
        const primary = String(config?.model?.primary || '').trim()
        if (!primary) {
          throw new Error('Primary model is required')
        }
      }
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PUT',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({
          gateway_config: showJson ? JSON.parse(jsonInput) : config,
          write_to_gateway: true,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to save')
      setEditing(false)
      onSave()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const model = config.model || {}
  const identity = config.identity || {}
  const sandbox = config.sandbox || {}
  const tools = config.tools || {}
  const subagents = config.subagents || {}
  const memorySearch = config.memorySearch || {}
  const sandboxMode = sandbox.mode || sandbox.sandboxMode || sandbox.sandbox_mode || config.sandboxMode || 'not configured'
  const sandboxWorkspace = sandbox.workspaceAccess || sandbox.workspace_access || sandbox.workspace || config.workspaceAccess || 'not configured'
  const sandboxNetwork = sandbox?.docker?.network || sandbox.network || sandbox.dockerNetwork || sandbox.docker_network || 'none'
  const identityNome = identity.name || agent.name || 'not configured'
  const identityTema = identity.theme || agent.role || 'not configured'
  const identityEmoji = identity.emoji || '?'
  const identityPreview = identity.content || ''
  const toolAllow = Array.isArray(tools.allow) ? tools.allow : []
  const toolDeny = Array.isArray(tools.deny) ? tools.deny : []
  const toolRawPreview = typeof tools.raw === 'string' ? tools.raw : ''
  const modelPrimary = model.primary || ''
  const modelFallbacks = Array.isArray(model.fallbacks) ? model.fallbacks : []

  return (
    <div classNome="p-6 space-y-4">
      <div classNome="flex justify-between items-center">
        <h4 classNome="text-lg font-medium text-foreground">OpenClaw Config</h4>
        <div classNome="flex gap-2">
          <button
            onClick={() => setMostrarJson(!showJson)}
            classNome="px-3 py-1 text-xs bg-surface-2 text-muted-foreground rounded-md hover:bg-surface-1 transition-smooth"
          >
            {showJson ? 'Structured' : 'JSON'}
          </button>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              classNome="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {error && (
        <div classNome="bg-[#9e5c50]/10 border border-[#9e5c50]/20 text-[#9e5c50] p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {config.openclawId && (
        <div classNome="text-xs text-muted-foreground">
          OpenClaw ID: <span classNome="font-mono text-foreground">{config.openclawId}</span>
          {config.isDefault && <span classNome="ml-2 px-1.5 py-0.5 bg-primary/20 text-primary rounded text-xs">Default</span>}
        </div>
      )}

      {showJson ? (
        /* JSON view */
        <div>
          {editing ? (
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={20}
              classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          ) : (
            <pre classNome="bg-surface-1/30 rounded p-4 text-xs text-foreground/90 overflow-auto max-h-96 font-mono">
              {JSON.stringify(config, null, 2)}
            </pre>
          )}
        </div>
      ) : (
        /* Structured view */
        <div classNome="space-y-4">
          {/* Model */}
          <div classNome="bg-surface-1/50 rounded-lg p-4">
            <h5 classNome="text-sm font-medium text-foreground mb-2">Model</h5>
            {editing ? (
              <div classNome="space-y-3">
                <div>
                  <label classNome="block text-xs text-muted-foreground mb-1">Primary model</label>
                  <input
                    value={modelPrimary}
                    onChange={(e) => updateModelConfig((current) => ({ ...current, primary: e.target.value }))}
                    list="agent-model-suggestions"
                    placeholder="anthropic/claude-sonnet-4-20250514"
                    classNome="w-full bg-surface-1 text-foreground rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <datalist id="agent-model-suggestions">
                    {availableModels.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label classNome="block text-xs text-muted-foreground mb-1">Fallback models</label>
                  <div classNome="space-y-2">
                    {modelFallbacks.map((fallback: string, index: number) => (
                      <div key={`${fallback}-${index}`} classNome="flex gap-2">
                        <input
                          value={fallback}
                          onChange={(e) => {
                            const next = [...modelFallbacks]
                            next[index] = e.target.value
                            updateModelConfig((current) => ({ ...current, fallbacks: next }))
                          }}
                          list="agent-model-suggestions"
                          classNome="flex-1 bg-surface-1 text-foreground rounded px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                        <button
                          onClick={() => {
                            const next = modelFallbacks.filter((_: string, i: number) => i !== index)
                            updateModelConfig((current) => ({ ...current, fallbacks: next }))
                          }}
                          classNome="px-3 py-2 text-xs bg-[#9e5c50]/10 text-[#9e5c50] border border-[#9e5c50]/30 rounded hover:bg-[#9e5c50]/20 transition-smooth"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div classNome="flex gap-2">
                      <input
                        value={newFallbackModel}
                        onChange={(e) => setNewFallbackModel(e.target.value)}
                        list="agent-model-suggestions"
                        placeholder="Add fallback model"
                        classNome="flex-1 bg-surface-1 text-foreground rounded px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                      <button
                        onClick={addFallbackModel}
                        classNome="px-3 py-2 text-xs bg-secondary text-foreground rounded hover:bg-surface-2 transition-smooth"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div classNome="text-sm">
                <div><span classNome="text-muted-foreground">Primary:</span> <span classNome="text-foreground font-mono">{modelPrimary || 'not configured'}</span></div>
                {modelFallbacks.length > 0 && (
                  <div classNome="mt-1">
                    <span classNome="text-muted-foreground">Fallbacks:</span>
                    <div classNome="flex flex-wrap gap-1 mt-1">
                      {modelFallbacks.map((fb: string, i: number) => (
                        <span key={i} classNome="px-2 py-0.5 text-xs bg-surface-2 rounded text-muted-foreground font-mono">{fb.split('/').pop()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Identity */}
          <div classNome="bg-surface-1/50 rounded-lg p-4">
            <h5 classNome="text-sm font-medium text-foreground mb-2">Identity</h5>
            {editing ? (
              <div classNome="space-y-3">
                <div classNome="grid grid-cols-3 gap-3">
                  <div>
                    <label classNome="block text-xs text-muted-foreground mb-1">Emoji</label>
                    <input
                      value={identityEmoji}
                      onChange={(e) => updateIdentityField('emoji', e.target.value)}
                      classNome="w-full bg-surface-1 text-foreground rounded px-3 py-2 text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary/50"
                      placeholder="🤖"
                    />
                  </div>
                  <div>
                    <label classNome="block text-xs text-muted-foreground mb-1">Nome</label>
                    <input
                      value={identity.name || ''}
                      onChange={(e) => updateIdentityField('name', e.target.value)}
                      classNome="w-full bg-surface-1 text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                      placeholder="Agent name"
                    />
                  </div>
                  <div>
                    <label classNome="block text-xs text-muted-foreground mb-1">Tema / Role</label>
                    <input
                      value={identity.theme || ''}
                      onChange={(e) => updateIdentityField('theme', e.target.value)}
                      classNome="w-full bg-surface-1 text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                      placeholder="e.g. backend engineer"
                    />
                  </div>
                </div>
                <div>
                  <label classNome="block text-xs text-muted-foreground mb-1">Identity content</label>
                  <textarea
                    value={identity.content || ''}
                    onChange={(e) => updateIdentityField('content', e.target.value)}
                    rows={4}
                    classNome="w-full bg-surface-1 text-foreground border border-border rounded-md px-3 py-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                    placeholder="Describe the agent's identity and personality..."
                  />
                </div>
              </div>
            ) : (
              <>
                <div classNome="flex items-center gap-3 text-sm">
                  <span classNome="text-2xl">{identityEmoji}</span>
                  <div>
                    <div classNome="text-foreground font-medium">{identityNome}</div>
                    <div classNome="text-muted-foreground">{identityTema}</div>
                  </div>
                </div>
                {identityPreview && (
                  <pre classNome="mt-3 text-xs text-muted-foreground bg-surface-1 rounded p-2 overflow-auto whitespace-pre-wrap">
                    {identityPreview}
                  </pre>
                )}
              </>
            )}
          </div>

          {/* Sandbox */}
          <div classNome="bg-surface-1/50 rounded-lg p-4">
            <h5 classNome="text-sm font-medium text-foreground mb-2">Sandbox</h5>
            {editing ? (
              <div classNome="grid grid-cols-3 gap-3">
                <div>
                  <label classNome="block text-xs text-muted-foreground mb-1">Mode</label>
                  <select
                    value={sandbox.mode || ''}
                    onChange={(e) => updateSandboxField('mode', e.target.value)}
                    classNome="w-full bg-surface-1 text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    <option value="">Not configured</option>
                    <option value="all">All</option>
                    <option value="non-main">Non-main</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label classNome="block text-xs text-muted-foreground mb-1">Workspace Access</label>
                  <select
                    value={sandbox.workspaceAccess || ''}
                    onChange={(e) => updateSandboxField('workspaceAccess', e.target.value)}
                    classNome="w-full bg-surface-1 text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    <option value="">Not configured</option>
                    <option value="rw">Read-write</option>
                    <option value="ro">Read-only</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label classNome="block text-xs text-muted-foreground mb-1">Network</label>
                  <input
                    value={sandbox.network || ''}
                    onChange={(e) => updateSandboxField('network', e.target.value)}
                    classNome="w-full bg-surface-1 text-foreground rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                    placeholder="none"
                  />
                </div>
              </div>
            ) : (
              <div classNome="grid grid-cols-3 gap-2 text-sm">
                <div><span classNome="text-muted-foreground">Mode:</span> <span classNome="text-foreground">{sandboxMode}</span></div>
                <div><span classNome="text-muted-foreground">Workspace:</span> <span classNome="text-foreground">{sandboxWorkspace}</span></div>
                <div><span classNome="text-muted-foreground">Network:</span> <span classNome="text-foreground">{sandboxNetwork}</span></div>
              </div>
            )}
          </div>

          {/* Tools */}
          <div classNome="bg-surface-1/50 rounded-lg p-4">
            <h5 classNome="text-sm font-medium text-foreground mb-2">Tools</h5>
            {editing ? (
              <div classNome="space-y-3">
                <div>
                  <label classNome="block text-xs text-[#b4a68c] font-medium mb-1">Allow list</label>
                  <div classNome="flex flex-wrap gap-1 mb-2">
                    {toolAllow.map((tool: string, i: number) => (
                      <span key={`${tool}-${i}`} classNome="px-2 py-0.5 text-xs bg-[#b4a68c]/10 text-[#b4a68c] rounded border border-[#b4a68c]/20 flex items-center gap-1">
                        {tool}
                        <button onClick={() => removeTool('allow', i)} classNome="text-[#b4a68c]/60 hover:text-[#b4a68c] ml-1">&times;</button>
                      </span>
                    ))}
                  </div>
                  <div classNome="flex gap-2">
                    <input
                      value={newAllowTool}
                      onChange={(e) => setNewAllowTool(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTool('allow', newAllowTool); setNewAllowTool('') } }}
                      placeholder="Add allowed tool name"
                      classNome="flex-1 bg-surface-1 text-foreground rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => { addTool('allow', newAllowTool); setNewAllowTool('') }}
                      classNome="px-3 py-2 text-xs bg-[#b4a68c]/20 text-[#b4a68c] border border-[#b4a68c]/30 rounded hover:bg-[#b4a68c]/30 transition-smooth"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div>
                  <label classNome="block text-xs text-[#9e5c50] font-medium mb-1">Deny list</label>
                  <div classNome="flex flex-wrap gap-1 mb-2">
                    {toolDeny.map((tool: string, i: number) => (
                      <span key={`${tool}-${i}`} classNome="px-2 py-0.5 text-xs bg-[#9e5c50]/10 text-[#9e5c50] rounded border border-[#9e5c50]/20 flex items-center gap-1">
                        {tool}
                        <button onClick={() => removeTool('deny', i)} classNome="text-[#9e5c50]/60 hover:text-[#9e5c50] ml-1">&times;</button>
                      </span>
                    ))}
                  </div>
                  <div classNome="flex gap-2">
                    <input
                      value={newDenyTool}
                      onChange={(e) => setNewDenyTool(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTool('deny', newDenyTool); setNewDenyTool('') } }}
                      placeholder="Add denied tool name"
                      classNome="flex-1 bg-surface-1 text-foreground rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => { addTool('deny', newDenyTool); setNewDenyTool('') }}
                      classNome="px-3 py-2 text-xs bg-[#9e5c50]/20 text-[#9e5c50] border border-[#9e5c50]/30 rounded hover:bg-[#9e5c50]/30 transition-smooth"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {toolAllow.length > 0 && (
                  <div classNome="mb-2">
                    <span classNome="text-xs text-[#b4a68c] font-medium">Allow ({toolAllow.length}):</span>
                    <div classNome="flex flex-wrap gap-1 mt-1">
                      {toolAllow.map((tool: string) => (
                        <span key={tool} classNome="px-2 py-0.5 text-xs bg-[#b4a68c]/10 text-[#b4a68c] rounded border border-[#b4a68c]/20">{tool}</span>
                      ))}
                    </div>
                  </div>
                )}
                {toolDeny.length > 0 && (
                  <div>
                    <span classNome="text-xs text-[#9e5c50] font-medium">Deny ({toolDeny.length}):</span>
                    <div classNome="flex flex-wrap gap-1 mt-1">
                      {toolDeny.map((tool: string) => (
                        <span key={tool} classNome="px-2 py-0.5 text-xs bg-[#9e5c50]/10 text-[#9e5c50] rounded border border-[#9e5c50]/20">{tool}</span>
                      ))}
                    </div>
                  </div>
                )}
                {toolAllow.length === 0 && toolDeny.length === 0 && !toolRawPreview && (
                  <div classNome="text-xs text-muted-foreground">No tools configured</div>
                )}
                {toolRawPreview && (
                  <pre classNome="mt-3 text-xs text-muted-foreground bg-surface-1 rounded p-2 overflow-auto whitespace-pre-wrap">
                    {toolRawPreview}
                  </pre>
                )}
              </>
            )}
          </div>

          {/* Subagents */}
          {subagents.allowAgents && subagents.allowAgents.length > 0 && (
            <div classNome="bg-surface-1/50 rounded-lg p-4">
              <h5 classNome="text-sm font-medium text-foreground mb-2">Subagents</h5>
              <div classNome="flex flex-wrap gap-1">
                {subagents.allowAgents.map((a: string) => (
                  <span key={a} classNome="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">{a}</span>
                ))}
              </div>
              {subagents.model && (
                <div classNome="text-xs text-muted-foreground mt-1">Model: {subagents.model}</div>
              )}
            </div>
          )}

          {/* Memória Search */}
          {memorySearch.sources && (
            <div classNome="bg-surface-1/50 rounded-lg p-4">
              <h5 classNome="text-sm font-medium text-foreground mb-2">Memória Search</h5>
              <div classNome="flex gap-1">
                {memorySearch.sources.map((s: string) => (
                  <span key={s} classNome="px-2 py-0.5 text-xs bg-cyan-500/10 text-cyan-400 rounded">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ações */}
      {editing && (
        <div classNome="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            classNome="flex-1 bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 transition-smooth"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => {
              setEditing(false)
              setConfig(agent.config || {})
              setJsonInput(JSON.stringify(agent.config || {}, null, 2))
            }}
            classNome="px-4 py-2 bg-secondary text-muted-foreground rounded-md hover:bg-surface-2 transition-smooth"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
