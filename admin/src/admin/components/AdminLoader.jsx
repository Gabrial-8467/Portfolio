import React from 'react';
import { Zap } from 'lucide-react';

export default function AdminLoader({
  message = 'Loading workspace…',
  subtext = 'Fetching real-time data from CMS API',
  fullscreen = false,
  compact = false,
}) {
  if (compact) {
    return (
      <div className="admin-loader-compact">
        <div className="admin-spinner-ring sm" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className={`admin-loader-container ${fullscreen ? 'fullscreen' : ''}`}>
      <div className="admin-loader-card">
        {/* Orbital Pulsing Rings with Center Icon */}
        <div className="admin-loader-orbit">
          <div className="orbit-ring-outer" />
          <div className="orbit-ring-inner" />
          <div className="orbit-center-core">
            <Zap size={18} className="orbit-icon" />
          </div>
        </div>

        {/* Text and Shimmer Indicator */}
        <div className="admin-loader-meta">
          <h3 className="admin-loader-title">{message}</h3>
          {subtext && <p className="admin-loader-subtext">{subtext}</p>}
        </div>

        {/* Shimmer Progress Track */}
        <div className="admin-loader-progress-track">
          <div className="admin-loader-progress-bar" />
        </div>
      </div>
    </div>
  );
}
