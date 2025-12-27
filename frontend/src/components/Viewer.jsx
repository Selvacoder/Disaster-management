import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import BuildingGenerator from "./BuildingGenerator";
import DisasterSimulation from "./DisasterSimulation";

export default function Viewer({
  buildingData,
  disasterType,
  intensity,
  isPlaying,
  currentTime
}) {
  const buildingRef = useRef();

  return (
    <Canvas
      style={{ height: "100%", background: "#0a0a0a" }}
      camera={{ position: [20, 15, 20], fov: 60 }}
      shadows
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={10}
        maxDistance={100}
      />

      {/* Building */}
      <group ref={buildingRef}>
        <BuildingGenerator buildingData={buildingData} />
      </group>

      {/* Disaster effects */}
      <DisasterSimulation
        disasterType={disasterType}
        intensity={intensity}
        isPlaying={isPlaying}
        currentTime={currentTime}
        buildingRef={buildingRef}
      />
    </Canvas>
  );
}

