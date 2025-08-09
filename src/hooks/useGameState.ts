import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, Position, LootItem, Weapon, Projectile, Vector3 } from '@/types/game';
import { toast } from '@/hooks/use-toast';
import { useBots } from './useBots';
import { useShooting } from './useShooting';

const INITIAL_STORM_RADIUS = 400;
const MAP_SIZE = 1000;

const initialWeapons: Weapon[] = [
  { id: '1', name: 'Assault Rifle', damage: 30, ammo: 30, maxAmmo: 30, rarity: 'rare', range: 200, fireRate: 5, projectileSpeed: 100 },
  { id: '2', name: 'Shotgun', damage: 80, ammo: 8, maxAmmo: 8, rarity: 'epic', range: 50, fireRate: 1, projectileSpeed: 80 },
  { id: '3', name: 'Sniper', damage: 120, ammo: 5, maxAmmo: 5, rarity: 'legendary', range: 400, fireRate: 0.5, projectileSpeed: 150 },
];

// Simple bot AI
const createBot = (id: string): Player => ({
  id: `bot-${id}`,
  position: { x: Math.random() * 800 + 100, y: 1, z: Math.random() * 800 + 100 },
  rotation: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
  health: 100,
  shield: Math.random() > 0.5 ? 50 : 0,
  isAlive: true,
  isBot: true,
  materials: { wood: 100, stone: 50, metal: 25 },
  inventory: { weapons: [initialWeapons[0]], activeWeapon: 0 }
});

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    myPlayerId: 'player-1',
    buildings: [],
    loot: [],
    projectiles: [],
    stormRadius: INITIAL_STORM_RADIUS,
    stormCenter: { x: MAP_SIZE / 2, y: 0, z: MAP_SIZE / 2 },
    gamePhase: 'lobby',
    playersAlive: 1
  });

  const initializeGame = useCallback(() => {
    const myPlayer: Player = {
      id: 'player-1',
      position: { x: MAP_SIZE / 2, y: 1, z: MAP_SIZE / 2 },
      rotation: { x: 0, y: 0, z: 0 },
      health: 100,
      shield: 50,
      isAlive: true,
      materials: { wood: 300, stone: 150, metal: 75 },
      inventory: { weapons: [initialWeapons[0]], activeWeapon: 0 }
    };

    const bots = [createBot('1'), createBot('2'), createBot('3'), createBot('4'), createBot('5')];
    
    const loot: LootItem[] = Array.from({ length: 30 }, (_, i) => ({
      id: `loot-${i}`,
      type: Math.random() > 0.7 ? 'weapon' : Math.random() > 0.5 ? 'material' : 'health',
      position: { x: Math.random() * 800 + 100, y: 0.5, z: Math.random() * 800 + 100 },
      item: initialWeapons[Math.floor(Math.random() * initialWeapons.length)]
    }));

    setGameState(prev => ({
      ...prev,
      players: [myPlayer, ...bots],
      loot,
      projectiles: [],
      gamePhase: 'playing',
      playersAlive: 1 + bots.length
    }));

    toast({ title: "Battle Begins!", description: "Survive and claim Victory Royale!" });
  }, []);

  const movePlayer = useCallback((direction: 'forward' | 'backward' | 'left' | 'right') => {
    setGameState(prev => {
      const player = prev.players.find(p => p.id === prev.myPlayerId);
      if (!player?.isAlive) return prev;

      const speed = 3;
      let newX = player.position.x;
      let newZ = player.position.z;

      switch (direction) {
        case 'forward': newZ -= speed; break;
        case 'backward': newZ += speed; break;
        case 'left': newX -= speed; break;
        case 'right': newX += speed; break;
      }

      newX = Math.max(10, Math.min(MAP_SIZE - 10, newX));
      newZ = Math.max(10, Math.min(MAP_SIZE - 10, newZ));

      return {
        ...prev,
        players: prev.players.map(p => 
          p.id === prev.myPlayerId ? { ...p, position: { x: newX, y: 1, z: newZ } } : p
        )
      };
    });
  }, []);

  const rotatePlayer = useCallback((deltaX: number, deltaY: number) => {
    // Simplified for now
  }, []);

  const buildStructure = useCallback((type: 'wall' | 'ramp' | 'floor', position: Position) => {
    // Simplified building
  }, []);

  const collectLoot = useCallback((lootId: string) => {
    // Simplified loot collection
  }, []);

  const shootWeapon = useCallback((direction: Vector3) => {
    // Simplified shooting
  }, []);

  const handleProjectileHit = useCallback((projectileId: string) => {
    setGameState(prev => ({
      ...prev,
      projectiles: prev.projectiles.filter(p => p.id !== projectileId)
    }));
  }, []);

  return {
    gameState,
    actions: {
      initializeGame,
      movePlayer,
      rotatePlayer,
      buildStructure,
      collectLoot,
      shootWeapon,
      handleProjectileHit
    }
  };
};
