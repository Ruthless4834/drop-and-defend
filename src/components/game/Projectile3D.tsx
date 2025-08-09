import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { Projectile } from '@/types/game';

interface Projectile3DProps {
  projectile: Projectile;
  onHit: (projectileId: string) => void;
}

export const Projectile3D: React.FC<Projectile3DProps> = ({ projectile, onHit }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Move projectile
      meshRef.current.position.x += projectile.direction.x * projectile.speed * delta;
      meshRef.current.position.y += projectile.direction.y * projectile.speed * delta;
      meshRef.current.position.z += projectile.direction.z * projectile.speed * delta;

      // Check if projectile is out of bounds or hit something
      const pos = meshRef.current.position;
      if (pos.x < 0 || pos.x > 1000 || pos.z < 0 || pos.z > 1000 || pos.y < 0 || pos.y > 100) {
        onHit(projectile.id);
      }
    }
  });

  const bulletColor = projectile.weapon.rarity === 'legendary' ? '#ffd700' : 
                     projectile.weapon.rarity === 'epic' ? '#9c27b0' :
                     projectile.weapon.rarity === 'rare' ? '#8b5cf6' : '#ffffff';

  return (
    <mesh ref={meshRef} position={[projectile.position.x, projectile.position.y, projectile.position.z]}>
      <sphereGeometry args={[0.1, 4, 4]} />
      <meshBasicMaterial color={bulletColor} emissive={bulletColor} emissiveIntensity={0.5} />
    </mesh>
  );
};