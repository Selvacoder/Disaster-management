import { useState, useEffect, useRef } from "react";
import Viewer from "./components/Viewer";
import UploadPanel from "./components/UploadPanel";
import TimelineControls from "./components/TimelineControls";
import DisasterSelector from "./components/DisasterSelector";
import "./App.css";

export default function App() {
  // State management
  const [buildingData, setBuildingData] = useState(null);
  const [disasterType, setDisasterType] = useState('earthquake');
  const [intensity, setIntensity] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const animationRef = useRef(null);

  const DURATION = 30; // 30 seconds

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const startTime = performance.now();
      const initialTime = currentTime;

      const animate = (timestamp) => {
        const elapsed = (timestamp - startTime) / 1000; // Convert to seconds
        const newTime = initialTime + elapsed * speed;

        if (newTime >= DURATION) {
          setCurrentTime(DURATION);
          setIsPlaying(false);
        } else {
          setCurrentTime(newTime);
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, speed, currentTime]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
  };

  const handleUploadSuccess = (building) => {
    setBuildingData(building);
    console.log("Building generated:", building);
  };

  return (
    <div className="app-container">
      {/* Sidebar with controls */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>🏗️ Disaster Simulator</h1>
          <p className="tagline">Visualize and analyze disaster scenarios</p>
        </div>

        <div className="controls-container">
          <UploadPanel onUploadSuccess={handleUploadSuccess} />
          <DisasterSelector
            selectedDisaster={disasterType}
            onDisasterChange={setDisasterType}
            intensity={intensity}
            onIntensityChange={setIntensity}
          />
          <TimelineControls
            duration={DURATION}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            currentTime={currentTime}
            onSeek={handleSeek}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </div>

        <div className="info-panel">
          <h3>ℹ️ Quick Guide</h3>
          <ul>
            <li>Upload a blueprint or use default building</li>
            <li>Select disaster type and intensity</li>
            <li>Press Play to start simulation</li>
            <li>Use timeline to scrub through animation</li>
          </ul>
        </div>
      </aside>

      {/* Main 3D viewport */}
      <main className="viewport">
        <Viewer
          buildingData={buildingData}
          disasterType={disasterType}
          intensity={intensity}
          isPlaying={isPlaying}
          currentTime={currentTime}
        />

        <div className="viewport-overlay">
          <div className="status-badge">
            {disasterType.toUpperCase()} - Level {intensity}
          </div>
        </div>
      </main>
    </div>
  );
}
