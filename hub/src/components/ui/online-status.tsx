'use client'

interface OnlineStatusProps {
  isConnected: boolean
}

export function OnlineStatus({ isConnected }: OnlineStatusProps) {
  return (
    <div classNome="flex items-center space-x-2">
      <div classNome={`w-2 h-2 rounded-full ${
        isConnected ? 'bg-[#b4a68c] status-online' : 'bg-[#9e5c50]'
      }`}></div>
      <span classNome={`text-sm font-semibold tracking-wide ${
        isConnected ? 'text-[#b4a68c]' : 'text-[#9e5c50]'
      }`}>
        {isConnected ? 'ONLINE' : 'OFFLINE'}
      </span>
    </div>
  )
}