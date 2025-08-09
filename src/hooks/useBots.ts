import { useState, useEffect, useCallback } from 'react';
import { Player, Position, Vector3 } from '@/types/game';

const BOT_COUNT = 5;
const BOT_SPEED = 0.8;
const BOT_DECISION_INTERVAL = 2000; // 2 seconds

export const useBots = (
  players: Player[],
  myPlayerId: string,
  stormCenter: Position,
  stormRadius: number,
  onBotMove: (botId: string, newPosition: Position) => void,
  onBotShoot: (botId: string, target: Position) => void
) => {
  const [botBehaviors, setBotBehaviors] = useState<Record<string, string>>({});

  // Initialize bots
  const initializeBots = useCallback(() => {
    const bots: Player[] = [];
    for (let i = 0; i < BOT_COUNT; i++) {
      const bot: Player = {
        id: `bot-${i}`,
        position: {
          x: Math.random() * 800 + 100,
          y: 1,
          z: Math.random() * 800 + 100,
        },
        rotation: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
        health: 100,
        shield: Math.random() > 0.5 ? 50 : 0,
        isAlive: true,
        isBot: true,
        materials: { wood: 100, stone: 50, metal: 25 },
        inventory: {
          weapons: [{
            id: `bot-weapon-${i}`,
            name: 'Bot Rifle',
            damage: 25,
            ammo: 30,
            maxAmmo: 30,
            rarity: 'rare',
            range: 150,
            fireRate: 2,
            projectileSpeed: 50
          }],
          activeWeapon: 0
        }
      };
      bots.push(bot);
    }
    return bots;
  }, []);

  // Bot AI logic
  useEffect(() => {
    const interval = setInterval(() => {
      const humanPlayer = players.find(p => p.id === myPlayerId && p.isAlive);
      const aliveBots = players.filter(p => p.isBot && p.isAlive);

      aliveBots.forEach(bot => {
        if (!humanPlayer) return;

        const distanceToPlayer = Math.sqrt(
          Math.pow(bot.position.x - humanPlayer.position.x, 2) +
          Math.pow(bot.position.z - humanPlayer.position.z, 2)
        );

        const distanceToStormCenter = Math.sqrt(
          Math.pow(bot.position.x - stormCenter.x, 2) +
          Math.pow(bot.position.z - stormCenter.z, 2)
        );

        // Priority 1: Escape storm if outside safe zone
        if (distanceToStormCenter > stormRadius - 50) {
          const directionToCenter = {
            x: (stormCenter.x - bot.position.x) / distanceToStormCenter,
            z: (stormCenter.z - bot.position.z) / distanceToStormCenter
          };
          
          onBotMove(bot.id, {
            x: bot.position.x + directionToCenter.x * BOT_SPEED * 5,
            y: bot.position.y,
            z: bot.position.z + directionToCenter.z * BOT_SPEED * 5
          });
          
          setBotBehaviors(prev => ({ ...prev, [bot.id]: 'escaping_storm' }));
        }
        // Priority 2: Attack player if in range
        else if (distanceToPlayer < 100 && Math.random() > 0.7) {
          onBotShoot(bot.id, humanPlayer.position);
          setBotBehaviors(prev => ({ ...prev, [bot.id]: 'attacking' }));
        }
        // Priority 3: Move towards player but keep distance
        else if (distanceToPlayer > 150) {
          const directionToPlayer = {
            x: (humanPlayer.position.x - bot.position.x) / distanceToPlayer,
            z: (humanPlayer.position.z - bot.position.z) / distanceToPlayer
          };
          
          onBotMove(bot.id, {
            x: bot.position.x + directionToPlayer.x * BOT_SPEED * 2,
            y: bot.position.y,
            z: bot.position.z + directionToPlayer.z * BOT_SPEED * 2
          });
          
          setBotBehaviors(prev => ({ ...prev, [bot.id]: 'hunting' }));
        }
        // Priority 4: Random movement to avoid being predictable
        else if (Math.random() > 0.8) {
          const randomDirection = Math.random() * Math.PI * 2;
          onBotMove(bot.id, {
            x: bot.position.x + Math.cos(randomDirection) * BOT_SPEED,
            y: bot.position.y,
            z: bot.position.z + Math.sin(randomDirection) * BOT_SPEED
          });
          
          setBotBehaviors(prev => ({ ...prev, [bot.id]: 'wandering' }));
        }
      });
    }, BOT_DECISION_INTERVAL);

    return () => clearInterval(interval);
  }, [players, myPlayerId, stormCenter, stormRadius, onBotMove, onBotShoot]);

  return {
    initializeBots,
    botBehaviors
  };
};
