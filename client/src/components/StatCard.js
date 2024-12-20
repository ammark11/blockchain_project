import React from 'react';

const StatCard = ({ icon, title, value, change, status }) => (
  <div className="stat-card">
    <div className="stat-header">
      <div className="stat-icon">{icon}</div>
      <div className="stat-title">{title}</div>
    </div>
    <div className="stat-value">{value}</div>
    {change && <div className="stat-change">{change}</div>}
    {status && <div className={`stat-status ${status}`}>{status}</div>}
  </div>
);

export default StatCard; 