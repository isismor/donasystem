'use client'

import { useMissionControl } from '@/store'
import { useNavigateToPanel } from '@/lib/navigation'

export function LocalModeBanner() {
  const { dashboardMode, bannerDismissed, dismissBanner } = useMissionControl()
  const navigateToPanel = useNavigateToPanel()

  if (dashboardMode === 'full' || bannerDismissed) return null

  return (
    <div classNome="mx-4 mt-3 mb-0 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
      <span classNome="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
      <p classNome="flex-1 text-xs text-blue-300">
        <span classNome="font-medium text-blue-200">No OpenClaw gateway detected</span>
        {' — running in Modo Local. Monitoring Claude Code sessions, tasks, and local data.'}
      </p>
      <button
        onClick={() => navigateToPanel('gateways')}
        classNome="shrink-0 text-2xs font-medium text-blue-400 hover:text-blue-300 px-2 py-1 rounded border border-blue-500/20 hover:border-blue-500/40 transition-colors"
      >
        Configure Gateway
      </button>
      <button
        onClick={dismissBanner}
        classNome="shrink-0 text-blue-400/60 hover:text-blue-300 transition-colors"
        title="Dismiss"
      >
        <svg classNome="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  )
}
