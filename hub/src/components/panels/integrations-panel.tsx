'use client'

import { useState, useEffect, useCallback } from 'react'

interface EnvVarInfo {
  redacted: string
  set: boolean
}

interface Integration {
  id: string
  name: string
  category: string
  categoryLabel: string
  envVars: Record<string, EnvVarInfo>
  status: 'connected' | 'partial' | 'not_configured'
  vaultItem: string | null
  testable: boolean
}

interface Category {
  id: string
  label: string
}

export function IntegrationsPanel() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [opAvailable, setOpAvailable] = useState(false)
  const [envPath, setEnvPath] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('ai')

  // Edits: integration id -> env var key -> new value
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)
  const [testing, setTesting] = useState<string | null>(null) // integration id being tested
  const [pulling, setPulling] = useState<string | null>(null) // integration id being pulled
  const [pullingAll, setPullingAll] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState<{ integrationId: string; keys: string[] } | null>(null)

  const showFeedback = (ok: boolean, text: string) => {
    setFeedback({ ok, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const fetchIntegrations = useCallback(async () => {
    try {
      const res = await fetch('/api/integrations')
      if (res.status === 401 || res.status === 403) {
        setError('Admin access required')
        return
      }
      if (!res.ok) {
        setError('Failed to load integrations')
        return
      }
      const data = await res.json()
      setIntegrations(data.integrations || [])
      setCategories(data.categories || [])
      setOpAvailable(data.opAvailable ?? false)
      setEnvPath(data.envPath ?? null)
      if (data.categories?.[0]) {
        setActiveCategory(prev => {
          // Keep current if valid, otherwise default to first
          const ids = (data.categories as Category[]).map((c: Category) => c.id)
          return ids.includes(prev) ? prev : ids[0]
        })
      }
    } catch {
      setError('Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchIntegrations() }, [fetchIntegrations])

  const handleEdit = (envKey: string, value: string) => {
    setEdits(prev => ({ ...prev, [envKey]: value }))
  }

  const cancelEdit = (envKey: string) => {
    setEdits(prev => {
      const next = { ...prev }
      delete next[envKey]
      return next
    })
  }

  const toggleReveal = (envKey: string) => {
    setRevealed(prev => {
      const next = new Set(prev)
      if (next.has(envKey)) next.delete(envKey)
      else next.add(envKey)
      return next
    })
  }

  const hasChanges = Object.keys(edits).length > 0

  const handleSave = async () => {
    if (!hasChanges) return
    setSaving(true)
    try {
      const res = await fetch('/api/integrations', {
        method: 'PUT',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({ vars: edits }),
      })
      const data = await res.json()
      if (res.ok) {
        showFeedback(true, `Saved ${data.count} variable${data.count === 1 ? '' : 's'}`)
        setEdits({})
        setRevealed(new Set())
        fetchIntegrations()
      } else {
        showFeedback(false, data.error || 'Failed to save')
      }
    } catch {
      showFeedback(false, 'Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    setEdits({})
    setRevealed(new Set())
  }

  const handleRemove = async (envKeys: string[]) => {
    try {
      const res = await fetch(`/api/integrations?keys=${encodeURIComponent(envKeys.join(','))}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        showFeedback(true, `Removed ${data.count} variable${data.count === 1 ? '' : 's'}`)
        fetchIntegrations()
      } else {
        showFeedback(false, data.error || 'Failed to remove')
      }
    } catch {
      showFeedback(false, 'Network error')
    }
  }

  const handleTest = async (integrationId: string) => {
    setTesting(integrationId)
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({ action: 'test', integrationId }),
      })
      const data = await res.json()
      if (data.ok) {
        showFeedback(true, data.detail || 'Connection successful')
      } else {
        showFeedback(false, data.detail || data.error || 'Test failed')
      }
    } catch {
      showFeedback(false, 'Network error')
    } finally {
      setTesting(null)
    }
  }

  const handlePull = async (integrationId: string) => {
    setPulling(integrationId)
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({ action: 'pull', integrationId }),
      })
      const data = await res.json()
      if (data.ok) {
        showFeedback(true, data.detail || 'Pulled from 1Password')
        fetchIntegrations()
      } else {
        showFeedback(false, data.error || 'Pull failed')
      }
    } catch {
      showFeedback(false, 'Network error')
    } finally {
      setPulling(null)
    }
  }

  const handlePullAll = async () => {
    setPullingAll(true)
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Tipo': 'application/json' },
        body: JSON.stringify({ action: 'pull-all', category: activeCategory }),
      })
      const data = await res.json()
      if (data.ok) {
        showFeedback(true, data.detail || 'Pulled from 1Password')
        fetchIntegrations()
      } else {
        showFeedback(false, data.error || 'Pull failed')
      }
    } catch {
      showFeedback(false, 'Network error')
    } finally {
      setPullingAll(false)
    }
  }

  const confirmAndRemove = (integrationId: string, keys: string[]) => {
    setConfirmRemove({ integrationId, keys })
  }

  // Loading state
  if (loading) {
    return (
      <div classNome="p-6 flex items-center gap-2">
        <div classNome="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span classNome="text-sm text-muted-foreground">Loading integrations...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div classNome="p-6">
        <div classNome="bg-destructive/10 text-destructive rounded-lg p-4 text-sm">{error}</div>
      </div>
    )
  }

  const filteredIntegrations = integrations.filter(i => i.category === activeCategory)
  const connectedCount = integrations.filter(i => i.status === 'connected').length

  return (
    <div classNome="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div classNome="flex items-center justify-between">
        <div>
          <h2 classNome="text-lg font-semibold text-foreground">Integrations</h2>
          <p classNome="text-xs text-muted-foreground mt-0.5">
            {connectedCount} of {integrations.length} connected
            {envPath && <span classNome="ml-2 font-mono text-muted-foreground/50">{envPath}</span>}
          </p>
        </div>
        <div classNome="flex items-center gap-2">
          {opAvailable && (
            <>
              <span classNome="text-2xs px-2 py-1 rounded bg-[#b4a68c]/10 text-[#b4a68c] flex items-center gap-1">
                <span classNome="w-1.5 h-1.5 rounded-full bg-[#b4a68c]" />
                1P CLI
              </span>
              <button
                onClick={handlePullAll}
                disabled={pullingAll}
                classNome="px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
                title="Pull all vault-backed integrations in this category from 1Password"
              >
                {pullingAll ? (
                  <div classNome="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg classNome="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v8M5 7l3 3 3-3" />
                    <path d="M3 12v2h10v-2" />
                  </svg>
                )}
                Pull All
              </button>
            </>
          )}
          {hasChanges && (
            <button
              onClick={handleDiscard}
              classNome="px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Discard
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            classNome={`px-4 py-1.5 text-xs rounded-md font-medium transition-colors ${
              hasChanges
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div classNome={`rounded-lg p-3 text-xs font-medium ${
          feedback.ok ? 'bg-[#b4a68c]/10 text-[#b4a68c]' : 'bg-destructive/10 text-destructive'
        }`}>
          {feedback.text}
        </div>
      )}

      {/* Category tabs */}
      <div classNome="flex gap-1 border-b border-border pb-px overflow-x-auto">
        {categories.map(cat => {
          const catIntegrations = integrations.filter(i => i.category === cat.id)
          const catConnected = catIntegrations.filter(i => i.status === 'connected').length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              classNome={`px-3 py-2 text-xs font-medium rounded-t-md transition-colors relative whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-card text-foreground border border-border border-b-card -mb-px'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
              {catConnected > 0 && (
                <span classNome="ml-1.5 inline-flex items-center justify-center min-w-[16px] h-4 text-2xs rounded-full bg-[#b4a68c]/15 text-[#b4a68c] px-1">
                  {catConnected}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Integration cards */}
      <div classNome="space-y-3">
        {filteredIntegrations.map(integration => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            edits={edits}
            revealed={revealed}
            opAvailable={opAvailable}
            testing={testing === integration.id}
            pulling={pulling === integration.id}
            onEdit={handleEdit}
            onCancelEdit={cancelEdit}
            onToggleReveal={toggleReveal}
            onTest={() => handleTest(integration.id)}
            onPull={() => handlePull(integration.id)}
            onRemove={() => {
              const setKeys = Object.entries(integration.envVars)
                .filter(([, v]) => v.set)
                .map(([k]) => k)
              if (setKeys.length > 0) confirmAndRemove(integration.id, setKeys)
            }}
          />
        ))}
        {filteredIntegrations.length === 0 && (
          <div classNome="text-sm text-muted-foreground text-center py-8">
            No integrations in this category
          </div>
        )}
      </div>

      {/* Unsaved changes bar */}
      {hasChanges && (
        <div classNome="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg px-4 py-2.5 flex items-center gap-3 z-40">
          <div classNome="w-2 h-2 rounded-full bg-[#c49a6c] animate-pulse" />
          <span classNome="text-xs text-foreground">
            {Object.keys(edits).length} unsaved change{Object.keys(edits).length === 1 ? '' : 's'}
          </span>
          <button
            onClick={handleDiscard}
            classNome="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            classNome="px-3 py-1 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {/* Remove confirmation dialog */}
      {confirmRemove && (
        <div classNome="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div classNome="bg-card border border-border rounded-lg shadow-xl p-5 max-w-sm mx-4 space-y-4">
            <h3 classNome="text-sm font-semibold text-foreground">Remove integration?</h3>
            <p classNome="text-xs text-muted-foreground">
              This will remove {confirmRemove.keys.length === 1 ? (
                <span classNome="font-mono text-foreground">{confirmRemove.keys[0]}</span>
              ) : (
                <span>{confirmRemove.keys.length} variables</span>
              )} from the .env file. The gateway must be restarted for changes to take effect.
            </p>
            <div classNome="flex justify-end gap-2">
              <button
                onClick={() => setConfirmRemove(null)}
                classNome="px-3 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleRemove(confirmRemove.keys)
                  setConfirmRemove(null)
                }}
                classNome="px-3 py-1.5 text-xs rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Integration card component
// ---------------------------------------------------------------------------

function IntegrationCard({
  integration,
  edits,
  revealed,
  opAvailable,
  testing,
  pulling,
  onEdit,
  onCancelEdit,
  onToggleReveal,
  onTest,
  onPull,
  onRemove,
}: {
  integration: Integration
  edits: Record<string, string>
  revealed: Set<string>
  opAvailable: boolean
  testing: boolean
  pulling: boolean
  onEdit: (key: string, value: string) => void
  onCancelEdit: (key: string) => void
  onToggleReveal: (key: string) => void
  onTest: () => void
  onPull: () => void
  onRemove: () => void
}) {
  const statusColors = {
    connected: 'bg-[#b4a68c]',
    partial: 'bg-[#c49a6c]',
    not_configured: 'bg-muted-foreground/30',
  }

  const statusLabels = {
    connected: 'Conectado',
    partial: 'Partial',
    not_configured: 'Not configured',
  }

  const hasEdits = Object.keys(integration.envVars).some(k => edits[k] !== undefined)
  const hasSetVars = Object.values(integration.envVars).some(v => v.set)

  return (
    <div classNome={`bg-card border rounded-lg p-4 transition-colors ${
      hasEdits ? 'border-primary/50' : 'border-border'
    }`}>
      {/* Card header */}
      <div classNome="flex items-center justify-between mb-3">
        <div classNome="flex items-center gap-2.5">
          <span classNome={`w-2 h-2 rounded-full shrink-0 ${statusColors[integration.status]}`} />
          <span classNome="text-sm font-medium text-foreground">{integration.name}</span>
          <span classNome="text-2xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {statusLabels[integration.status]}
          </span>
        </div>

        <div classNome="flex items-center gap-1.5">
          {/* Pull from 1Password */}
          {integration.vaultItem && opAvailable && (
            <button
              onClick={onPull}
              disabled={pulling}
              title="Pull from 1Password"
              classNome="px-2 py-1 text-2xs rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1"
            >
              {pulling ? (
                <div classNome="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg classNome="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v8M5 7l3 3 3-3" />
                  <path d="M3 12v2h10v-2" />
                </svg>
              )}
              1P
            </button>
          )}

          {/* Test connection */}
          {integration.testable && hasSetVars && (
            <button
              onClick={onTest}
              disabled={testing}
              title="Test connection"
              classNome="px-2 py-1 text-2xs rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1"
            >
              {testing ? (
                <div classNome="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg classNome="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 3L6 14" />
                  <polyline points="6,3 6,8 1,8" />
                  <polyline points="10,8 15,8 15,13" />
                </svg>
              )}
              Test
            </button>
          )}

          {/* Remove */}
          {hasSetVars && (
            <button
              onClick={onRemove}
              title="Remove from .env"
              classNome="px-2 py-1 text-2xs rounded border border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Env var rows */}
      <div classNome="space-y-2">
        {Object.entries(integration.envVars).map(([envKey, info]) => {
          const isEditing = edits[envKey] !== undefined
          const isRevealed = revealed.has(envKey)

          return (
            <div key={envKey} classNome="flex items-center gap-2">
              <span classNome="text-2xs font-mono text-muted-foreground/70 w-48 truncate shrink-0" title={envKey}>
                {envKey}
              </span>

              <div classNome="flex-1 flex items-center gap-1.5">
                {isEditing ? (
                  <input
                    type={isRevealed ? 'text' : 'password'}
                    value={edits[envKey]}
                    onChange={e => onEdit(envKey, e.target.value)}
                    placeholder="Enter value..."
                    classNome="flex-1 px-2 py-1 text-xs bg-background border border-primary/50 rounded focus:border-primary focus:outline-none font-mono"
                    autoComplete="off"
                    data-1p-ignore
                  />
                ) : info.set ? (
                  <span classNome="text-xs font-mono text-muted-foreground">{info.redacted}</span>
                ) : (
                  <span classNome="text-xs text-muted-foreground/50 italic">not set</span>
                )}
              </div>

              <div classNome="flex items-center gap-1 shrink-0">
                {/* Reveal toggle (only when editing) */}
                {isEditing && (
                  <button
                    onClick={() => onToggleReveal(envKey)}
                    title={isRevealed ? 'Ocultar value' : 'Mostrar value'}
                    classNome="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isRevealed ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                )}

                {/* Edit button */}
                {!isEditing && (
                  <button
                    onClick={() => onEdit(envKey, '')}
                    title="Edit value"
                    classNome="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <EditIcon />
                  </button>
                )}

                {/* Cancel edit */}
                {isEditing && (
                  <button
                    onClick={() => onCancelEdit(envKey)}
                    title="Cancel edit"
                    classNome="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inline SVG icons (matching nav-rail pattern: 16x16, stroke-based)
// ---------------------------------------------------------------------------

function EyeIcon() {
  return (
    <svg classNome="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg classNome="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2l12 12" />
      <path d="M6.5 6.5a2 2 0 002.8 2.8" />
      <path d="M4.2 4.2C2.5 5.5 1 8 1 8s2.5 5 7 5c1.3 0 2.4-.4 3.4-1" />
      <path d="M11.8 11.8C13.5 10.5 15 8 15 8s-2.5-5-7-5c-.7 0-1.4.1-2 .3" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg classNome="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 1.5l3 3L5 14H2v-3l9.5-9.5z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg classNome="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  )
}
