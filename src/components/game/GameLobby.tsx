import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GameLobbyProps {
  onStartGame: () => void;
}

export const GameLobby = ({ onStartGame }: GameLobbyProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-secondary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="relative z-10 p-8 max-w-md w-full mx-4 bg-card/90 backdrop-blur-sm border-primary/20">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              DROP & DEFEND
            </h1>
            <p className="text-muted-foreground">
              Battle Royale MVP Demo
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-left space-y-2 text-sm">
              <div className="font-medium text-primary">Game Features:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Shrinking storm zone</li>
                <li>• Loot collection system</li>
                <li>• Building mechanics</li>
                <li>• Health & shield system</li>
                <li>• Survival gameplay</li>
              </ul>
            </div>

            <div className="text-left space-y-2 text-sm">
              <div className="font-medium text-primary">Controls:</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• WASD/Arrow keys: Move</li>
                <li>• 1/2/3: Select build tool</li>
                <li>• Click: Place building</li>
                <li>• Walk over loot to collect</li>
              </ul>
            </div>

            <Button 
              onClick={onStartGame}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
              size="lg"
            >
              Drop Into Battle
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};