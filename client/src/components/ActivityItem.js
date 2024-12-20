import React from 'react';

const ActivityItem = ({ data }) => (
  <div className="activity-item">
    <div className="activity-icon">{data.icon}</div>
    <div className="activity-content">
      <div className="activity-title">{data.title}</div>
      <div className="activity-time">{data.time}</div>
    </div>
  </div>
);

export default ActivityItem; 