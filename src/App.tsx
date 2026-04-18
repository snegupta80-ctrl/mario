import { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';

function App() {
  const [appState, setAppState] = useState<'menu' | 'playing' | 'editor'>('menu');

  return (
    <>
      <div className="hud">
        {appState === 'playing' && (
          <>
            <div className="hud-element">NEON REVERSER</div>
            <div className="hud-element" style={{ color: '#00f3ff', textShadow: '0 0 10px #00f3ff' }}>
              PRESS SPACE TO SWITCH GRAVITY
            </div>
            <button 
              className="neon-button" 
              style={{ padding: '4px 16px', fontSize: '1rem' }}
              onClick={() => setAppState('menu')}
            >
              QUIT
            </button>
          </>
        )}
      </div>

      {appState === 'menu' && (
        <div className="screen-container">
          <h1 className="neon-title" style={{ marginBottom: '4rem' }}>NEON REVERSER</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <button className="neon-button" onClick={() => setAppState('playing')}>
              START GAME
            </button>
            <button className="neon-button" style={{ borderColor: '#00ff66', color: '#00ff66' }}>
              LEVEL EDITOR (WIP)
            </button>
          </div>
        </div>
      )}

      {appState === 'playing' && <GameCanvas />}
    </>
  );
}

export default App;
