import React from 'react';
import { CrimeInsight, Hotspot } from '../../types';
import './AnalyticsPanel.css';
interface AnalyticsPanelProps {
    insights: CrimeInsight;
    hotspots: Hotspot[];
}
/**
 * AnalyticsPanel Component - Task 6.0
 *
 * Comprehensive data visualization dashboard with:
 * - Peak hours analysis (bar chart)
 * - Day-wise crime trends (line chart)
 * - Crime type distribution (pie chart)
 * - Monthly trends (bar chart)
 * - Hotspot severity distribution (pie chart)
 *
 * Time Complexity: O(n) for data rendering
 * Space Complexity: O(n) for chart data
 */
export declare const AnalyticsPanel: React.FC<AnalyticsPanelProps>;
export default AnalyticsPanel;
//# sourceMappingURL=AnalyticsPanel.d.ts.map