import { BlockType } from './Types';
import type { LevelData } from './Types';

export const GAME_LEVELS: LevelData[] = [
  // Level 1: Introduction
  {
    width: 2000,
    height: 1000,
    spawn: { x: 100, y: 500 },
    blocks: [
      { x: 0, y: 700, width: 2000, height: 100, type: BlockType.WALL }, 
      { x: 0, y: 0, width: 2000, height: 100, type: BlockType.WALL },   
      { x: 0, y: 100, width: 50, height: 600, type: BlockType.WALL },     
      { x: 500, y: 650, width: 100, height: 50, type: BlockType.WALL },
      { x: 700, y: 600, width: 100, height: 100, type: BlockType.WALL },
      { x: 900, y: 700, width: 300, height: 100, type: BlockType.WALL }, 
      { x: 1000, y: 668, width: 32, height: 32, type: BlockType.SPIKE_UP },
      { x: 1032, y: 668, width: 32, height: 32, type: BlockType.SPIKE_UP },
      { x: 1064, y: 668, width: 32, height: 32, type: BlockType.SPIKE_UP },
      { x: 950, y: 200, width: 300, height: 50, type: BlockType.WALL },
      { x: 1800, y: 600, width: 64, height: 100, type: BlockType.PORTAL }
    ]
  },
  // Level 2: Intermediate
  {
    width: 2000,
    height: 1000,
    spawn: { x: 100, y: 500 },
    blocks: [
      { x: 0, y: 700, width: 2000, height: 100, type: BlockType.WALL }, 
      { x: 0, y: 0, width: 2000, height: 100, type: BlockType.WALL },   
      { x: 0, y: 100, width: 50, height: 600, type: BlockType.WALL },     
      
      // Easy path: small ground pillars to hop across
      { x: 250, y: 670, width: 40, height: 30, type: BlockType.WALL },
      { x: 420, y: 670, width: 40, height: 30, type: BlockType.WALL },
      { x: 590, y: 670, width: 40, height: 30, type: BlockType.WALL },
      { x: 760, y: 670, width: 40, height: 30, type: BlockType.WALL },

      // Main winning pillar on ground
      { x: 950, y: 620, width: 60, height: 80, type: BlockType.WALL },
      { x: 950, y: 580, width: 60, height: 40, type: BlockType.PORTAL }
    ]
  },
  // Level 3: Advanced
  {
    width: 3000,
    height: 1000,
    spawn: { x: 100, y: 500 },
    blocks: [
      { x: 0, y: 700, width: 3000, height: 100, type: BlockType.WALL }, 
      { x: 0, y: 0, width: 3000, height: 100, type: BlockType.WALL },   
      { x: 0, y: 100, width: 50, height: 600, type: BlockType.WALL },     
      { x: 300, y: 668, width: 200, height: 32, type: BlockType.SPIKE_UP },
      { x: 600, y: 500, width: 500, height: 200, type: BlockType.WALL },
      { x: 600, y: 200, width: 500, height: 100, type: BlockType.WALL },
      { x: 750, y: 468, width: 50, height: 32, type: BlockType.SPIKE_UP },
      { x: 900, y: 300, width: 50, height: 32, type: BlockType.SPIKE_DOWN },
      { x: 1100, y: 700, width: 800, height: 100, type: BlockType.SPIKE_UP },
      { x: 1200, y: 150, width: 200, height: 50, type: BlockType.WALL },
      { x: 1500, y: 150, width: 200, height: 50, type: BlockType.WALL },
      { x: 1800, y: 550, width: 100, height: 150, type: BlockType.WALL }, 
      { x: 1700, y: 150, width: 400, height: 50, type: BlockType.WALL }, 
      { x: 2100, y: 668, width: 600, height: 32, type: BlockType.SPIKE_UP },
      { x: 2300, y: 400, width: 100, height: 50, type: BlockType.WALL },
      { x: 2800, y: 600, width: 64, height: 100, type: BlockType.PORTAL }
    ]
  }
];

// Provide a dummy class so GameCanvas doesn't break importing missing class
export class LevelManager {
  public getCurrentLevel() { return GAME_LEVELS[0]; }
  public nextLevel() { return false; }
}
