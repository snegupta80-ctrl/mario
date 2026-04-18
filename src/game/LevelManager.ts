import { BlockType } from './Types';
import type { LevelData } from './Types';

export class LevelManager {
  private levels: LevelData[] = [];
  private currentLevelIndex: number = 0;

  constructor() {
    this.initLevels();
  }

  private initLevels() {
    this.levels.push({
      width: 2000,
      height: 1000,
      spawn: { x: 100, y: 500 },
      blocks: [
        // Borders
        { x: 0, y: 700, width: 2000, height: 100, type: BlockType.WALL }, // Floor
        { x: 0, y: 0, width: 2000, height: 100, type: BlockType.WALL },   // Ceiling
        { x: 0, y: 100, width: 50, height: 600, type: BlockType.WALL },     // Left wall
        
        // Tutorial jumps
        { x: 500, y: 650, width: 100, height: 50, type: BlockType.WALL },
        { x: 700, y: 600, width: 100, height: 100, type: BlockType.WALL },
        
        // Gravity Switch Intro
        { x: 900, y: 700, width: 300, height: 100, type: BlockType.WALL }, // pit floor
        { x: 1000, y: 668, width: 32, height: 32, type: BlockType.SPIKE_UP },
        { x: 1032, y: 668, width: 32, height: 32, type: BlockType.SPIKE_UP },
        { x: 1064, y: 668, width: 32, height: 32, type: BlockType.SPIKE_UP },
        
        // Ceiling landing platform
        { x: 950, y: 200, width: 300, height: 50, type: BlockType.WALL },

        // Exit
        { x: 1800, y: 600, width: 64, height: 100, type: BlockType.PORTAL }
      ]
    });
  }

  public getCurrentLevel(): LevelData {
    return this.levels[this.currentLevelIndex];
  }

  public nextLevel(): boolean {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
      return true;
    }
    return false;
  }
}
