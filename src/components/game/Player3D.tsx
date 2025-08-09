import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface Player3DProps {
  position: [number, number, number];
  rotation: [number, number, number];
  isBot?: boolean;
  health: number;
  isCurrentPlayer?: boolean;
}

export const Player3D: React.FC<Player3DProps> = ({ 
  position, 
  rotation, 
  isBot = false, 
  health,
  isCurrentPlayer = false 
}) => {
  const meshRef = useRef<Mesh>(null);
  const [x, y, z] = position;

  // Smooth animation for movement
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp({ x, y, z } as any, 0.1);
      meshRef.current.rotation.y = rotation[1];
    }
  });

  const playerColor = isCurrentPlayer ? '#8b5cf6' : isBot ? '#ef4444' : '#22c55e';
  const healthScale = Math.max(0.5, health / 100);

  return (
    <group>
      {/* Player body */}
      <mesh ref={meshRef} position={position} rotation={rotation}>
        {/* Head */}
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshLambertMaterial color={playerColor} />
        </mesh>
        
        {/* Body */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.6, 1.2, 0.3]} />
          <meshLambertMaterial color={playerColor} />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.4, 1.2, 0]}>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshLambertMaterial color={playerColor} />
        </mesh>
        <mesh position={[0.4, 1.2, 0]}>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshLambertMaterial color={playerColor} />
        </mesh>
        
        {/* Legs */}
        <mesh position={[-0.2, 0.4, 0]}>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshLambertMaterial color={playerColor} />
        </mesh>
        <mesh position={[0.2, 0.4, 0]}>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshLambertMaterial color={playerColor} />
        </mesh>

        {/* Weapon (simple representation) */}
        <mesh position={[0.5, 1.3, 0.2]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
      </mesh>

      {/* Health indicator */}
      {health < 100 && (
        <mesh position={[x, y + 2.5, z]}>
          <planeGeometry args={[1, 0.1]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.8} />
          <mesh position={[0, 0, 0.001]} scale={[healthScale, 1, 1]}>
            <planeGeometry args={[1, 0.1]} />
            <meshBasicMaterial color="#00ff00" transparent opacity={0.8} />
          </mesh>
        </mesh>
      )}

      {/* Player name tag */}
      {!isCurrentPlayer && (
        <mesh position={[x, y + 3, z]}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshBasicMaterial 
            color={isBot ? "#ef4444" : "#22c55e"} 
            transparent 
            opacity={0.7} 
          />
        </mesh>
      )}
    </group>
  );
};