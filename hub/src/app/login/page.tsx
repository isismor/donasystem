'use client'

import { useCallback, useEffect, useRef, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    google?: any
  }
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleReady, setGoogleReady] = useState(false)
  const router = useRouter()
  const googleBtnRef = useRef<HTMLDivElement | null>(null)

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

  const completeLogin = useCallback(async (path: string, body: any) => {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Tipo': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Falha no login')
      setLoading(false)
      return false
    }

    router.push('/')
    router.refresh()
    return true
  }, [router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await completeLogin('/api/auth/login', { username, password })
    } catch {
      setError('Network error')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!googleClientId) return

    const onScriptLoad = () => {
      if (!window.google || !googleBtnRef.current) return
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: any) => {
          setError('')
          setLoading(true)
          try {
            const ok = await completeLogin('/api/auth/google', { credential: response?.credential })
            if (!ok) return
          } catch {
            setError('Google sign-in failed')
            setLoading(false)
          }
        },
      })
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'signin_with',
        shape: 'pill',
      })
      setGoogleReady(true)
    }

    const existing = document.querySelector('script[data-google-gsi="1"]') as HTMLScriptElement | null
    if (existing) {
      if (window.google) onScriptLoad()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.setAttribute('data-google-gsi', '1')
    script.onload = onScriptLoad
    script.onerror = () => setError('Failed to load Google Sign-In')
    document.head.appendChild(script)
  }, [googleClientId, completeLogin])

  return (
    <div classNome="min-h-screen flex items-center justify-center bg-background p-4">
      <div classNome="w-full max-w-sm">
        <div classNome="flex flex-col items-center mb-8">
          <div classNome="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: 'hsl(24 14% 14%)' }}>
            <span classNome="font-bold text-lg" style={{ color: 'hsl(39 21% 63%)' }}>TD</span>
          </div>
          <h1 classNome="text-xl font-semibold text-foreground">Torre Dona</h1>
          <p classNome="text-sm text-muted-foreground mt-1">Acesse para continuar</p>
        </div>

        <form onSubmit={handleSubmit} classNome="space-y-4">
          {error && (
            <div role="alert" classNome="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" classNome="block text-sm font-medium text-foreground mb-1.5">Usuário</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              classNome="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-smooth"
              placeholder="Digite seu usuário"
              autoComplete="username"
              autoFocus
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="password" classNome="block text-sm font-medium text-foreground mb-1.5">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              classNome="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-smooth"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username || !password}
            classNome="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div classNome="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div classNome="my-4 flex items-center gap-2">
          <div classNome="h-px flex-1 bg-border" />
          <span classNome="text-xs text-muted-foreground">ou</span>
          <div classNome="h-px flex-1 bg-border" />
        </div>

        <div classNome="flex justify-center">
          {googleClientId ? (
            <div classNome="min-h-[44px]" ref={googleBtnRef} />
          ) : (
            <div classNome="text-xs text-muted-foreground">Login Google não configurado</div>
          )}
        </div>
        {googleClientId && !googleReady && <p classNome="text-center text-xs text-muted-foreground mt-2">Carregando login Google...</p>}

        <p classNome="text-center text-xs text-muted-foreground mt-6">Torre Dona · Painel de Controle</p>
      </div>
    </div>
  )
}
