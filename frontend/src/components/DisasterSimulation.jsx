import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DisasterSimulation({
    disasterType,
    intensity,
    isPlaying,
    currentTime,
    buildingRef
}) {
    const waterRef = useRef();
    const particlesRef = useRef();
    const debrisRef = useRef();

    // Earthquake effect
    useFrame(() => {
        if (!buildingRef?.current || !isPlaying) return;

        if (disasterType === 'earthquake') {
            const shake = Math.sin(currentTime * 10) * (intensity / 10) * 0.3;
            buildingRef.current.position.x = shake;
            buildingRef.current.rotation.z = Math.sin(currentTime * 8) * (intensity / 100);
        } else {
            // Reset position when not earthquake
            buildingRef.current.position.x = 0;
            buildingRef.current.rotation.z = 0;
        }
    });

    // Update water level for flood
    useFrame(() => {
        if (waterRef.current && disasterType === 'flood' && isPlaying) {
            const targetHeight = (intensity / 10) * 5;
            const currentHeight = waterRef.current.position.y;
            const riseSpeed = 0.02;

            if (currentHeight < targetHeight) {
                waterRef.current.position.y += riseSpeed;
            }
        } else if (waterRef.current && !isPlaying) {
            // Reset water when paused/reset
            if (currentTime < 0.1) {
                waterRef.current.position.y = -5;
            }
        }
    });

    // Animate fire particles
    useFrame(() => {
        if (particlesRef.current && disasterType === 'fire' && isPlaying) {
            const positions = particlesRef.current.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                // Move particles up
                positions[i + 1] += 0.05 * (intensity / 5);

                // Reset particles that go too high
                if (positions[i + 1] > 20) {
                    positions[i + 1] = 0;
                    positions[i] = (Math.random() - 0.5) * 10;
                    positions[i + 2] = (Math.random() - 0.5) * 10;
                }
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    // Hurricane wind effect
    useFrame(() => {
        if (debrisRef.current && disasterType === 'hurricane' && isPlaying) {
            debrisRef.current.rotation.y += 0.02 * (intensity / 5);

            const wobble = Math.sin(currentTime * 5) * (intensity / 10) * 0.5;
            if (buildingRef?.current) {
                buildingRef.current.rotation.x = wobble * 0.05;
            }
        } else if (buildingRef?.current) {
            buildingRef.current.rotation.x = 0;
        }
    });

    // Create fire particles
    const fireParticles = useMemo(() => {
        if (disasterType !== 'fire') return null;

        const particleCount = 200 * (intensity / 5);
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = Math.random() * 3;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            colors[i * 3] = 1; // R
            colors[i * 3 + 1] = Math.random() * 0.5; // G
            colors[i * 3 + 2] = 0; // B
        }

        return { positions, colors };
    }, [disasterType, intensity]);

    // Create hurricane debris
    const debrisParticles = useMemo(() => {
        if (disasterType !== 'hurricane') return null;

        const count = 50 * (intensity / 5);
        const positions = [];

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 15 + Math.random() * 10;
            positions.push({
                x: Math.cos(angle) * radius,
                y: Math.random() * 15,
                z: Math.sin(angle) * radius
            });
        }

        return positions;
    }, [disasterType, intensity]);

    return (
        <>
            {/* Flood water */}
            {disasterType === 'flood' && (
                <mesh ref={waterRef} position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial
                        color="#1e40af"
                        transparent
                        opacity={0.6}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </mesh>
            )}

            {/* Fire particles */}
            {disasterType === 'fire' && fireParticles && (
                <points ref={particlesRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={fireParticles.positions.length / 3}
                            array={fireParticles.positions}
                            itemSize={3}
                        />
                        <bufferAttribute
                            attach="attributes-color"
                            count={fireParticles.colors.length / 3}
                            array={fireParticles.colors}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={0.3}
                        vertexColors
                        transparent
                        opacity={0.8}
                        sizeAttenuation
                    />
                </points>
            )}

            {/* Hurricane debris */}
            {disasterType === 'hurricane' && debrisParticles && (
                <group ref={debrisRef}>
                    {debrisParticles.map((pos, i) => (
                        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
                            <boxGeometry args={[0.5, 0.5, 0.5]} />
                            <meshStandardMaterial color="#8b5cf6" />
                        </mesh>
                    ))}
                </group>
            )}

            {/* Ambient effects based on disaster */}
            {disasterType === 'fire' && (
                <pointLight position={[0, 5, 0]} color="#ff6b35" intensity={intensity / 2} distance={30} />
            )}
            {disasterType === 'earthquake' && (
                <pointLight position={[0, 0, 0]} color="#f59e0b" intensity={intensity / 5} />
            )}
        </>
    );
}
