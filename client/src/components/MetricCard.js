import React from 'react';

const MetricCard = ({ title, value, unit, icon }) => (
  <div className="metric-card">
    <div className="metric-icon">{icon}</div>
    <div className="metric-content">
      <div className="metric-title">{title}</div>
      <div className="metric-value">
        {value}
        <span className="metric-unit">{unit}</span>
      </div>
    </div>
  </div>
);

export default MetricCard; 