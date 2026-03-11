'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSmartPoll } from '@/lib/use-smart-poll'
import { useMissionControl } from '@/store'

interface Webhook {
  id: number
  name: string
  url: string
  secret: string | null
  events: string[]
  enabled: boolean
  last_fired_at: number | null
  last_status: number | null
  total_deliveries: number
  successful_deliveries: number
  failed_deliveries: number
  created_at: number
  updated_at: number
}

interface Delivery {
  id: number
  webhook_id: number
  webhook_name: string
  webhook_url: string
  event_type: string
  payload: string
  status_code: number | null
  response_body: string | null
  error: string | null
  duration_ms: number
  created_at: number
}

interface AgendarTask {
  id: string
  name: string
  enabled: boolean
  lastRun: number | null
  nextRun: number | null
  running: boolean
  lastResult?: { ok: boolean; message: string; timestamp: number }
}

const AVAILABLE_EVENTS = [
  { value: '*', label: 'All events', description: 'Receive all event types' },
  { value: 'agent.error', label: 'Agent error', description: 'Agent enters error state' },
  { value: 'agent.status_change', label: 'Agent status change', description: 'Any agent status transition' },
  { value: 'security.login_failed', label: 'Falha no login', description: 'Failed login attempt' },
  { value: 'security.user_created', label: 'User created', description: 'New user account created' },
  { value: 'security.user_deleted', label: 'User deleted', description: 'User account deleted' },
  { value: 'security.password_change', label: 'Password changed', description: 'User password modified' },
  { value: 'notification.mention', label: 'Mention', description: 'Agent was @mentioned' },
  { value: 'notification.assignment', label: 'Assignment', description: 'Task assigned to agent' },
  { value: 'activity.task_created', label: 'Task created', description: 'New task added' },
  { value: 'activity.task_updated', label: 'Task updated', description: 'Task status changed' },
]

export function WebhookPanel() {
  const { dashboardMode } = useMissionControl()
  const isLocalMode = dashboardMode === 'local'
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [webhookAutomations, setWebhookAutomations] = useState<AgendarTask[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCreate, setMostrarCreate] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<number | null>(null)
  const [testingId, setTestingId] = useState<number | null>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [newSecret, setNewSecret] = useState<string | null>(null)
  const [runningAutomationId, setRunningAutomationId] = useState<string | null>(null)

  const fetchWebhooks = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/webhooks')
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to fetch webhooks')
        return
      }
      const data = await res.json()
      setWebhooks(data.webhooks || [])
      setError('')
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDeliveries = useCallback(async () => {
    if (!selectedWebhook) return
    try {
      const res = await fetch(`/api/webhooks/deliveries?webhook_id=${selectedWebhook}&limit=20`)
      if (res.ok) {
        const data = await res.json()
        setDeliveries(data.deliveries || [])
      }
    } catch { /* silent */ }
  }, [selectedWebhook])

  const fetchWebhookAutomations = useCallback(async () => {
    if (!isLocalMode) {
      setWebhookAutomations([])
      return
    }
    try {
      const res = await fetch('/api/scheduler')
      if (!res.ok) return
      const data = await res.json()
      const tasks = Array.isArray(data.tasks) ? data.tasks : []
      const webhookTasks = tasks.filter((task: AgendarTask) =>
        typeof task.id === 'string' && task.id.includes('webhook')
      )
      setWebhookAutomations(webhookTasks)
    } catch {
      // Keep UI usable if scheduler endpoint is unavailable.
    }
  }, [isLocalMode])

  useEffect(() => { fetchWebhooks() }, [fetchWebhooks])
  useEffect(() => { fetchDeliveries() }, [fetchDeliveries])
  useEffect(() => { fetchWebhookAutomations() }, [fetchWebhookAutomations])
  useSmartPoll(fetchWebhooks, 60000, { pauseWhenDisconnected: true })
  useSmartPoll(fetchWebhookAutomations, 60000, { pauseWhenDisconnected: true })

  async function handleCreate(form: { name: string; url: string; events: string[] }) {
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({ ...form, generate_secret: true }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setNewSecret(data.secret)
      setMostrarCreate(false)
      fetchWebhooks()
    } catch { setError('Failed to create webhook') }
  }

  async function handleToggle(id: number, enabled: boolean) {
    await fetch('/api/webhooks', {
      method: 'PUT',
      headers: { 'Content-Tipo': 'application/json' },
      body: JSON.stringify({ id, enabled }),
    })
    fetchWebhooks()
  }

  async function handleDelete(id: number) {
    await fetch(`/api/webhooks?id=${id}`, { method: 'DELETE' })
    if (selectedWebhook === id) setSelectedWebhook(null)
    fetchWebhooks()
  }

  async function handleTest(id: number) {
    setTestingId(id)
    setTestResult(null)
    try {
      const res = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      setTestResult(data)
      fetchWebhooks()
      if (selectedWebhook === id) fetchDeliveries()
    } catch {
      setTestResult({ error: 'Network error' })
    } finally {
      setTestingId(null)
    }
  }

  async function handleRunAutomation(taskId: string) {
    setRunningAutomationId(taskId)
    try {
      const res = await fetch('/api/scheduler', {
        method: 'POST',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      })
      const data = await res.json()
      setTestResult({
        success: !!data.ok && res.ok,
        error: data.error || (!data.ok ? data.message : null),
        duration_ms: undefined,
        status_code: res.status,
      })
      await fetchWebhookAutomations()
    } catch {
      setTestResult({ success: false, error: 'Failed to run local automation' })
    } finally {
      setRunningAutomationId(null)
    }
  }

  function formatTime(ts: number) {
    return new Date(ts * 1000).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div classNome="p-5 space-y-4">
      {/* Header */}
      <div classNome="flex items-center justify-between">
        <div>
          <h2 classNome="text-base font-semibold text-foreground">Webhooks</h2>
          <p classNome="text-xs text-muted-foreground mt-0.5">
            {webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <button
          onClick={() => setMostrarCreate(true)}
          classNome="h-8 px-3 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth"
        >
          + Add Webhook
        </button>
      </div>

      {error && (
        <div classNome="text-xs text-[#9e5c50] bg-[#9e5c50]/10 border border-[#9e5c50]/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Secret reveal (after creation) */}
      {newSecret && (
        <div classNome="rounded-lg border border-[#c49a6c]/30 bg-[#c49a6c]/5 p-4 space-y-2">
          <p classNome="text-xs font-semibold text-[#c49a6c]">Webhook Secret (save now - shown only once)</p>
          <code classNome="block text-xs font-mono bg-secondary rounded px-2 py-1.5 text-foreground break-all select-all">
            {newSecret}
          </code>
          <button
            onClick={() => setNewSecret(null)}
            classNome="text-xs text-muted-foreground hover:text-foreground transition-smooth"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Test result */}
      {testResult && (
        <div classNome={`rounded-lg border p-3 space-y-1 ${
          testResult.success ? 'border-[#b4a68c]/30 bg-[#b4a68c]/5' : 'border-[#9e5c50]/30 bg-[#9e5c50]/5'
        }`}>
          <div classNome="flex items-center justify-between">
            <p classNome="text-xs font-semibold">
              {testResult.success ? (
                <span classNome="text-[#b4a68c]">Test successful</span>
              ) : (
                <span classNome="text-[#9e5c50]">Test failed</span>
              )}
            </p>
            <button onClick={() => setTestResult(null)} classNome="text-xs text-muted-foreground">
              Dismiss
            </button>
          </div>
          <div classNome="text-xs text-muted-foreground space-y-0.5">
            {testResult.status_code && <p>Status: <span classNome="font-mono">{testResult.status_code}</span></p>}
            {testResult.duration_ms && <p>Duration: <span classNome="font-mono">{testResult.duration_ms}ms</span></p>}
            {testResult.error && <p classNome="text-[#9e5c50]">Error: {testResult.error}</p>}
          </div>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <CreateWebhookForm
          onSubmit={handleCreate}
          onCancel={() => setMostrarCreate(false)}
        />
      )}

      {/* Webhook list */}
      <div classNome="space-y-2">
        {isLocalMode && webhookAutomations.length > 0 && (
          <div classNome="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3">
            <h3 classNome="text-sm font-semibold text-cyan-200">Local Webhook Automations</h3>
            <p classNome="text-2xs text-cyan-300/80 mt-0.5 mb-2">
              Local scheduler tasks that support webhook delivery and retries
            </p>
            <div classNome="space-y-2">
              {webhookAutomations.map((task) => (
                <div key={task.id} classNome="rounded border border-cyan-500/20 bg-background/30 p-2.5">
                  <div classNome="flex items-center justify-between gap-2">
                    <div classNome="min-w-0">
                      <div classNome="flex items-center gap-2">
                        <span classNome={`w-2 h-2 rounded-full ${task.running ? 'bg-blue-400' : task.enabled ? 'bg-[#b4a68c]' : 'bg-muted-foreground/40'}`} />
                        <span classNome="text-xs font-medium text-foreground truncate">{task.name}</span>
                        <span classNome="px-1.5 py-0.5 text-[10px] rounded bg-cyan-500/15 text-cyan-300 font-mono">{task.id}</span>
                      </div>
                      <div classNome="text-2xs text-muted-foreground mt-1">
                        {task.nextRun ? `Próxima execução ${formatTime(task.nextRun / 1000)}` : 'No next run scheduled'}
                        {task.lastResult?.message ? ` · ${task.lastResult.message}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRunAutomation(task.id)}
                      disabled={runningAutomationId === task.id}
                      classNome="h-7 px-2.5 text-2xs font-medium text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 rounded transition-smooth disabled:opacity-50"
                    >
                      {runningAutomationId === task.id ? 'Running...' : 'Run'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && webhooks.length === 0 ? (
          <div classNome="space-y-2">
            {[...Array(3)].map((_, i) => <div key={i} classNome="h-16 rounded-lg shimmer" />)}
          </div>
        ) : webhooks.length === 0 ? (
          <div classNome="py-12 text-center">
            <p classNome="text-xs text-muted-foreground">No webhooks configured</p>
            <p classNome="text-2xs text-muted-foreground/60 mt-1">
              Add a webhook to receive HTTP notifications for events
            </p>
          </div>
        ) : (
          webhooks.map((wh) => (
            <div
              key={wh.id}
              classNome={`rounded-lg border p-3 transition-smooth ${
                selectedWebhook === wh.id ? 'border-primary/40 bg-primary/5' : 'border-border'
              }`}
            >
              <div classNome="flex items-start justify-between gap-3">
                <div
                  classNome="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedWebhook(selectedWebhook === wh.id ? null : wh.id)}
                >
                  <div classNome="flex items-center gap-2">
                    <span classNome={`w-2 h-2 rounded-full ${wh.enabled ? 'bg-[#b4a68c]' : 'bg-muted-foreground/30'}`} />
                    <span classNome="text-sm font-medium text-foreground">{wh.name}</span>
                    {wh.last_status !== null && (
                      <span classNome={`text-2xs font-mono px-1.5 py-0.5 rounded ${
                        wh.last_status >= 200 && wh.last_status < 300
                          ? 'bg-[#b4a68c]/10 text-[#b4a68c]'
                          : 'bg-[#9e5c50]/10 text-[#9e5c50]'
                      }`}>
                        {wh.last_status}
                      </span>
                    )}
                  </div>
                  <p classNome="text-xs text-muted-foreground font-mono truncate mt-0.5">{wh.url}</p>
                  <div classNome="flex items-center gap-3 mt-1.5 text-2xs text-muted-foreground">
                    <span>{wh.events.includes('*') ? 'All events' : `${wh.events.length} event${wh.events.length !== 1 ? 's' : ''}`}</span>
                    <span>{wh.total_deliveries} deliveries</span>
                    {wh.failed_deliveries > 0 && (
                      <span classNome="text-[#9e5c50]">{wh.failed_deliveries} failed</span>
                    )}
                    {wh.last_fired_at && (
                      <span>Last fired {formatTime(wh.last_fired_at)}</span>
                    )}
                  </div>
                </div>

                <div classNome="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleTest(wh.id)}
                    disabled={testingId === wh.id}
                    classNome="h-7 px-2 text-2xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-smooth disabled:opacity-50"
                    title="Send test event"
                  >
                    {testingId === wh.id ? 'Testing...' : 'Test'}
                  </button>
                  <button
                    onClick={() => handleToggle(wh.id, !wh.enabled)}
                    classNome={`h-7 px-2 text-2xs font-medium rounded transition-smooth ${
                      wh.enabled
                        ? 'text-[#c49a6c] hover:bg-[#c49a6c]/10'
                        : 'text-[#b4a68c] hover:bg-[#b4a68c]/10'
                    }`}
                  >
                    {wh.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDelete(wh.id)}
                    classNome="h-7 px-2 text-2xs font-medium text-[#9e5c50] hover:bg-[#9e5c50]/10 rounded transition-smooth"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Delivery log (expanded) */}
              {selectedWebhook === wh.id && (
                <div classNome="mt-3 pt-3 border-t border-border space-y-2">
                  <h4 classNome="text-xs font-semibold text-foreground">Recent Deliveries</h4>
                  {deliveries.length === 0 ? (
                    <p classNome="text-2xs text-muted-foreground">No deliveries recorded yet</p>
                  ) : (
                    <div classNome="space-y-1 max-h-60 overflow-y-auto">
                      {deliveries.map((d) => (
                        <div key={d.id} classNome="flex items-center gap-2 text-2xs py-1 px-2 rounded hover:bg-secondary/50">
                          <span classNome={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            d.status_code && d.status_code >= 200 && d.status_code < 300
                              ? 'bg-[#b4a68c]'
                              : 'bg-[#9e5c50]'
                          }`} />
                          <span classNome="font-mono text-muted-foreground w-16 shrink-0">
                            {d.event_type}
                          </span>
                          <span classNome={`font-mono w-8 shrink-0 ${
                            d.status_code && d.status_code >= 200 && d.status_code < 300
                              ? 'text-[#b4a68c]'
                              : 'text-[#9e5c50]'
                          }`}>
                            {d.status_code ?? 'ERR'}
                          </span>
                          <span classNome="text-muted-foreground font-mono">
                            {d.duration_ms}ms
                          </span>
                          {d.error && (
                            <span classNome="text-[#9e5c50] truncate">{d.error}</span>
                          )}
                          <span classNome="text-muted-foreground/50 ml-auto shrink-0">
                            {formatTime(d.created_at)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function CreateWebhookForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (form: { name: string; url: string; events: string[] }) => void
  onCancel: () => void
}) {
  const [name, setNome] = useState('')
  const [url, setUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['*'])

  function toggleEvent(value: string) {
    if (value === '*') {
      setSelectedEvents(['*'])
      return
    }
    setSelectedEvents((prev) => {
      const without = prev.filter((e) => e !== '*' && e !== value)
      if (prev.includes(value)) return without.length === 0 ? ['*'] : without
      return [...without, value]
    })
  }

  return (
    <div classNome="rounded-lg border border-border p-4 space-y-3">
      <h3 classNome="text-sm font-semibold text-foreground">New Webhook</h3>

      <div>
        <label classNome="block text-xs text-muted-foreground mb-1">Nome</label>
        <input
          value={name}
          onChange={(e) => setNome(e.target.value)}
          placeholder="e.g. Slack alerts"
          classNome="w-full h-8 px-2.5 rounded-md bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label classNome="block text-xs text-muted-foreground mb-1">URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/..."
          classNome="w-full h-8 px-2.5 rounded-md bg-secondary border border-border text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label classNome="block text-xs text-muted-foreground mb-1.5">Events</label>
        <div classNome="flex flex-wrap gap-1.5">
          {AVAILABLE_EVENTS.map((ev) => (
            <button
              key={ev.value}
              type="button"
              onClick={() => toggleEvent(ev.value)}
              title={ev.description}
              classNome={`h-6 px-2 rounded text-2xs font-medium transition-smooth ${
                selectedEvents.includes(ev.value)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {ev.label}
            </button>
          ))}
        </div>
      </div>

      <div classNome="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          classNome="flex-1 h-8 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-smooth"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit({ name, url, events: selectedEvents })}
          disabled={!name || !url}
          classNome="flex-1 h-8 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth disabled:opacity-50"
        >
          Create Webhook
        </button>
      </div>
    </div>
  )
}
