import React from 'react';
import { FIR } from '../types';
import './DataTablePage.css';

interface DataTablePageProps {
  filteredFIRs: FIR[];
}

export const DataTablePage: React.FC<DataTablePageProps> = ({ filteredFIRs }) => {
  return (
    <div className="data-table-page">
      <header className="page-header">
        <h1>FIR Records</h1>
        <p className="page-subtitle">
          Detailed view of all First Information Reports
        </p>
      </header>

      <section className="table-section">
        {filteredFIRs.length === 0 ? (
          <div className="empty-state">
            <p>No records match the current filters.</p>
          </div>
        ) : (
          <>
            <div className="table-header">
              <p>Showing {Math.min(100, filteredFIRs.length)} of {filteredFIRs.length} records</p>
            </div>
            <div className="table-wrapper">
              <table className="fir-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Crime Type</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Area</th>
                    <th>Zone</th>
                    <th>Police Station</th>
                    <th>Coordinates</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFIRs.slice(0, 100).map((fir) => (
                    <tr key={fir.id}>
                      <td>{fir.id}</td>
                      <td>{fir.crimeType}</td>
                      <td>{fir.date.toLocaleDateString()}</td>
                      <td>{fir.time}</td>
                      <td>{fir.area}</td>
                      <td>{fir.zone}</td>
                      <td>{fir.policeStation}</td>
                      <td>
                        {fir.latitude.toFixed(4)}, {fir.longitude.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredFIRs.length > 100 && (
              <p className="table-note">
                Showing first 100 records. Export to CSV to see all {filteredFIRs.length} records.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};
