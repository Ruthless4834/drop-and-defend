export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Player {
  id: string;
  position: Position;
  rotation: Vector3;
  health: number;
  shield: number;
  isAlive: boolean;
  isBot?: boolean;
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
  fireRate: number;
  projectileSpeed: number;
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
  rotation: Vector3;
  material: 'wood' | 'stone' | 'metal';
  health: number;
}

export interface Projectile {
  id: string;
  position: Position;
  direction: Vector3;
  speed: number;
  damage: number;
  playerId: string;
  weapon: Weapon;
}

export interface GameState {
  players: Player[];
  myPlayerId: string;
  buildings: Building[];
  loot: LootItem[];
  projectiles: Projectile[];
  stormRadius: number;
  stormCenter: Position;
  gamePhase: 'lobby' | 'dropping' | 'playing' | 'ended';
  winner?: string;
  playersAlive: number;
}