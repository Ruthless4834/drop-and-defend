export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  position: Position;
  health: number;
  shield: number;
  isAlive: boolean;
  materials: {
    wood: number;
    stone: number;
    metal: number;
  };
  inventory: {
    weapons: Weapon[];
    activeWeapon: number;
  };
}

export interface Weapon {
  id: string;
  name: string;
  damage: number;
  ammo: number;
  maxAmmo: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  range: number;
}

export interface LootItem {
  id: string;
  type: 'weapon' | 'material' | 'health' | 'shield';
  position: Position;
  item: any;
}

export interface Building {
  id: string;
  type: 'wall' | 'ramp' | 'floor';
  position: Position;
  material: 'wood' | 'stone' | 'metal';
  health: number;
}

export interface GameState {
  players: Player[];
  myPlayerId: string;
  buildings: Building[];
  loot: LootItem[];
  stormRadius: number;
  stormCenter: Position;
  gamePhase: 'lobby' | 'dropping' | 'playing' | 'ended';
  winner?: string;
  playersAlive: number;
}