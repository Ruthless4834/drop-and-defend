import { Player } from '@/types/game';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface GameHUDProps {
  player: Player;
  playersAlive: number;
  stormRadius: number;
  onBuild: (type: 'wall' | 'ramp' | 'floor') => void;
}

export const GameHUD = ({ player, playersAlive, stormRadius, onBuild }: GameHUDProps) => {
  const healthPercentage = (player.health / 100) * 100;
  const shieldPercentage = (player.shield / 100) * 100;
  
  return (
    <div className="fixed inset-x-0 bottom-0 p-4 z-50">
      <Card className="mx-auto max-w-4xl bg-card/90 backdrop-blur-sm border-primary/20">
        <div className="p-4 flex items-center justify-between">
          {/* Health & Shield */}
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-game-health"></div>
                <span className="text-sm font-medium">{player.health}</span>
              </div>
              <Progress 
                value={healthPercentage} 
                className="w-24 h-2 [&>div]:bg-gradient-to-r [&>div]:from-game-health [&>div]:to-green-400"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-game-shield"></div>
                <span className="text-sm font-medium">{player.shield}</span>
              </div>
              <Progress 
                value={shieldPercentage} 
                className="w-24 h-2 [&>div]:bg-gradient-to-r [&>div]:from-game-shield [&>div]:to-blue-400"
              />
            </div>
          </div>

          {/* Building Materials */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-600 rounded"></div>
              <span className="text-sm font-medium">{player.materials.wood}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm font-medium">{player.materials.stone}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-zinc-300 rounded"></div>
              <span className="text-sm font-medium">{player.materials.metal}</span>
            </div>
          </div>

          {/* Building Controls */}
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onBuild('wall')}
              disabled={player.materials.wood < 10}
            >
              Wall
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onBuild('ramp')}
              disabled={player.materials.wood < 10}
            >
              Ramp
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onBuild('floor')}
              disabled={player.materials.wood < 10}
            >
              Floor
            </Button>
          </div>

          {/* Game Info */}
          <div className="text-right space-y-1">
            <div className="text-sm font-medium">
              Players: <span className="text-primary">{playersAlive}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Storm: {Math.round(stormRadius)}m
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};