import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import { LevelManager } from '../game/LevelManager';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'dead' | 'won'>('playing');

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

    const levelManager = new LevelManager();
    engine.loadLevel(levelManager.getCurrentLevel());

    engine.onDie = () => setGameState('dead');
    engine.onWin = () => setGameState('won');

    engine.start();

    return () => {
      engine.stop();
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleRestart = () => {
    if (engineRef.current) {
      setGameState('playing');
      const levelManager = new LevelManager();
      engineRef.current.loadLevel(levelManager.getCurrentLevel());
    }
  };

  return (
    <>
      <canvas 
        ref={canvasRef} 
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      
      {gameState === 'dead' && (
        <div className="screen-container glass-panel" style={{ background: 'rgba(255, 0, 0, 0.1)' }}>
          <h1 className="neon-title" style={{ color: '#ff00ea', textShadow: '0 0 20px #ff00ea' }}>SYSTEM FAILURE</h1>
          <button className="neon-button" style={{ marginTop: '2rem' }} onClick={handleRestart}>REBOOT</button>
        </div>
      )}

      {gameState === 'won' && (
        <div className="screen-container glass-panel" style={{ background: 'rgba(0, 255, 102, 0.1)' }}>
          <h1 className="neon-title" style={{ color: '#00ff66', textShadow: '0 0 20px #00ff66' }}>ACCESS GRANTED</h1>
          <button className="neon-button" style={{ marginTop: '2rem', borderColor: '#00ff66', color: '#00ff66' }} onClick={handleRestart}>NEXT LEVEL</button>
        </div>
      )}
    </>
  );
};
