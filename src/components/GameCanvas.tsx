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
  }, []);

  const handleRestart = (nextContext: boolean) => {
    if (engineRef.current) {
      if (nextContext) {
        if (levelIndex < GAME_LEVELS.length - 1) {
          const nextIdx = levelIndex + 1;
          setLevelIndex(nextIdx);
          setGameState('playing');
          // Synchronously load level to bypass any React batching delays
          engineRef.current.loadLevel(GAME_LEVELS[nextIdx]);
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
      
      {gameState === 'playing' && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.6)',
          padding: '15px',
          borderRadius: '8px',
          color: '#fff',
          fontFamily: "'Outfit', sans-serif",
          boxShadow: '4px 4px 0 rgba(0,0,0,0.8)',
          border: '3px solid #000',
          pointerEvents: 'none'
        }}>
          <h3 style={{ marginBottom: '10px', color: '#FDD835', textShadow: '2px 2px 0 #000', textTransform: 'uppercase', letterSpacing: '1px' }}>CONTROLS</h3>
          <p style={{ marginBottom: '5px', textShadow: '1px 1px 0 #000' }}><strong>A / D</strong> : Move</p>
          <p style={{ marginBottom: '5px', textShadow: '1px 1px 0 #000' }}><strong>W / Up</strong> : Jump</p>
          <p style={{ marginBottom: '5px', textShadow: '1px 1px 0 #000' }}><strong>Space</strong> : Flip Gravity</p>
          <p style={{ marginTop: '10px', color: '#43B047', fontWeight: 800, textShadow: '1px 1px 0 #000' }}><strong>TAB + J</strong> : Long Jump</p>
        </div>
      )}
      
      {gameState === 'dead' && (
        <div className="screen-container glass-panel" style={{ background: 'rgba(229, 37, 33, 0.4)' }}>
          <h1 className="mario-title">GAME OVER</h1>
          <button className="mario-button" style={{ marginTop: '2rem' }} onClick={() => handleRestart(false)}>REBOOT</button>
        </div>
      )}

      {gameState === 'won' && (
        <div className="screen-container glass-panel" style={{ background: 'rgba(67, 176, 71, 0.4)' }}>
          <h1 className="mario-title">LEVEL CLEARED</h1>
          <button className="mario-button" style={{ marginTop: '2rem', background: 'var(--mario-green)' }} onClick={() => handleRestart(true)}>NEXT LEVEL</button>
        </div>
      )}

      {gameState === 'completed' && (
        <div className="screen-container glass-panel" style={{ background: 'rgba(253, 216, 53, 0.4)' }}>
          <h1 className="mario-title">SYSTEM CONQUERED</h1>
          <p style={{ color: '#000', fontSize: '2rem', fontWeight: 800, marginTop: '1rem', textTransform: 'uppercase' }}>You have completed all levels!</p>
          <button className="mario-button" style={{ marginTop: '2rem', background: 'var(--mario-gold)', color: '#000' }} onClick={() => { window.location.reload(); }}>PLAY AGAIN</button>
        </div>
      )}
    </>
  );
};
