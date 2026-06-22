"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Bug, RefreshCw, ChevronDown, ChevronUp, Search } from "lucide-react";

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
}

type Tab = "logs" | "errors" | "config" | "health" | "audit";

export function DebugBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("logs");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

  const fetchDebug = useCallback(async (endpoint: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/debug/${endpoint}`);
      const json = await res.json();
      setData(json.data || json);
    } catch (err: any) {
      setData({ error: err.message });
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Keyboard shortcut: Ctrl+Shift+D / Cmd+Shift+D
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Fetch data when tab changes and panel is open
  useEffect(() => {
    if (isOpen) {
      fetchDebug(activeTab);
    }
  }, [isOpen, activeTab, fetchDebug]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        title="Debug (Ctrl+Shift+D)"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "logs", label: "Logs" },
    { key: "errors", label: "Erreurs" },
    { key: "config", label: "Config" },
    { key: "health", label: "Sant\u00e9" },
    { key: "audit", label: "Audit" },
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black/30 pointer-events-auto" onClick={() => setIsOpen(false)} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-zinc-950 text-white pointer-events-auto rounded-t-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold">Debug Panel</span>
            <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">DEV</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDebug(activeTab)}
              className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
              title="Rafra\u00eechir"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-zinc-800 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-4 py-2 border-b border-zinc-800">
          <div className="flex items-center gap-2 bg-zinc-900 rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrer..."
              className="bg-transparent text-xs text-white outline-none w-full placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto p-4 font-mono text-xs max-h-[50vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-zinc-500">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              Chargement...
            </div>
          ) : renderTabContent(activeTab, data, filter)}
        </div>
      </div>
    </div>
  );
}

function renderTabContent(tab: Tab, data: any, filter: string) {
  if (!data) return <div className="text-zinc-500 py-4">Aucune donn\u00e9e</div>;
  if (data.error) return <div className="text-red-400 py-4">Erreur: {data.error}</div>;

  switch (tab) {
    case "logs":
      return renderLogs(data, filter);
    case "errors":
      return renderErrors(data, filter);
    case "config":
      return renderConfig(data);
    case "health":
      return renderHealth(data);
    case "audit":
      return renderAudit(data, filter);
    default:
      return <pre className="text-zinc-300">{JSON.stringify(data, null, 2)}</pre>;
  }
}

function renderLogs(data: any, filter: string) {
  const entries = data.entries || [];
  const filtered = filter
    ? entries.filter((e: any) =>
        JSON.stringify(e).toLowerCase().includes(filter.toLowerCase())
      )
    : entries;

  return (
    <div className="space-y-0.5">
      <div className="text-zinc-500 pb-2">{data.total} entr\u00e9es (affichage: {filtered.length})</div>
      {filtered.slice(-100).reverse().map((entry: LogEntry, i: number) => (
        <div
          key={i}
          className={`py-1 px-2 rounded ${
            entry.level === "error"
              ? "bg-red-900/20 text-red-300"
              : entry.level === "warn"
              ? "bg-yellow-900/20 text-yellow-300"
              : "text-zinc-300"
          }`}
        >
          <span className="text-zinc-500">{entry.timestamp?.split("T")[1]?.split(".")[0]}</span>{" "}
          <span className="text-zinc-600">[{entry.context || "?"}]</span>{" "}
          {entry.message}
        </div>
      ))}
      {filtered.length === 0 && <div className="text-zinc-600">Aucune entr\u00e9e</div>}
    </div>
  );
}

function renderErrors(data: any, filter: string) {
  const entries = data.entries || [];
  const filtered = filter
    ? entries.filter((e: any) =>
        JSON.stringify(e).toLowerCase().includes(filter.toLowerCase())
      )
    : entries;

  return (
    <div className="space-y-1">
      <div className="text-zinc-500 pb-1">{data.total} erreurs</div>
      {filtered.map((entry: any, i: number) => (
        <div key={i} className="bg-red-900/20 rounded-lg p-3 border border-red-900/30">
          <div className="flex items-start justify-between gap-2">
            <div className="text-red-300 font-medium">{entry.message}</div>
            <div className="text-zinc-500 text-[10px] whitespace-nowrap">
              {entry.timestamp?.split("T")[1]?.split(".")[0]}
            </div>
          </div>
          {entry.trace && (
            <details className="mt-2">
              <summary className="text-zinc-500 text-[10px] cursor-pointer hover:text-zinc-400">
                Stack trace
              </summary>
              <pre className="mt-1 text-[10px] text-zinc-400 overflow-auto max-h-32">
                {entry.trace}
              </pre>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}

function renderConfig(data: any) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-zinc-900 rounded-lg p-3">
          <div className="text-zinc-500 text-[10px]">Environment</div>
          <div className="text-emerald-400 font-medium">{data.environment}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-3">
          <div className="text-zinc-500 text-[10px]">Node.js</div>
          <div className="text-white font-medium">{data.nodeVersion}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-3">
          <div className="text-zinc-500 text-[10px]">Uptime</div>
          <div className="text-white font-medium">{Math.round(data.uptime)}s</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-3">
          <div className="text-zinc-500 text-[10px]">Heap</div>
          <div className="text-white font-medium">
            {Math.round(data.memory?.heapUsed / 1024 / 1024)}MB
          </div>
        </div>
      </div>

      <div className="text-zinc-500 text-[10px] font-semibold pt-2">Variables d'environnement</div>
      <div className="space-y-0.5">
        {Object.entries(data.vars || {}).map(([key, value]) => (
          <div key={key} className="flex gap-2 text-[11px]">
            <span className="text-zinc-500 min-w-[200px]">{key}</span>
            <span className="text-zinc-300 break-all">{value as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderHealth(data: any) {
  const isHealthy = data.status === "healthy";
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div
          className={`w-3 h-3 rounded-full ${
            isHealthy ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
        <span className={`font-medium ${isHealthy ? "text-emerald-400" : "text-red-400"}`}>
          {data.status?.toUpperCase()}
        </span>
        <span className="text-zinc-500">v{data.version}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-zinc-900 rounded-lg p-3">
          <div className="text-zinc-500 text-[10px]">Database</div>
          <div className={data.database?.status === "ok" ? "text-emerald-400" : "text-red-400"}>
            {data.database?.status}
          </div>
          <div className="text-zinc-600 text-[10px]">{data.latency?.database}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-3">
          <div className="text-zinc-500 text-[10px]">RSS</div>
          <div className="text-white">{data.memory?.rss}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-3">
          <div className="text-zinc-500 text-[10px]">Latency</div>
          <div className="text-white">{data.latency?.total}</div>
        </div>
      </div>

      {data.database?.counts && (
        <>
          <div className="text-zinc-500 text-[10px] font-semibold pt-2">Comptes DB</div>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(data.database.counts).map(([key, value]) => (
              <div key={key} className="bg-zinc-900 rounded-lg p-2 text-center">
                <div className="text-white font-medium text-xs">{value as number}</div>
                <div className="text-zinc-500 text-[10px]">{key}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function renderAudit(data: any, filter: string) {
  const entries = data.entries || [];
  const filtered = filter
    ? entries.filter((e: any) =>
        JSON.stringify(e).toLowerCase().includes(filter.toLowerCase())
      )
    : entries;

  return (
    <div className="space-y-0.5">
      <div className="text-zinc-500 pb-2">{data.total} entr\u00e9es</div>
      {filtered.map((entry: any, i: number) => (
        <div key={i} className="py-1.5 px-2 rounded bg-zinc-900/50">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-emerald-400 text-[10px] font-medium">{entry.action}</span>
              <span className="text-zinc-500 mx-1">·</span>
              <span className="text-zinc-400 text-[10px]">{entry.entityType}</span>
            </div>
            <span className="text-zinc-600 text-[10px]">
              {new Date(entry.createdAt).toLocaleTimeString()}
            </span>
          </div>
          {entry.actor && (
            <div className="text-zinc-600 text-[10px] mt-0.5">
              {entry.actor.profile?.fullname || entry.actor.email}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
