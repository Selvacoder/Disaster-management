import { useState } from 'react';
import './DisasterSelector.css';

const DISASTERS = [
    {
        id: 'earthquake',
        name: 'Earthquake',
        icon: '🌍',
        color: '#f59e0b',
        description: 'Ground shaking and structural damage'
    },
    {
        id: 'flood',
        name: 'Flood',
        icon: '🌊',
        color: '#3b82f6',
        description: 'Rising water levels and inundation'
    },
    {
        id: 'fire',
        name: 'Fire',
        icon: '🔥',
        color: '#ef4444',
        description: 'Spreading flames and smoke'
    },
    {
        id: 'hurricane',
        name: 'Hurricane',
        icon: '🌀',
        color: '#8b5cf6',
        description: 'High winds and flying debris'
    }
];

export default function DisasterSelector({ selectedDisaster, onDisasterChange, intensity, onIntensityChange }) {
    return (
        <div className="disaster-selector">
            <h2>💥 Disaster Type</h2>

            <div className="disaster-grid">
                {DISASTERS.map((disaster) => (
                    <div
                        key={disaster.id}
                        className={`disaster-card ${selectedDisaster === disaster.id ? 'selected' : ''}`}
                        onClick={() => onDisasterChange(disaster.id)}
                        style={{
                            '--disaster-color': disaster.color
                        }}
                    >
                        <div className="disaster-icon">{disaster.icon}</div>
                        <div className="disaster-name">{disaster.name}</div>
                        <div className="disaster-desc">{disaster.description}</div>
                    </div>
                ))}
            </div>

            <div className="intensity-control">
                <div className="intensity-header">
                    <span>Intensity Level</span>
                    <span className="intensity-value">{intensity}/10</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => onIntensityChange(parseInt(e.target.value))}
                    className="intensity-slider"
                    style={{
                        '--intensity': intensity / 10
                    }}
                />
                <div className="intensity-labels">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Severe</span>
                    <span>Catastrophic</span>
                </div>
            </div>
        </div>
    );
}
