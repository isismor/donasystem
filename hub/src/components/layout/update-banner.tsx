'use client'

import { useMissionControl } from '@/store'

export function UpdateBanner() {
  const { updateAvailable, updateDismissedVersion, dismissUpdate } = useMissionControl()

  if (!updateAvailable) return null
  if (updateDismissedVersion === updateAvailable.latestVersion) return null

  return (
    <div classNome="mx-4 mt-3 mb-0 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm">
      <span classNome="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
      <p classNome="flex-1 text-xs text-emerald-300">
        <span classNome="font-medium text-emerald-200">
          Update available: v{updateAvailable.latestVersion}
        </span>
        {' — a newer version of Torre Dona está disponível.'}
      </p>
      <a
        href={updateAvailable.releaseUrl}
        target="_blank"
        rel="noopener noreferrer"
        classNome="shrink-0 text-2xs font-medium text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
      >
        View Release
      </a>
      <button
        onClick={() => dismissUpdate(updateAvailable.latestVersion)}
        classNome="shrink-0 text-emerald-400/60 hover:text-emerald-300 transition-colors"
        title="Dismiss"
      >
        <svg classNome="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  )
}
