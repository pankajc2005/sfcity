import React, { useEffect, useState } from 'react';
import './IntegrationDashboard.css';

interface IntegrationStatus {
  name: string;
  status: 'Connected' | 'Degraded' | 'Offline';
  mode: 'Mock' | 'Live';
  lastSync: string;
  recordsSynced: string;
  latencyMs: number;
  uptime: string;
}

interface ApiHealth {
  name: string;
  latencyMs: number;
  status: 'Healthy' | 'Warning' | 'Critical';
}

interface SyncLog {
  id: string;
  time: string;
  message: string;
  status: 'success' | 'warning' | 'error';
}

interface IntegrationData {
  integrationStatuses: IntegrationStatus[];
  apiHealth: ApiHealth[];
  syncLogs: SyncLog[];
  dataContracts: string[];
}

const renderStatusBadge = (status: IntegrationStatus['status']) => {
  const className = status === 'Connected' ? 'status-connected' : status === 'Degraded' ? 'status-degraded' : 'status-offline';
  return <span className={`status-badge ${className}`}>{status}</span>;
};

const renderHealthBadge = (status: ApiHealth['status']) => {
  const className = status === 'Healthy' ? 'health-healthy' : status === 'Warning' ? 'health-warning' : 'health-critical';
  return <span className={`health-badge ${className}`}>{status}</span>;
};

export const IntegrationDashboard: React.FC = () => {
  const [data, setData] = useState<IntegrationData>({
    integrationStatuses: [],
    apiHealth: [],
    syncLogs: [],
    dataContracts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIntegrationData = async () => {
      try {
        const response = await fetch('/integration-data.json');
        if (!response.ok) {
          throw new Error('Failed to load integration data');
        }
        const jsonData: IntegrationData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    loadIntegrationData();
  }, []);

  if (loading) {
    return <div className="integration-dashboard">Loading integration data...</div>;
  }

  if (error) {
    return <div className="integration-dashboard error">Error: {error}</div>;
  }

  return (
    <div className="integration-dashboard">
      <div className="integration-header">
        <div>
          <h2>Integration Linkage Dashboard</h2>
          <p>Demo view showing government system adapters (mock endpoints with real data contracts).</p>
        </div>
        <div className="integration-badges">
          <span className="pill">Mock Data</span>
          <span className="pill">Adapter Ready</span>
          <span className="pill">Gov-API Compatible</span>
        </div>
      </div>

      <div className="integration-grid">
        {data.integrationStatuses.map((item) => (
          <div key={item.name} className="integration-card">
            <div className="card-header">
              <h3>{item.name}</h3>
              {renderStatusBadge(item.status)}
            </div>
            <div className="card-meta">
              <span className="mode-tag">{item.mode}</span>
              <span className="meta-dot">•</span>
              <span>Latency: {item.latencyMs} ms</span>
            </div>
            <div className="card-details">
              <div>
                <p className="label">Last Sync</p>
                <p className="value">{item.lastSync}</p>
              </div>
              <div>
                <p className="label">Records Synced</p>
                <p className="value">{item.recordsSynced}</p>
              </div>
              <div>
                <p className="label">Uptime</p>
                <p className="value">{item.uptime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="integration-panels">
        <div className="panel api-health">
          <h3>API Health & Latency</h3>
          <div className="health-list">
            {data.apiHealth.map((api) => (
              <div key={api.name} className="health-row">
                <div className="health-info">
                  <span className="health-name">{api.name}</span>
                  {renderHealthBadge(api.status)}
                </div>
                <div className="health-bar">
                  <div
                    className={`health-bar-fill ${api.status.toLowerCase()}`}
                    style={{ width: `${Math.min(api.latencyMs / 4, 100)}%` }}
                  />
                </div>
                <span className="health-latency">{api.latencyMs} ms</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel sync-logs">
          <h3>Recent Sync Logs</h3>
          <ul>
            {data.syncLogs.map((log) => (
              <li key={log.id} className={`log-item ${log.status}`}>
                <span className="log-time">{log.time}</span>
                <span className="log-message">{log.message}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="integration-panels">
        <div className="panel flow-panel">
          <h3>Integration Flow (Demo)</h3>
          <div className="flow-steps">
            <div className="flow-step">SafeCity FIR Intake</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">Validation & Sanitization</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">Adapter Layer</div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">Government Systems (Mock)</div>
          </div>
          <p className="flow-note">
            Adapter layer uses the same payload schemas and response formats as real government APIs.
          </p>
        </div>

        <div className="panel contract-panel">
          <h3>API Contracts (Samples)</h3>
          <ul>
            {data.dataContracts.map((contract) => (
              <li key={contract}>{contract}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="integration-footer">
        <span className="footer-note">
          Demo mode enabled. Swap mock adapters with real government endpoints without changing UI workflows.
        </span>
        <span className="footer-tag">Integration Readiness: 92%</span>
      </div>
    </div>
  );
};

export default IntegrationDashboard;
