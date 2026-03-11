'use client'

import { useMissionControl } from '@/store'

interface ConnectionStatusProps {
  isConnected: boolean
  onConnect: () => void
  onDisconnect: () => void
  onReconnect?: () => void
}

export function ConnectionStatus({ 
  isConnected, 
  onConnect, 
  onDisconnect, 
  onReconnect 
}: ConnectionStatusProps) {
  const { connection } = useMissionControl()
  const displayUrl = connection.url || 'ws://<gateway-host>:<gateway-port>'

  const getStatusColor = () => {
    if (isConnected) return 'bg-[#b4a68c] animate-pulse'
    if (connection.reconnectAttempts > 0) return 'bg-yellow-500'
    return 'bg-[#9e5c50]'
  }

  const getStatusText = () => {
    if (isConnected) {
      return 'Connected'
    }
    if (connection.reconnectAttempts > 0) {
      return `Reconnecting... (${connection.reconnectAttempts}/10)`
    }
    return 'Disconnected'
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Connection Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="text-sm font-medium">
          {getStatusText()}
        </span>
        <span className="text-xs text-muted-foreground">
          {displayUrl}
        </span>
      </div>

      {/* Connection Controls */}
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <button
            onClick={onDisconnect}
            className="px-3 py-1 bg-[#9e5c50]/20 text-[#9e5c50] border border-[#9e5c50]/30 rounded-md text-xs font-medium hover:bg-[#9e5c50]/30 transition-colors"
            title="Disconnect from gateway"
          >
            Disconnect
          </button>
        ) : connection.reconnectAttempts > 0 ? (
          <button
            onClick={onDisconnect}
            className="px-3 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-md text-xs font-medium hover:bg-gray-500/30 transition-colors"
            title="Cancel reconnection attempts"
          >
            Cancel
          </button>
        ) : (
          <div className="flex space-x-1">
            <button
              onClick={onConnect}
              className="px-3 py-1 bg-[#b4a68c]/20 text-[#b4a68c] border border-[#b4a68c]/30 rounded-md text-xs font-medium hover:bg-[#b4a68c]/30 transition-colors"
              title="Connect to gateway"
            >
              Connect
            </button>
            {onReconnect && (
              <button
                onClick={onReconnect}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md text-xs font-medium hover:bg-blue-500/30 transition-colors"
                title="Reconnect with fresh session"
              >
                Reconnect
              </button>
            )}
          </div>
        )}
      </div>

      {/* Real-time Status */}
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        {connection.latency ? (
          <>
            <span>Latency:</span>
            <span className="font-mono">{connection.latency}ms</span>
          </>
        ) : connection.lastConnected ? (
          <>
            <span>Last connected:</span>
            <span className="font-mono">
              {new Date(connection.lastConnected).toLocaleTimeString()}
            </span>
          </>
        ) : (
          <>
            <span>Status:</span>
            <span className="font-mono">Not connected</span>
          </>
        )}
      </div>
    </div>
  )
}
