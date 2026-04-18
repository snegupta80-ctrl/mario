import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import { LevelManager } from '../game/LevelManager';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const levelManagerRef = useRef<LevelManager>(new LevelManager());
  const [gameState, setGameState] = useState<'playing' | 'dead' | 'won' | 'completed'>('playing');

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

    engine.loadLevel(levelManagerRef.current.getCurrentLevel());

    engine.onDie = () => setGameState('dead');
    engine.onWin = () => setGameState('won');

    engine.start();

    return () => {
      engine.stop();
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleRestart = (nextContext: boolean) => {
    if (engineRef.current) {
      if (nextContext) {
        const hasNext = levelManagerRef.current.nextLevel();
        if (!hasNext) {
          setGameState('completed');
          engineRef.current.stop();
          return;
        }
      }
      setGameState('playing');
      engineRef.current.loadLevel(levelManagerRef.current.getCurrentLevel());
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
          <button className="neon-button" style={{ marginTop: '2rem' }} onClick={() => handleRestart(false)}>REBOOT</button>
        </div>
      )}

      {gameState === 'won' && (
        <div className="screen-container glass-panel" style={{ background: 'rgba(0, 255, 102, 0.1)' }}>
          <h1 className="neon-title" style={{ color: '#00ff66', textShadow: '0 0 20px #00ff66' }}>ACCESS GRANTED</h1>
          <button className="neon-button" style={{ marginTop: '2rem', borderColor: '#00ff66', color: '#00ff66' }} onClick={() => handleRestart(true)}>NEXT LEVEL</button>
        </div>
      )}

      {gameState === 'completed' && (
        <div className="screen-container glass-panel" style={{ background: 'rgba(0, 255, 255, 0.1)' }}>
          <h1 className="neon-title" style={{ color: '#00f3ff', textShadow: '0 0 20px #00f3ff' }}>SYSTEM CONQUERED</h1>
          <p style={{ color: '#fff', fontSize: '1.2rem', marginTop: '1rem' }}>You have completed all levels!</p>
          <button className="neon-button" style={{ marginTop: '2rem', borderColor: '#00f3ff', color: '#00f3ff' }} onClick={() => { window.location.reload(); }}>PLAY AGAIN</button>
        </div>
      )}
    </>
  );
};
