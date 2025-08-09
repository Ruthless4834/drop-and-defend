import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, Position, LootItem, Building, Weapon } from '@/types/game';
import { toast } from '@/hooks/use-toast';

const INITIAL_STORM_RADIUS = 500;
const MAP_SIZE = 1000;

const initialWeapons: Weapon[] = [
  { id: '1', name: 'Assault Rifle', damage: 30, ammo: 30, maxAmmo: 30, rarity: 'rare', range: 200 },
  { id: '2', name: 'Shotgun', damage: 80, ammo: 8, maxAmmo: 8, rarity: 'epic', range: 50 },
  { id: '3', name: 'Sniper', damage: 120, ammo: 5, maxAmmo: 5, rarity: 'legendary', range: 400 },
];

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    myPlayerId: 'player-1',
    buildings: [],
    loot: [],
    stormRadius: INITIAL_STORM_RADIUS,
    stormCenter: { x: MAP_SIZE / 2, y: MAP_SIZE / 2 },
    gamePhase: 'lobby',
    playersAlive: 1
  });

  // Initialize game
  const initializeGame = useCallback(() => {
    const myPlayer: Player = {
      id: 'player-1',
      position: { x: MAP_SIZE / 2, y: MAP_SIZE / 2 },
      health: 100,
      shield: 50,
      isAlive: true,
      materials: { wood: 100, stone: 50, metal: 25 },
      inventory: {
        weapons: [initialWeapons[0]],
        activeWeapon: 0
      }
    };

    // Generate random loot across the map
    const loot: LootItem[] = [];
    for (let i = 0; i < 20; i++) {
      loot.push({
        id: `loot-${i}`,
        type: Math.random() > 0.7 ? 'weapon' : Math.random() > 0.5 ? 'material' : 'health',
        position: {
          x: Math.random() * MAP_SIZE,
          y: Math.random() * MAP_SIZE
        },
        item: Math.random() > 0.5 ? initialWeapons[1] : initialWeapons[2]
      });
    }

    setGameState(prev => ({
      ...prev,
      players: [myPlayer],
      loot,
      gamePhase: 'playing'
    }));

    toast({
      title: "Victory Royale Awaits!",
      description: "Survive the storm and be the last one standing!"
    });
  }, []);

  // Move player
  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prev => {
      const player = prev.players.find(p => p.id === prev.myPlayerId);
      if (!player || !player.isAlive) return prev;

      const speed = 10;
      let newX = player.position.x;
      let newY = player.position.y;

      switch (direction) {
        case 'up': newY -= speed; break;
        case 'down': newY += speed; break;
        case 'left': newX -= speed; break;
        case 'right': newX += speed; break;
      }

      // Keep player within map bounds
      newX = Math.max(0, Math.min(MAP_SIZE, newX));
      newY = Math.max(0, Math.min(MAP_SIZE, newY));

      return {
        ...prev,
        players: prev.players.map(p => 
          p.id === prev.myPlayerId 
            ? { ...p, position: { x: newX, y: newY } }
            : p
        )
      };
    });
  }, []);

  // Build structure
  const buildStructure = useCallback((type: 'wall' | 'ramp' | 'floor', position: Position) => {
    setGameState(prev => {
      const player = prev.players.find(p => p.id === prev.myPlayerId);
      if (!player || player.materials.wood < 10) return prev;

      const newBuilding: Building = {
        id: `building-${Date.now()}`,
        type,
        position,
        material: 'wood',
        health: 100
      };

      return {
        ...prev,
        buildings: [...prev.buildings, newBuilding],
        players: prev.players.map(p => 
          p.id === prev.myPlayerId 
            ? { ...p, materials: { ...p.materials, wood: p.materials.wood - 10 } }
            : p
        )
      };
    });
  }, []);

  // Collect loot
  const collectLoot = useCallback((lootId: string) => {
    setGameState(prev => {
      const loot = prev.loot.find(l => l.id === lootId);
      const player = prev.players.find(p => p.id === prev.myPlayerId);
      
      if (!loot || !player) return prev;

      let updatedPlayer = { ...player };
      
      if (loot.type === 'weapon') {
        updatedPlayer.inventory.weapons.push(loot.item);
        toast({
          title: "Weapon Acquired!",
          description: `Picked up ${loot.item.name}`
        });
      } else if (loot.type === 'material') {
        updatedPlayer.materials.wood += 50;
      } else if (loot.type === 'health') {
        updatedPlayer.health = Math.min(100, updatedPlayer.health + 25);
      }

      return {
        ...prev,
        loot: prev.loot.filter(l => l.id !== lootId),
        players: prev.players.map(p => p.id === prev.myPlayerId ? updatedPlayer : p)
      };
    });
  }, []);

  // Storm damage and victory check
  useEffect(() => {
    if (gameState.gamePhase !== 'playing') return;

    const interval = setInterval(() => {
      setGameState(prev => {
        // Shrink storm
        const newRadius = Math.max(50, prev.stormRadius - 2);
        
        // Check victory condition
        if (newRadius <= 60) {
          const player = prev.players.find(p => p.id === prev.myPlayerId);
          if (player?.isAlive) {
            toast({
              title: "Victory Royale!",
              description: "You survived the storm!"
            });
            return {
              ...prev,
              gamePhase: 'ended',
              winner: prev.myPlayerId,
              stormRadius: newRadius
            };
          }
        }
        
        // Check if player is in storm
        const player = prev.players.find(p => p.id === prev.myPlayerId);
        if (player) {
          const distanceFromCenter = Math.sqrt(
            Math.pow(player.position.x - prev.stormCenter.x, 2) + 
            Math.pow(player.position.y - prev.stormCenter.y, 2)
          );
          
          if (distanceFromCenter > newRadius) {
            const stormDamage = 5;
            const newHealth = Math.max(0, player.health - stormDamage);
            
            if (newHealth <= 0) {
              toast({
                title: "Eliminated!",
                description: "You were caught in the storm!",
                variant: "destructive"
              });
              return {
                ...prev,
                gamePhase: 'ended',
                stormRadius: newRadius,
                players: prev.players.map(p => 
                  p.id === prev.myPlayerId ? { ...p, health: 0, isAlive: false } : p
                )
              };
            }
            
            return {
              ...prev,
              stormRadius: newRadius,
              players: prev.players.map(p => 
                p.id === prev.myPlayerId ? { ...p, health: newHealth } : p
              )
            };
          }
        }
        
        return { ...prev, stormRadius: newRadius };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.gamePhase]);

  return {
    gameState,
    actions: {
      initializeGame,
      movePlayer,
      buildStructure,
      collectLoot
    }
  };
};
