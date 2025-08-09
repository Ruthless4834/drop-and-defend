import { useState, useEffect, useCallback } from 'react';
import { Player, Position, LootItem, Building } from '@/types/game';

interface GameMapProps {
  player: Player;
  loot: LootItem[];
  buildings: Building[];
  stormRadius: number;
  stormCenter: Position;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onCollectLoot: (lootId: string) => void;
  onBuildAt: (type: 'wall' | 'ramp' | 'floor', position: Position) => void;
}

export const GameMap = ({ 
  player, 
  loot, 
  buildings, 
  stormRadius, 
  stormCenter, 
  onMove, 
  onCollectLoot,
  onBuildAt 
}: GameMapProps) => {
  const [selectedBuildType, setSelectedBuildType] = useState<'wall' | 'ramp' | 'floor' | null>(null);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': onMove('up'); break;
        case 's': case 'arrowdown': onMove('down'); break;
        case 'a': case 'arrowleft': onMove('left'); break;
        case 'd': case 'arrowright': onMove('right'); break;
        case '1': setSelectedBuildType('wall'); break;
        case '2': setSelectedBuildType('ramp'); break;
        case '3': setSelectedBuildType('floor'); break;
        case 'escape': setSelectedBuildType(null); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onMove]);

  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedBuildType) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 1000;
    
    onBuildAt(selectedBuildType, { x, y });
    setSelectedBuildType(null);
  }, [selectedBuildType, onBuildAt]);

  const isInStorm = (pos: Position) => {
    const distance = Math.sqrt(
      Math.pow(pos.x - stormCenter.x, 2) + Math.pow(pos.y - stormCenter.y, 2)
    );
    return distance > stormRadius;
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 overflow-hidden">
      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
        <div className="text-sm space-y-1">
          <div className="font-medium text-primary">Controls:</div>
          <div>WASD/Arrows: Move</div>
          <div>1/2/3: Select build tool</div>
          <div>Click: Build (when tool selected)</div>
          <div>Walk over items to collect</div>
        </div>
      </div>

      {/* Selected build type indicator */}
      {selectedBuildType && (
        <div className="absolute top-4 right-4 z-10 bg-primary/90 backdrop-blur-sm rounded-lg p-3 border border-primary-glow">
          <div className="text-sm font-medium">
            Building: {selectedBuildType.toUpperCase()}
          </div>
          <div className="text-xs text-primary-foreground/80">Click to place</div>
        </div>
      )}

      {/* Game Map */}
      <div 
        className="relative w-full h-full cursor-crosshair"
        onClick={handleMapClick}
        style={{ 
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
          `,
        }}
      >
        {/* Storm Circle */}
        <div 
          className="absolute border-4 border-game-danger rounded-full pointer-events-none z-20"
          style={{
            width: `${(stormRadius / 1000) * 100}%`,
            height: `${(stormRadius / 1000) * 100}%`,
            left: `${(stormCenter.x / 1000) * 100 - (stormRadius / 1000) * 50}%`,
            top: `${(stormCenter.y / 1000) * 100 - (stormRadius / 1000) * 50}%`,
            boxShadow: `inset 0 0 50px hsl(var(--danger))`,
          }}
        />

        {/* Buildings */}
        {buildings.map(building => (
          <div
            key={building.id}
            className={`absolute w-6 h-6 border-2 ${
              building.type === 'wall' ? 'bg-amber-600 border-amber-500' :
              building.type === 'ramp' ? 'bg-amber-600 border-amber-500 transform rotate-45' :
              'bg-amber-600 border-amber-500'
            }`}
            style={{
              left: `${(building.position.x / 1000) * 100}%`,
              top: `${(building.position.y / 1000) * 100}%`,
              transform: building.type === 'ramp' ? 'translate(-50%, -50%) rotate(45deg)' : 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Loot Items */}
        {loot.map(item => (
          <div
            key={item.id}
            className={`absolute w-4 h-4 rounded-full animate-pulse cursor-pointer ${
              item.type === 'weapon' ? 'bg-game-weapon-rare' :
              item.type === 'material' ? 'bg-amber-500' :
              'bg-game-health'
            }`}
            style={{
              left: `${(item.position.x / 1000) * 100}%`,
              top: `${(item.position.y / 1000) * 100}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 10px currentColor`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              const distance = Math.sqrt(
                Math.pow(item.position.x - player.position.x, 2) + 
                Math.pow(item.position.y - player.position.y, 2)
              );
              if (distance < 30) {
                onCollectLoot(item.id);
              }
            }}
          />
        ))}

        {/* Player */}
        <div
          className={`absolute w-8 h-8 rounded-full border-4 transition-all duration-150 ${
            isInStorm(player.position) 
              ? 'bg-game-danger border-game-danger animate-pulse' 
              : 'bg-primary border-primary-glow'
          }`}
          style={{
            left: `${(player.position.x / 1000) * 100}%`,
            top: `${(player.position.y / 1000) * 100}%`,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 20px currentColor`,
          }}
        />

        {/* Storm overlay outside safe zone */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${(stormCenter.x / 1000) * 100}% ${(stormCenter.y / 1000) * 100}%, 
              transparent ${(stormRadius / 1000) * 100}%, 
              hsl(var(--danger) / 0.3) ${(stormRadius / 1000) * 100 + 5}%)`
          }}
        />
      </div>
    </div>
  );
};