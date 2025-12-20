import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    Wifi,
    WifiOff,
    Trash2,
    Download,
    Filter,
    Search,
    RefreshCw,
    Pause,
    Play,
    ChevronDown,
    Info,
    AlertTriangle,
    AlertCircle,
    CheckCircle,
    Bug,
    Globe
} from 'lucide-react';
import config from '../../config';

// Log level colors and icons
const LOG_STYLES = {
    INFO: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: Info },
    SUCCESS: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle },
    WARNING: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: AlertTriangle },
    ERROR: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertCircle },
    DEBUG: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: Bug },
    HTTP: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', icon: Globe },
};

const ServerLogs = () => {
    const [logs, setLogs] = useState([]);
    const [connected, setConnected] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [autoScroll, setAutoScroll] = useState(true);
    const [stats, setStats] = useState(null);

    const wsRef = useRef(null);
    const logsContainerRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    // Connect to WebSocket
    const connectWebSocket = useCallback(() => {
        try {
            const wsUrl = config.API_BASE_URL1.replace('http', 'ws').replace('/api', '') + '/ws/logs';
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('WebSocket connected');
                setConnected(true);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'init') {
                    setLogs(data.logs || []);
                } else if (data.type === 'log' && !isPaused) {
                    setLogs(prev => [data.data, ...prev].slice(0, 500));
                } else if (data.type === 'clear') {
                    setLogs([]);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setConnected(false);
                // Reconnect after 3 seconds
                reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                ws.close();
            };

            wsRef.current = ws;
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
        }
    }, [isPaused]);

    // Fetch stats
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${config.API_BASE_URL1}/logs/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    // Clear logs
    const clearLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${config.API_BASE_URL1}/logs/clear`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs([]);
        } catch (error) {
            console.error('Failed to clear logs:', error);
        }
    };

    // Download logs
    const downloadLogs = () => {
        const logText = filteredLogs
            .map(log => `[${log.timestamp}] [${log.level}] ${log.message}`)
            .join('\n');

        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `server-logs-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        connectWebSocket();
        fetchStats();

        const statsInterval = setInterval(fetchStats, 30000);

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            clearInterval(statsInterval);
        };
    }, [connectWebSocket]);

    // Auto-scroll
    useEffect(() => {
        if (autoScroll && logsContainerRef.current) {
            logsContainerRef.current.scrollTop = 0;
        }
    }, [logs, autoScroll]);

    // Filter logs
    const filteredLogs = logs.filter(log => {
        const matchesFilter = filter === 'ALL' || log.level === filter;
        const matchesSearch = !searchQuery ||
            log.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl">
                            <Terminal className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Server Logs</h1>
                            <p className="text-sm text-gray-500">Live monitoring dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${connected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {connected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                            <span className="text-sm font-medium">
                                {connected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        {Object.entries(stats.byLevel || {}).map(([level, count]) => {
                            const style = LOG_STYLES[level] || LOG_STYLES.INFO;
                            return (
                                <div key={level} className={`rounded-xl p-4 shadow-sm border ${style.bg} ${style.border}`}>
                                    <p className={`text-xs ${style.text} opacity-70 mb-1`}>{level}</p>
                                    <p className={`text-2xl font-bold ${style.text}`}>{count}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px] relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer"
                            >
                                <option value="ALL">All Levels</option>
                                <option value="INFO">Info</option>
                                <option value="SUCCESS">Success</option>
                                <option value="WARNING">Warning</option>
                                <option value="ERROR">Error</option>
                                <option value="DEBUG">Debug</option>
                                <option value="HTTP">HTTP</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className={`p-2 rounded-lg border transition-colors ${isPaused
                                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                    }`}
                                title={isPaused ? 'Resume' : 'Pause'}
                            >
                                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            </button>

                            <button
                                onClick={fetchStats}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>

                            <button
                                onClick={downloadLogs}
                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                                title="Download"
                            >
                                <Download className="w-4 h-4" />
                            </button>

                            <button
                                onClick={clearLogs}
                                className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                                title="Clear"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Logs Container */}
                <div
                    ref={logsContainerRef}
                    className="bg-gray-900 rounded-xl shadow-lg overflow-hidden"
                    style={{ height: 'calc(100vh - 380px)', minHeight: '400px' }}
                >
                    <div className="overflow-auto h-full p-4 font-mono text-sm">
                        {filteredLogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <Terminal className="w-12 h-12 mb-3 opacity-50" />
                                <p>No logs to display</p>
                                <p className="text-xs mt-1">Waiting for server activity...</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {filteredLogs.map((log) => {
                                    const style = LOG_STYLES[log.level] || LOG_STYLES.INFO;
                                    const Icon = style.icon;

                                    return (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, y: -10, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mb-2"
                                        >
                                            <div className={`flex items-start gap-3 p-3 rounded-lg ${style.bg} ${style.border} border`}>
                                                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${style.text}`} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs font-semibold ${style.text}`}>
                                                            {log.level}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {formatTime(log.timestamp)}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-800 break-all text-xs leading-relaxed">
                                                        {log.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Footer Status */}
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <span>Showing {filteredLogs.length} of {logs.length} logs</span>
                    <span>{isPaused ? '⏸ Paused' : '▶ Live'}</span>
                </div>
            </div>
        </div>
    );
};

export default ServerLogs;
