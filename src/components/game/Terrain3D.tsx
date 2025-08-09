import React from 'react';
import { LootItem, Building } from '@/types/game';

interface Terrain3DProps {
  loot: LootItem[];
  buildings: Building[];
  stormRadius: number;
  stormCenter: { x: number; y: number; z: number };
  onLootCollect: (lootId: string) => void;
}

export const Terrain3D: React.FC<Terrain3DProps> = ({ 
  loot, 
  buildings, 
  stormRadius, 
  stormCenter,
  onLootCollect 
}) => {
  return (
    <group>
      {/* Ground */}
      <mesh position={[500, -1, 500]} receiveShadow>
        <boxGeometry args={[1000, 2, 1000]} />
        <meshLambertMaterial color="#1a5e1a" />
      </mesh>

      {/* Storm circle visualization */}
      <mesh position={[stormCenter.x, 0.1, stormCenter.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[stormRadius - 5, stormRadius, 32]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
      </mesh>

      {/* Buildings */}
      {buildings.map(building => (
        <mesh 
          key={building.id} 
          position={[building.position.x, building.position.y + 1, building.position.z]}
          rotation={[building.rotation.x, building.rotation.y, building.rotation.z]}
          castShadow
        >
          {building.type === 'wall' && (
            <>
              <boxGeometry args={[0.2, 3, 3]} />
              <meshLambertMaterial color="#8b4513" />
            </>
          )}
          {building.type === 'ramp' && (
            <>
              <boxGeometry args={[3, 0.2, 3]} />
              <meshLambertMaterial color="#8b4513" />
            </>
          )}
          {building.type === 'floor' && (
            <>
              <boxGeometry args={[3, 0.2, 3]} />
              <meshLambertMaterial color="#8b4513" />
            </>
          )}
        </mesh>
      ))}

      {/* Loot Items */}
      {loot.map(item => (
        <group key={item.id}>
          <mesh 
            position={[item.position.x, item.position.y + 0.5, item.position.z]}
            onClick={() => onLootCollect(item.id)}
            castShadow
          >
            {item.type === 'weapon' && (
              <>
                <boxGeometry args={[0.8, 0.2, 0.1]} />
                <meshBasicMaterial 
                  color={
                    item.item?.rarity === 'legendary' ? '#ffd700' :
                    item.item?.rarity === 'epic' ? '#9c27b0' :
                    item.item?.rarity === 'rare' ? '#8b5cf6' : '#ffffff'
                  }
                  emissive={
                    item.item?.rarity === 'legendary' ? '#ffd700' :
                    item.item?.rarity === 'epic' ? '#9c27b0' :
                    item.item?.rarity === 'rare' ? '#8b5cf6' : '#ffffff'
                  }
                  emissiveIntensity={0.3}
                />
              </>
            )}
            {item.type === 'material' && (
              <>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshBasicMaterial color="#8b4513" emissive="#8b4513" emissiveIntensity={0.2} />
              </>
            )}
            {item.type === 'health' && (
              <>
                <sphereGeometry args={[0.3, 8, 8]} />
                <meshBasicMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.3} />
              </>
            )}
          </mesh>
          
          {/* Glow effect */}
          <mesh position={[item.position.x, item.position.y + 0.5, item.position.z]}>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshBasicMaterial 
              color={
                item.type === 'weapon' ? '#8b5cf6' :
                item.type === 'material' ? '#8b4513' : '#00ff00'
              }
              transparent 
              opacity={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Trees and environment (simple) */}
      {Array.from({ length: 20 }, (_, i) => (
        <group key={`tree-${i}`}>
          <mesh position={[Math.random() * 900 + 50, 2, Math.random() * 900 + 50]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 4]} />
            <meshLambertMaterial color="#4a5d23" />
          </mesh>
          <mesh position={[Math.random() * 900 + 50, 5, Math.random() * 900 + 50]} castShadow>
            <sphereGeometry args={[2, 8, 8]} />
            <meshLambertMaterial color="#228b22" />
          </mesh>
        </group>
      ))}
    </group>
  );
};