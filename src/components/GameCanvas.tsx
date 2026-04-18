import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import { GAME_LEVELS } from '../game/LevelManager';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  const [gameState, setGameState] = useState<'playing' | 'dead' | 'won' | 'completed'>('playing');
  const [levelIndex, setLevelIndex] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    
    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const engine = new GameEngine(canvas);
    engineRef.current = engine;

    engine.loadLevel(GAME_LEVELS[levelIndex]);

    engine.onDie = () => setGameState('dead');
    engine.onWin = () => setGameState('won');

    engine.start();

    return () => {
      engine.stop();
      window.removeEventListener('resize', resize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When levelIndex changes, load the new level!
  useEffect(() => {
    if (engineRef.current && gameState === 'playing') {
      engineRef.current.loadLevel(GAME_LEVELS[levelIndex]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelIndex]);

  const handleRestart = (nextContext: boolean) => {
    if (engineRef.current) {
      if (nextContext) {
        if (levelIndex < GAME_LEVELS.length - 1) {
          const nextIdx = levelIndex + 1;
          setLevelIndex(nextIdx);
          setGameState('playing');
        } else {
          setGameState('completed');
          engineRef.current.stop();
        }
      } else {
        // Reboot same level
        setGameState('playing');
        engineRef.current.loadLevel(GAME_LEVELS[levelIndex]);
      }
    }
  };

  return (
    <>
      <canvas 
        ref={canvasRef} 
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      
      {gameState === 'dead' && (
        <div className="screen-container glass-panel" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <h1 className="mario-title" style={{ color: '#ff3333' }}>GAME OVER</h1>
          <button className="mario-button" style={{ marginTop: '2rem' }} onClick={() => handleRestart(false)}>TRY AGAIN</button>
        </div>
      )}

      {gameState === 'won' && (
        <div className="screen-container glass-panel" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <h1 className="mario-title" style={{ color: '#ffcc00' }}>LEVEL CLEAR!</h1>
          <button className="mario-button" style={{ marginTop: '2rem' }} onClick={() => handleRestart(true)}>NEXT LEVEL</button>
        </div>
      )}

      {gameState === 'completed' && (
        <div className="screen-container glass-panel" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <h1 className="mario-title" style={{ color: '#ffcc00' }}>YOU BEAT THE GAME!</h1>
          <p style={{ color: '#fff', fontSize: '1.2rem', marginTop: '1rem', textShadow: '2px 2px 0 #000', fontWeight: 'bold' }}>Thank you for playing!</p>
          <button className="mario-button" style={{ marginTop: '2rem' }} onClick={() => { window.location.reload(); }}>PLAY AGAIN</button>
        </div>
      )}
    </>
  );
};
