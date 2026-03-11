'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMissionControl } from '@/store'
import { createClientLogger } from '@/lib/client-logger'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const log = createClientLogger('TokenDashboard')

interface UsageStats {
  summary: {
    totalTokens: number
    totalCost: number
    requestCount: number
    avgTokensPerRequest: number
    avgCostPerRequest: number
  }
  models: Record<string, { totalTokens: number; totalCost: number; requestCount: number }>
  sessions: Record<string, { totalTokens: number; totalCost: number; requestCount: number }>
  timeframe: string
  recordCount: number
}

interface TrendData {
  trends: Array<{ timestamp: string; tokens: number; cost: number; requests: number }>
  timeframe: string
}

export function TokenDashboardPanel() {
  const { sessions } = useMissionControl()

  const [selectedTimeframe, setSelectedTimeframe] = useState<'hour' | 'day' | 'week' | 'month'>('day')
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [trendData, setTrendData] = useState<TrendData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const loadUsageStats = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tokens?action=stats&timeframe=${selectedTimeframe}`)
      const data = await response.json()
      setUsageStats(data)
    } catch (error) {
      log.error('Failed to load usage stats:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedTimeframe])

  const loadTrendData = useCallback(async () => {
    try {
      const response = await fetch(`/api/tokens?action=trends&timeframe=${selectedTimeframe}`)
      const data = await response.json()
      setTrendData(data)
    } catch (error) {
      log.error('Failed to load trend data:', error)
    }
  }, [selectedTimeframe])

  useEffect(() => {
    loadUsageStats()
    loadTrendData()
  }, [loadUsageStats, loadTrendData])

  const exportData = async (format: 'json' | 'csv') => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/tokens?action=export&timeframe=${selectedTimeframe}&format=${format}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `token-usage-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      log.error('Export failed:', error)
      alert('Export failed: ' + error)
    } finally {
      setIsExporting(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatCost = (cost: number) => {
    return '$' + cost.toFixed(4)
  }

  const getModelDisplayNome = (modelNome: string) => {
    const parts = modelNome.split('/')
    return parts[parts.length - 1] || modelNome
  }

  const prepareModelChartData = () => {
    if (!usageStats?.models) return []
    return Object.entries(usageStats.models)
      .map(([model, stats]) => ({
        name: getModelDisplayNome(model),
        tokens: stats.totalTokens,
        cost: stats.totalCost,
        requests: stats.requestCount
      }))
      .sort((a, b) => b.cost - a.cost)
  }

  const preparePieChartData = () => {
    if (!usageStats?.models) return []
    const data = Object.entries(usageStats.models)
      .map(([model, stats]) => ({
        name: getModelDisplayNome(model),
        value: stats.totalCost,
        tokens: stats.totalTokens
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6) // Top 6 models
    
    return data
  }

  const prepareTrendChartData = () => {
    if (!trendData?.trends) return []
    return trendData.trends.map(trend => ({
      time: new Date(trend.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tokens: trend.tokens,
      cost: trend.cost,
      requests: trend.requests
    }))
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  // Enhanced performance metrics
  const getPerformanceMetrics = () => {
    if (!usageStats?.models) return null

    const models = Object.entries(usageStats.models)
    if (models.length === 0) return null

    // Find most cost-effective model (lowest cost per token)
    let mostEfficient = { model: models[0][0], stats: models[0][1] }
    for (const [model, stats] of models) {
      const costPerToken = stats.totalCost / Math.max(1, stats.totalTokens)
      const bestCostPerToken = mostEfficient.stats.totalCost / Math.max(1, mostEfficient.stats.totalTokens)
      if (costPerToken < bestCostPerToken) {
        mostEfficient = { model, stats }
      }
    }

    // Find most used model
    let mostUsed = { model: models[0][0], stats: models[0][1] }
    for (const [model, stats] of models) {
      if (stats.requestCount > mostUsed.stats.requestCount) {
        mostUsed = { model, stats }
      }
    }

    // Find most expensive model
    let mostExpensive = { model: models[0][0], stats: models[0][1] }
    for (const [model, stats] of models) {
      const costPerToken = stats.totalCost / Math.max(1, stats.totalTokens)
      const bestCostPerToken = mostExpensive.stats.totalCost / Math.max(1, mostExpensive.stats.totalTokens)
      if (costPerToken > bestCostPerToken) {
        mostExpensive = { model, stats }
      }
    }

    // Calculate potential savings
    const totalTokens = usageStats.summary.totalTokens
    const currentCost = usageStats.summary.totalCost
    const efficientCostPerToken = mostEfficient.stats.totalCost / Math.max(1, mostEfficient.stats.totalTokens)
    const potentialCost = totalTokens * efficientCostPerToken
    const potentialSavings = Math.max(0, currentCost - potentialCost)

    return {
      mostEfficient,
      mostUsed,
      mostExpensive,
      potentialSavings,
      savingsPercentage: currentCost > 0 ? (potentialSavings / currentCost) * 100 : 0
    }
  }

  const performanceMetrics = getPerformanceMetrics()

  // Alert conditions
  const getAlerts = () => {
    const alerts = []
    
    if (usageStats && usageStats.summary.totalCost !== undefined && usageStats.summary.totalCost > 100) {
      alerts.push({
        type: 'warning',
        title: 'High Usage Cost',
        message: `Total cost of ${formatCost(usageStats.summary.totalCost)} exceeds $100 threshold`,
        suggestion: 'Consider using more cost-effective models for routine tasks'
      })
    }

    if (performanceMetrics && performanceMetrics.savingsPercentage !== undefined && performanceMetrics.savingsPercentage > 20) {
      alerts.push({
        type: 'info',
        title: 'Optimization Opportunity',
        message: `Using ${getModelDisplayNome(performanceMetrics.mostEfficient.model)} could save ${formatCost(performanceMetrics.potentialSavings)} (${performanceMetrics.savingsPercentage.toFixed(1)}%)`,
        suggestion: 'Consider switching routine tasks to more efficient models'
      })
    }

    if (usageStats && usageStats.summary.requestCount !== undefined && usageStats.summary.requestCount > 1000) {
      alerts.push({
        type: 'info',
        title: 'High Request Volume',
        message: `${usageStats.summary.requestCount} requests in selected timeframe`,
        suggestion: 'Consider implementing request batching or caching for efficiency'
      })
    }

    return alerts
  }

  const alerts = getAlerts()

  return (
    <div classNome="p-6 space-y-6">
      <div classNome="border-b border-border pb-4">
        <div classNome="flex items-center justify-between">
          <div>
            <h1 classNome="text-3xl font-bold text-foreground">Token & Cost Dashboard</h1>
            <p classNome="text-muted-foreground mt-2">
              Monitor token usage and costs across models and sessions
            </p>
          </div>
          <div classNome="flex space-x-2">
            {(['hour', 'day', 'week', 'month'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                classNome={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div classNome="flex items-center justify-center h-32">
          <div classNome="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span classNome="ml-3 text-muted-foreground">Loading usage data...</span>
        </div>
      ) : usageStats ? (
        <div classNome="space-y-6">
          {/* Overview Stats */}
          <div classNome="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div classNome="bg-card border border-border rounded-lg p-6">
              <div classNome="text-3xl font-bold text-foreground">
                {formatNumber(usageStats.summary.totalTokens)}
              </div>
              <div classNome="text-sm text-muted-foreground">
                Total Tokens ({selectedTimeframe})
              </div>
            </div>

            <div classNome="bg-card border border-border rounded-lg p-6">
              <div classNome="text-3xl font-bold text-foreground">
                {formatCost(usageStats.summary.totalCost)}
              </div>
              <div classNome="text-sm text-muted-foreground">
                Custo Total ({selectedTimeframe})
              </div>
            </div>

            <div classNome="bg-card border border-border rounded-lg p-6">
              <div classNome="text-3xl font-bold text-foreground">
                {formatNumber(usageStats.summary.requestCount)}
              </div>
              <div classNome="text-sm text-muted-foreground">
                API Requests
              </div>
            </div>

            <div classNome="bg-card border border-border rounded-lg p-6">
              <div classNome="text-3xl font-bold text-foreground">
                {formatNumber(usageStats.summary.avgTokensPerRequest)}
              </div>
              <div classNome="text-sm text-muted-foreground">
                Avg Tokens/Request
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div classNome="grid lg:grid-cols-2 gap-6">
            {/* Usage Trends Chart */}
            <div classNome="bg-card border border-border rounded-lg p-6 lg:col-span-2">
              <h2 classNome="text-xl font-semibold mb-4">Usage Trends (Last 24h)</h2>
              <div classNome="h-64">
                {prepareTrendChartData().length === 0 ? (
                  <div classNome="h-full flex items-center justify-center text-muted-foreground text-sm">No trend data for this timeframe</div>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareTrendChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="tokens" 
                      stroke="#8884d8" 
                      strokeWidth={2} 
                      name="Tokens"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="requests" 
                      stroke="#82ca9d" 
                      strokeWidth={2} 
                      name="Requests"
                    />
                  </LineChart>
                </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Model Usage Bar Chart */}
            <div classNome="bg-card border border-border rounded-lg p-6">
              <h2 classNome="text-xl font-semibold mb-4">Uso de Tokens by Model</h2>
              <div classNome="h-64">
                {prepareModelChartData().length === 0 ? (
                  <div classNome="h-full flex items-center justify-center text-muted-foreground text-sm">No model usage data yet</div>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareModelChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [formatNumber(Number(value)), name]} />
                    <Bar dataKey="tokens" fill="#8884d8" name="Tokens" />
                  </BarChart>
                </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Cost Distribution Pie Chart */}
            <div classNome="bg-card border border-border rounded-lg p-6">
              <h2 classNome="text-xl font-semibold mb-4">Cost Distribution by Model</h2>
              <div classNome="h-64">
                {preparePieChartData().length === 0 ? (
                  <div classNome="h-full flex items-center justify-center text-muted-foreground text-sm">No cost data yet</div>
                ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={preparePieChartData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {preparePieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCost(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div classNome="bg-card border border-border rounded-lg p-6">
            <div classNome="flex items-center justify-between mb-4">
              <h2 classNome="text-xl font-semibold">Export Data</h2>
              <div classNome="flex space-x-2">
                <button
                  onClick={() => exportData('csv')}
                  disabled={isExporting}
                  classNome="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md hover:bg-blue-500/30 disabled:opacity-50 transition-smooth"
                >
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </button>
                <button
                  onClick={() => exportData('json')}
                  disabled={isExporting}
                  classNome="px-4 py-2 bg-[#b4a68c]/20 text-[#b4a68c] border border-[#b4a68c]/30 rounded-md hover:bg-[#b4a68c]/30 disabled:opacity-50 transition-smooth"
                >
                  {isExporting ? 'Exporting...' : 'Export JSON'}
                </button>
              </div>
            </div>
            <p classNome="text-sm text-muted-foreground">
              Export token usage data for analysis. Includes detailed usage records, model statistics, and cost breakdowns.
            </p>
          </div>

          {/* Performance Insights */}
          {performanceMetrics && (
            <div classNome="bg-card border border-border rounded-lg p-6">
              <h2 classNome="text-xl font-semibold mb-4">Performance Insights</h2>
              
              {/* Alerts */}
              {alerts.length > 0 && (
                <div classNome="mb-6 space-y-3">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      classNome={`border-l-4 p-4 rounded ${
                        alert.type === 'warning' 
                          ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                          : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      }`}
                    >
                      <div classNome="flex items-start">
                        <div classNome="flex-shrink-0">
                          {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                        </div>
                        <div classNome="ml-3">
                          <p classNome="text-sm font-medium">{alert.title}</p>
                          <p classNome="text-xs text-muted-foreground mt-1">{alert.message}</p>
                          <p classNome="text-xs text-blue-600 dark:text-blue-400 mt-2">{alert.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Performance Metrics Grid */}
              <div classNome="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div classNome="bg-secondary rounded-lg p-4">
                  <h3 classNome="text-sm font-medium text-muted-foreground mb-2">Most Efficient Model</h3>
                  <div classNome="text-lg font-bold text-[#b4a68c] dark:text-[#b4a68c]">
                    {getModelDisplayNome(performanceMetrics.mostEfficient.model)}
                  </div>
                  <div classNome="text-xs text-muted-foreground">
                    ${(performanceMetrics.mostEfficient.stats.totalCost / Math.max(1, performanceMetrics.mostEfficient.stats.totalTokens) * 1000).toFixed(4)}/1K tokens
                  </div>
                </div>

                <div classNome="bg-secondary rounded-lg p-4">
                  <h3 classNome="text-sm font-medium text-muted-foreground mb-2">Most Used Model</h3>
                  <div classNome="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {getModelDisplayNome(performanceMetrics.mostUsed.model)}
                  </div>
                  <div classNome="text-xs text-muted-foreground">
                    {performanceMetrics.mostUsed.stats.requestCount} requests
                  </div>
                </div>

                <div classNome="bg-secondary rounded-lg p-4">
                  <h3 classNome="text-sm font-medium text-muted-foreground mb-2">Optimization Potential</h3>
                  <div classNome="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {formatCost(performanceMetrics.potentialSavings)}
                  </div>
                  <div classNome="text-xs text-muted-foreground">
                    {performanceMetrics.savingsPercentage.toFixed(1)}% savings possible
                  </div>
                </div>
              </div>

              {/* Model Efficiency Comparison */}
              <div classNome="mt-4">
                <h3 classNome="text-sm font-medium mb-3">Model Efficiency Comparison</h3>
                <div classNome="space-y-2">
                  {Object.entries(usageStats?.models || {})
                    .map(([model, stats]) => {
                      const costPerToken = stats.totalCost / Math.max(1, stats.totalTokens) * 1000
                      const efficiency = 1 / costPerToken // Higher is better
                      const maxEfficiency = Math.max(...Object.values(usageStats?.models || {}).map(s => 1 / (s.totalCost / Math.max(1, s.totalTokens) * 1000)))
                      const barWidth = (efficiency / maxEfficiency) * 100

                      return (
                        <div key={model} classNome="flex items-center text-sm">
                          <div classNome="w-32 truncate text-muted-foreground">
                            {getModelDisplayNome(model)}
                          </div>
                          <div classNome="flex-1 mx-3">
                            <div classNome="w-full bg-secondary rounded-full h-2">
                              <div
                                classNome="bg-[#b4a68c] h-2 rounded-full"
                                style={{ width: `${barWidth}%` }}
                              ></div>
                            </div>
                          </div>
                          <div classNome="w-20 text-right text-xs text-muted-foreground">
                            ${costPerToken.toFixed(4)}/1K
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Statistics */}
          <div classNome="grid lg:grid-cols-2 gap-6">
            {/* Model Statistics */}
            <div classNome="bg-card border border-border rounded-lg p-6">
              <h2 classNome="text-xl font-semibold mb-4">Model Performance</h2>
              
              <div classNome="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(usageStats.models)
                  .sort(([,a], [,b]) => b.totalCost - a.totalCost)
                  .map(([model, stats]) => {
                    const avgCostPerRequest = stats.totalCost / Math.max(1, stats.requestCount)
                    const avgTokensPerRequest = stats.totalTokens / Math.max(1, stats.requestCount)
                    
                    return (
                      <div key={model} classNome="p-3 bg-secondary rounded-lg">
                        <div classNome="flex items-center justify-between mb-2">
                          <div classNome="font-medium text-foreground">
                            {getModelDisplayNome(model)}
                          </div>
                          <div classNome="text-right">
                            <div classNome="text-sm font-medium text-foreground">
                              {formatCost(stats.totalCost)}
                            </div>
                            <div classNome="text-xs text-muted-foreground">
                              {formatNumber(stats.totalTokens)} tokens
                            </div>
                          </div>
                        </div>
                        <div classNome="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                          <div>
                            <div classNome="font-medium">{stats.requestCount}</div>
                            <div>Requests</div>
                          </div>
                          <div>
                            <div classNome="font-medium">{formatCost(avgCostPerRequest)}</div>
                            <div>Avg Cost</div>
                          </div>
                          <div>
                            <div classNome="font-medium">{formatNumber(avgTokensPerRequest)}</div>
                            <div>Avg Tokens</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Session Statistics */}
            <div classNome="bg-card border border-border rounded-lg p-6">
              <h2 classNome="text-xl font-semibold mb-4">Top Sessions by Cost</h2>
              
              <div classNome="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(usageStats.sessions)
                  .sort(([,a], [,b]) => b.totalCost - a.totalCost)
                  .slice(0, 10)
                  .map(([sessionId, stats]) => {
                    const sessionInfo = sessions.find(s => s.id === sessionId)
                    const avgCostPerRequest = stats.totalCost / Math.max(1, stats.requestCount)
                    
                    return (
                      <div key={sessionId} classNome="p-3 bg-secondary rounded-lg">
                        <div classNome="flex items-center justify-between mb-2">
                          <div>
                            <div classNome="font-medium text-foreground">
                              {sessionInfo?.key || sessionId}
                            </div>
                            <div classNome="text-xs text-muted-foreground">
                              {sessionInfo?.active ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                          <div classNome="text-right">
                            <div classNome="text-sm font-medium text-foreground">
                              {formatCost(stats.totalCost)}
                            </div>
                            <div classNome="text-xs text-muted-foreground">
                              {formatNumber(stats.totalTokens)} tokens
                            </div>
                          </div>
                        </div>
                        <div classNome="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <div>
                            <div classNome="font-medium">{stats.requestCount}</div>
                            <div>Requests</div>
                          </div>
                          <div>
                            <div classNome="font-medium">{formatCost(avgCostPerRequest)}</div>
                            <div>Avg Cost</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div classNome="text-center text-muted-foreground py-12">
          <div classNome="text-lg mb-2">No usage data available</div>
          <div classNome="text-sm">Token usage will appear here once agents start running</div>
          <button 
            onClick={loadUsageStats}
            classNome="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  )
}
