import React from 'react';
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

const integrationStatuses: IntegrationStatus[] = [
  {
    name: 'CCTNS FIR Gateway',
    status: 'Connected',
    mode: 'Mock',
    lastSync: '2026-01-28 10:41 IST',
    recordsSynced: '12,482',
    latencyMs: 128,
    uptime: '99.8%',
  },
  {
    name: 'NCRB Analytics Feed',
    status: 'Connected',
    mode: 'Mock',
    lastSync: '2026-01-28 10:38 IST',
    recordsSynced: '58,910',
    latencyMs: 96,
    uptime: '99.9%',
  },
  {
    name: 'State Police Portal',
    status: 'Connected',
    mode: 'Mock',
    lastSync: '2026-01-28 10:35 IST',
    recordsSynced: '2,215',
    latencyMs: 142,
    uptime: '99.6%',
  },
  {
    name: 'Aadhaar Verification',
    status: 'Connected',
    mode: 'Mock',
    lastSync: '2026-01-28 10:32 IST',
    recordsSynced: '1,006',
    latencyMs: 180,
    uptime: '99.2%',
  },
  {
    name: 'Court Case Tracker',
    status: 'Degraded',
    mode: 'Mock',
    lastSync: '2026-01-28 10:20 IST',
    recordsSynced: '540',
    latencyMs: 320,
    uptime: '98.1%',
  },
];

const apiHealth: ApiHealth[] = [
  { name: 'FIR Submit API', latencyMs: 120, status: 'Healthy' },
  { name: 'FIR Search API', latencyMs: 140, status: 'Healthy' },
  { name: 'Case Sync API', latencyMs: 220, status: 'Warning' },
  { name: 'Citizen Verification API', latencyMs: 180, status: 'Healthy' },
  { name: 'Officer Dispatch API', latencyMs: 260, status: 'Warning' },
];

const syncLogs: SyncLog[] = [
  {
    id: 'log-1',
    time: '10:41:22 IST',
    message: 'CCTNS FIR batch sync completed (248 records).',
    status: 'success',
  },
  {
    id: 'log-2',
    time: '10:38:07 IST',
    message: 'NCRB analytics feed updated (weekly trend).',
    status: 'success',
  },
  {
    id: 'log-3',
    time: '10:35:12 IST',
    message: 'State Police portal officer roster refreshed.',
    status: 'success',
  },
  {
    id: 'log-4',
    time: '10:28:40 IST',
    message: 'Court tracker latency spike detected (retry queued).',
    status: 'warning',
  },
  {
    id: 'log-5',
    time: '10:18:19 IST',
    message: 'Aadhaar verification service healthy (100% success).',
    status: 'success',
  },
];

const dataContracts = [
  'POST /api/integrations/cctns/submit-fir',
  'GET /api/integrations/cctns/search/{firId}',
  'GET /api/integrations/ncrb/crime-statistics',
  'GET /api/integrations/state/officers',
  'POST /api/integrations/aadhaar/verify',
  'GET /api/integrations/courts/case/{caseId}',
];

const renderStatusBadge = (status: IntegrationStatus['status']) => {
  const className = status === 'Connected' ? 'status-connected' : status === 'Degraded' ? 'status-degraded' : 'status-offline';
  return <span className={`status-badge ${className}`}>{status}</span>;
};

const renderHealthBadge = (status: ApiHealth['status']) => {
  const className = status === 'Healthy' ? 'health-healthy' : status === 'Warning' ? 'health-warning' : 'health-critical';
  return <span className={`health-badge ${className}`}>{status}</span>;
};

export const IntegrationDashboard: React.FC = () => {
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
        {integrationStatuses.map((item) => (
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
            {apiHealth.map((api) => (
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
            {syncLogs.map((log) => (
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
            {dataContracts.map((contract) => (
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
