import { useState, useCallback } from 'react';
import { Projectile, Position, Vector3, Weapon } from '@/types/game';

export const useShooting = (
  onProjectileCreate: (projectile: Projectile) => void,
  onDamagePlayer: (playerId: string, damage: number, shooterId: string) => void
) => {
  const [lastShotTime, setLastShotTime] = useState(0);

  const shoot = useCallback((
    playerId: string,
    position: Position,
    direction: Vector3,
    weapon: Weapon
  ) => {
    const now = Date.now();
    const timeSinceLastShot = now - lastShotTime;
    const shotCooldown = 1000 / weapon.fireRate;

    if (timeSinceLastShot < shotCooldown) return false;

    if (weapon.ammo <= 0) return false;

    // Create projectile
    const projectile: Projectile = {
      id: `projectile-${now}-${Math.random()}`,
      position: { ...position, y: position.y + 1.5 }, // Shoot from chest height
      direction: { ...direction },
      speed: weapon.projectileSpeed,
      damage: weapon.damage,
      playerId,
      weapon
    };

    onProjectileCreate(projectile);
    setLastShotTime(now);
    return true;
  }, [lastShotTime, onProjectileCreate]);

  const calculateDirection = useCallback((from: Position, to: Position): Vector3 => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    return {
      x: dx / length,
      y: dy / length,
      z: dz / length
    };
  }, []);

  const checkHit = useCallback((
    projectile: Projectile,
    target: Position,
    targetRadius: number = 1
  ): boolean => {
    const distance = Math.sqrt(
      Math.pow(projectile.position.x - target.x, 2) +
      Math.pow(projectile.position.y - target.y, 2) +
      Math.pow(projectile.position.z - target.z, 2)
    );
    
    return distance <= targetRadius;
  }, []);

  return {
    shoot,
    calculateDirection,
    checkHit
  };
};