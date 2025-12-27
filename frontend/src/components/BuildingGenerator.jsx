import { useRef, useMemo } from 'react';
import * as THREE from 'three';

export default function BuildingGenerator({ buildingData }) {
    const groupRef = useRef();

    // Generate building geometry based on data
    const buildingMesh = useMemo(() => {
        if (!buildingData) return null;

        const { dimensions, floors, type } = buildingData;
        const { width, height, depth } = dimensions;

        return (
            <group ref={groupRef}>
                {/* Main building structure */}
                <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[width, height, depth]} />
                    <meshStandardMaterial
                        color={type === 'high-rise' ? '#4a5568' : '#8b7355'}
                        roughness={0.8}
                        metalness={0.2}
                    />
                </mesh>

                {/* Floor divisions */}
                {Array.from({ length: floors || 3 }).map((_, i) => {
                    const floorHeight = height / floors;
                    const y = (i + 1) * floorHeight;

                    return (
                        <mesh key={`floor-${i}`} position={[0, y, depth / 2 + 0.05]}>
                            <boxGeometry args={[width, 0.1, 0.1]} />
                            <meshStandardMaterial color="#2d3748" />
                        </mesh>
                    );
                })}

                {/* Windows */}
                {Array.from({ length: floors || 3 }).map((_, floor) => {
                    const windowsPerFloor = Math.floor(width / 2);
                    const floorHeight = height / floors;
                    const floorY = floor * floorHeight + floorHeight / 2;

                    return Array.from({ length: windowsPerFloor }).map((_, i) => {
                        const x = -width / 2 + (i + 1) * (width / (windowsPerFloor + 1));

                        return (
                            <mesh
                                key={`window-${floor}-${i}`}
                                position={[x, floorY, depth / 2 + 0.01]}
                            >
                                <boxGeometry args={[0.8, 1.2, 0.05]} />
                                <meshStandardMaterial
                                    color="#87ceeb"
                                    transparent
                                    opacity={0.6}
                                    emissive="#4fc3f7"
                                    emissiveIntensity={0.2}
                                />
                            </mesh>
                        );
                    });
                })}

                {/* Roof */}
                <mesh position={[0, height + 0.2, 0]} receiveShadow>
                    <boxGeometry args={[width + 0.5, 0.4, depth + 0.5]} />
                    <meshStandardMaterial
                        color={type === 'warehouse' ? '#718096' : '#5a4a3a'}
                        roughness={0.9}
                    />
                </mesh>

                {/* Foundation/Base */}
                <mesh position={[0, -0.3, 0]} receiveShadow>
                    <boxGeometry args={[width + 1, 0.6, depth + 1]} />
                    <meshStandardMaterial color="#2d3748" roughness={1} />
                </mesh>

                {/* Ground plane */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial color="#1a202c" roughness={1} />
                </mesh>
            </group>
        );
    }, [buildingData]);

    if (!buildingData) {
        // Default placeholder building
        return (
            <group>
                <mesh position={[0, 5, 0]} castShadow>
                    <boxGeometry args={[10, 10, 10]} />
                    <meshStandardMaterial color="#4a5568" />
                </mesh>
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[50, 50]} />
                    <meshStandardMaterial color="#1a202c" />
                </mesh>
            </group>
        );
    }

    return buildingMesh;
}
