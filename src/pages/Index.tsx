import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameLobby } from '@/components/game/GameLobby';
import { Game3D } from '@/components/game/Game3D';
import { GameHUD } from '@/components/game/GameHUD';
import { GameOver } from '@/components/game/GameOver';

const Index = () => {
  const { gameState, actions } = useGameState();

  const myPlayer = gameState.players.find(p => p.id === gameState.myPlayerId);

  const handleBuildAt = (type: 'wall' | 'ramp' | 'floor', position: { x: number; y: number; z: number }) => {
    if (myPlayer && myPlayer.materials.wood >= 10) {
      actions.buildStructure(type, position);
    }
  };

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
    <div className="relative h-screen">
      <Game3D
        players={gameState.players}
        myPlayerId={gameState.myPlayerId}
        loot={gameState.loot}
        buildings={gameState.buildings}
        projectiles={gameState.projectiles}
        stormRadius={gameState.stormRadius}
        stormCenter={gameState.stormCenter}
        onMove={actions.movePlayer}
        onLookAround={actions.rotatePlayer}
        onShoot={actions.shootWeapon}
        onCollectLoot={actions.collectLoot}
        onProjectileHit={actions.handleProjectileHit}
      />
      
      <GameHUD
        player={myPlayer}
        playersAlive={gameState.playersAlive}
        stormRadius={gameState.stormRadius}
        onBuild={(type) => {
          // Build at player's position
          handleBuildAt(type, {
            x: myPlayer.position.x + Math.sin(myPlayer.rotation.y) * 3,
            y: myPlayer.position.y,
            z: myPlayer.position.z + Math.cos(myPlayer.rotation.y) * 3
          });
        }}
      />
    </div>
  );
};

export default Index;
