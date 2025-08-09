import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, PointerLockControls } from '@react-three/drei';
import { Player3D } from './Player3D';
import { Terrain3D } from './Terrain3D';
import { Projectile3D } from './Projectile3D';
import { Player, Projectile, Position, Vector3 } from '@/types/game';
import * as THREE from 'three';

interface Game3DProps {
  players: Player[];
  myPlayerId: string;
  loot: any[];
  buildings: any[];
  projectiles: Projectile[];
  stormRadius: number;
  stormCenter: Position;
  onMove: (direction: 'forward' | 'backward' | 'left' | 'right') => void;
  onLookAround: (deltaX: number, deltaY: number) => void;
  onShoot: (direction: Vector3) => void;
  onCollectLoot: (lootId: string) => void;
  onProjectileHit: (projectileId: string) => void;
}

export const Game3D: React.FC<Game3DProps> = ({
  players,
  myPlayerId,
  loot,
  buildings,
  projectiles,
  stormRadius,
  stormCenter,
  onMove,
  onLookAround,
  onShoot,
  onCollectLoot,
  onProjectileHit
}) => {
  const controlsRef = useRef<any>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  const myPlayer = players.find(p => p.id === myPlayerId);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.code]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle mouse shooting
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && isLocked && myPlayer) { // Left click
        // Get camera direction for shooting
        if (controlsRef.current?.getObject) {
          const camera = controlsRef.current.getObject();
          const direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
          onShoot({ x: direction.x, y: direction.y, z: direction.z });
        }
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, [isLocked, myPlayer, onShoot]);

  // Process movement keys
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLocked) return;
      
      if (keys.KeyW || keys.ArrowUp) onMove('forward');
      if (keys.KeyS || keys.ArrowDown) onMove('backward');
      if (keys.KeyA || keys.ArrowLeft) onMove('left');
      if (keys.KeyD || keys.ArrowRight) onMove('right');
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [keys, isLocked, onMove]);

  if (!myPlayer) return null;

  return (
    <div className="w-full h-screen">
      {/* Instructions overlay */}
      {!isLocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 text-white">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Click to Enter Game</h2>
            <div className="space-y-2 text-sm">
              <div>WASD: Move</div>
              <div>Mouse: Look around</div>
              <div>Left Click: Shoot</div>
              <div>ESC: Exit pointer lock</div>
            </div>
          </div>
        </div>
      )}

      <Canvas
        shadows
        camera={{ 
          position: [myPlayer.position.x, myPlayer.position.y + 1.7, myPlayer.position.z],
          fov: 75
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[100, 100, 100]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Sky */}
        <Sky sunPosition={[100, 100, 100]} />

        {/* Controls */}
        <PointerLockControls 
          ref={controlsRef}
          onLock={() => setIsLocked(true)}
          onUnlock={() => setIsLocked(false)}
        />

        {/* Game World */}
        <Terrain3D
          loot={loot}
          buildings={buildings}
          stormRadius={stormRadius}
          stormCenter={stormCenter}
          onLootCollect={onCollectLoot}
        />

        {/* Players */}
        {players.map(player => (
          <Player3D
            key={player.id}
            position={[player.position.x, player.position.y, player.position.z]}
            rotation={[player.rotation.x, player.rotation.y, player.rotation.z]}
            isBot={player.isBot}
            health={player.health}
            isCurrentPlayer={player.id === myPlayerId}
          />
        ))}

        {/* Projectiles */}
        {projectiles.map(projectile => (
          <Projectile3D
            key={projectile.id}
            projectile={projectile}
            onHit={onProjectileHit}
          />
        ))}
      </Canvas>
    </div>
  );
};