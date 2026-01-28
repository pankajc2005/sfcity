import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CrimeInsight } from '../../types';
import './AnalyticsPanel.css';

interface AnalyticsPanelProps {
  insights: CrimeInsight;
}

/**
 * AnalyticsPanel Component - Task 6.0
 *
 * Comprehensive data visualization dashboard with:
 * - Peak hours analysis (bar chart)
 * - Day-wise crime trends (line chart)
 * - Crime type distribution (pie chart)
 * - Monthly trends (bar chart)
 *
 * Time Complexity: O(n) for data rendering
 * Space Complexity: O(n) for chart data
 */
export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  insights,
}) => {
  // Colors for charts
  const COLORS = ['#2e7d32', '#f57c00', '#c62828'];
  const CHART_COLORS = {
    primary: '#1a237e',
    secondary: '#3949ab',
    success: '#2e7d32',
    warning: '#f57c00',
    danger: '#c62828',
  };

  // Day names for x-axis
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayWiseTrendsWithNames = insights.dayWiseTrends.map((trend, idx) => ({
    ...trend,
    dayName: dayNames[idx] || trend.day,
  }));

  return (
    <div className="analytics-panel">
      <h2>📊 Crime Analytics Dashboard</h2>

      <div className="charts-grid">
        {/* Peak Hours Chart */}
        <div className="chart-container">
          <h3>Peak Crime Hours (24-Hour Distribution)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                label={{ value: 'Hour of Day', position: 'insideBottomRight', offset: -5 }}
              />
              <YAxis
                label={{ value: 'Crime Count', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                formatter={(value) => [`${value} incidents`, 'Count']}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="count" fill={CHART_COLORS.danger} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {insights.peakHours.length > 0 && (
            <div className="chart-insight">
              <strong>Peak Hour:</strong>{' '}
              {insights.peakHours[0]?.hour}:00 with{' '}
              {insights.peakHours[0]?.count} incidents
            </div>
          )}
        </div>

        {/* Day-Wise Trends Chart */}
        <div className="chart-container">
          <h3>Weekly Crime Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dayWiseTrendsWithNames}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dayName"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                label={{ value: 'Crime Count', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                formatter={(value) => [`${value} incidents`, 'Count']}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={CHART_COLORS.primary}
                dot={{ fill: CHART_COLORS.primary, r: 5 }}
                activeDot={{ r: 7 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
          {insights.dayWiseTrends.length > 0 && (
            <div className="chart-insight">
              <strong>Highest Day:</strong>{' '}
              {dayNames[insights.dayWiseTrends.findIndex((d) => d.count === Math.max(...insights.dayWiseTrends.map((t) => t.count)))]}
            </div>
          )}
        </div>

        {/* Crime Type Distribution */}
        <div className="chart-container">
          <h3>Crime Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={insights.topCrimeTypes}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(props: any) => `${props.type}: ${props.count}`}
              >
                {insights.topCrimeTypes.map((_entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value} incidents`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="chart-container">
          <h3>Monthly Crime Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                label={{ value: 'Crime Count', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                formatter={(value) => `${value} incidents`}
              />
              <Bar dataKey="count" fill={CHART_COLORS.secondary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Areas by Crime Count */}
        <div className="chart-container">
          <h3>Top Crime Areas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={insights.areaStatistics.slice(0, 10)}
              layout="vertical"
              margin={{ left: 150 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="area"
                width={140}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                formatter={(value) => `${value} incidents`}
              />
              <Bar dataKey="count" fill={CHART_COLORS.warning} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="analytics-summary">
        <div className="summary-card">
          <h4>Total Incidents</h4>
          <p className="summary-value">
            {insights.peakHours.reduce((sum, h) => sum + h.count, 0)}
          </p>
        </div>

        <div className="summary-card">
          <h4>Crime Types Tracked</h4>
          <p className="summary-value">{insights.topCrimeTypes.length}</p>
        </div>

        <div className="summary-card">
          <h4>Areas Covered</h4>
          <p className="summary-value">{insights.areaStatistics.length}</p>
        </div>

        <div className="summary-card">
          <h4>Avg Daily Crimes</h4>
          <p className="summary-value">
            {Math.round(
              insights.dayWiseTrends.reduce((sum, d) => sum + d.count, 0) / 7
            )}
          </p>
        </div>

        <div className="summary-card">
          <h4>Peak Crime Type</h4>
          <p className="summary-value">
            {insights.topCrimeTypes[0]?.type || 'N/A'}
          </p>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="insights-box">
        <h3>🎯 Key Insights & Recommendations</h3>

        <div className="insight-section">
          <h4>📍 Predicted Peak Hours for Patrol</h4>
          <ul>
            {insights.predictedPeakHours && insights.predictedPeakHours.map((hour: number, idx: number) => (
              <li key={idx}>
                <strong>{hour}:00 - {((hour + 1) % 24).toString().padStart(2, '0')}:00</strong> - Increase patrol presence
              </li>
            ))}
          </ul>
        </div>

        <div className="insight-section">
          <h4>⚠️ High-Risk Days</h4>
          <ul>
            {insights.highRiskDays && insights.highRiskDays.map((day: any, idx: number) => (
              <li key={idx}>
                <strong>{day.day}</strong> - {day.count} incidents (Above average)
              </li>
            ))}
          </ul>
        </div>

        <div className="insight-section">
          <h4>🚓 Resource Allocation</h4>
          <ul>
            <li>Deploy <strong>maximum units</strong> during {insights.peakHours[0]?.hour || 0}:00 - {((insights.peakHours[0]?.hour || 0) + 2) % 24}:00</li>
            <li>Focus on <strong>top 3 areas</strong>: {insights.areaStatistics.slice(0, 3).map(a => a.area).join(', ')}</li>
            <li>Prioritize <strong>{insights.topCrimeTypes[0]?.type}</strong> prevention programs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
