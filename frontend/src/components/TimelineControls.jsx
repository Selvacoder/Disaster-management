import { useState, useEffect } from 'react';
import './TimelineControls.css';

export default function TimelineControls({
    duration = 30,
    isPlaying,
    onPlayPause,
    onReset,
    currentTime,
    onSeek,
    speed,
    onSpeedChange
}) {
    const [localTime, setLocalTime] = useState(0);

    useEffect(() => {
        setLocalTime(currentTime);
    }, [currentTime]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                onPlayPause();
            } else if (e.code === 'KeyR') {
                onReset();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onPlayPause, onReset]);

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        setLocalTime(newTime);
        onSeek(newTime);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const speedOptions = [0.5, 1, 2, 4];

    return (
        <div className="timeline-controls">
            <div className="controls-header">
                <h3>🎬 Animation Timeline</h3>
                <div className="time-display">
                    {formatTime(localTime)} / {formatTime(duration)}
                </div>
            </div>

            <div className="timeline-scrubber">
                <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={localTime}
                    onChange={handleSeek}
                    className="timeline-slider"
                />
                <div
                    className="timeline-progress"
                    style={{ width: `${(localTime / duration) * 100}%` }}
                />
            </div>

            <div className="control-buttons">
                <button
                    className="control-btn play-pause"
                    onClick={onPlayPause}
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                    {isPlaying ? '⏸️' : '▶️'}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                    className="control-btn reset"
                    onClick={onReset}
                    title="Reset (R)"
                >
                    🔄
                    <span>Reset</span>
                </button>

                <div className="speed-controls">
                    <span className="speed-label">Speed:</span>
                    {speedOptions.map((s) => (
                        <button
                            key={s}
                            className={`speed-btn ${speed === s ? 'active' : ''}`}
                            onClick={() => onSpeedChange(s)}
                        >
                            {s}x
                        </button>
                    ))}
                </div>
            </div>

            <div className="keyboard-hints">
                <span>💡 Space: Play/Pause</span>
                <span>R: Reset</span>
            </div>
        </div>
    );
}
