export interface Vector2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const BlockType = {
  WALL: 0 as const,
  SPIKE_UP: 1 as const,
  SPIKE_DOWN: 2 as const,
  PORTAL: 3 as const,
} as const;

export type BlockTypeValue = typeof BlockType[keyof typeof BlockType];

export interface Block extends Rect {
  type: BlockTypeValue;
}

export interface LevelData {
  blocks: Block[];
  spawn: Vector2;
  width: number;
  height: number;
}
