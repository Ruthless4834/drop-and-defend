import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GameOverProps {
  won: boolean;
  onRestart: () => void;
}

export const GameOver = ({ won, onRestart }: GameOverProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className={`p-8 max-w-md w-full mx-4 text-center border-2 ${
        won 
          ? 'border-game-legendary bg-gradient-to-br from-card to-game-legendary/10' 
          : 'border-game-danger bg-gradient-to-br from-card to-game-danger/10'
      }`}>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className={`text-4xl font-bold ${
              won 
                ? 'text-game-legendary' 
                : 'text-game-danger'
            }`}>
              {won ? 'VICTORY ROYALE!' : 'ELIMINATED'}
            </h1>
            <p className="text-muted-foreground">
              {won 
                ? 'You survived the storm and claimed victory!' 
                : 'Better luck next time, legend!'
              }
            </p>
          </div>

          {won && (
            <div className="text-6xl animate-bounce">
              👑
            </div>
          )}

          <Button 
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-all duration-300"
            size="lg"
          >
            Play Again
          </Button>
        </div>
      </Card>
    </div>
  );
};