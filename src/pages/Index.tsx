import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameLobby } from '@/components/game/GameLobby';
import { GameMap } from '@/components/game/GameMap';
import { GameHUD } from '@/components/game/GameHUD';
import { GameOver } from '@/components/game/GameOver';

const Index = () => {
  const { gameState, actions } = useGameState();
  const [buildType, setBuildType] = useState<'wall' | 'ramp' | 'floor' | null>(null);

  const myPlayer = gameState.players.find(p => p.id === gameState.myPlayerId);

  const handleBuild = (type: 'wall' | 'ramp' | 'floor') => {
    setBuildType(type);
  };

  const handleBuildAt = (type: 'wall' | 'ramp' | 'floor', position: { x: number; y: number }) => {
    if (myPlayer && myPlayer.materials.wood >= 10) {
      actions.buildStructure(type, position);
    }
  };

  // Victory condition is now handled in the useGameState hook

  if (gameState.gamePhase === 'lobby') {
    return <GameLobby onStartGame={actions.initializeGame} />;
  }

  if (gameState.gamePhase === 'ended') {
    return (
      <GameOver 
        won={gameState.winner === gameState.myPlayerId}
        onRestart={() => window.location.reload()}
      />
    );
  }

  if (!myPlayer) {
    return <GameLobby onStartGame={actions.initializeGame} />;
  }

  return (
    <div className="relative">
      <GameMap
        player={myPlayer}
        loot={gameState.loot}
        buildings={gameState.buildings}
        stormRadius={gameState.stormRadius}
        stormCenter={gameState.stormCenter}
        onMove={actions.movePlayer}
        onCollectLoot={actions.collectLoot}
        onBuildAt={handleBuildAt}
      />
      
      <GameHUD
        player={myPlayer}
        playersAlive={gameState.playersAlive}
        stormRadius={gameState.stormRadius}
        onBuild={handleBuild}
      />
    </div>
  );
};

export default Index;
