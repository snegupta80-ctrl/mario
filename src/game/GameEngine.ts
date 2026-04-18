import { BlockType } from './Types';
import type { LevelData, Vector2, Rect } from './Types';

interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  gravitySwitch: boolean;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private lastTime: number = 0;

  // Level & World State
  private level: LevelData | null = null;
  private camera: Vector2 = { x: 0, y: 0 };
  
  // Callbacks
  public onDie: () => void = () => {};
  public onWin: () => void = () => {};

  // Player State
  private player = {
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    vx: 0,
    vy: 0,
    gravityFlipped: false,
    grounded: false,
  };

  private input: InputState = { left: false, right: false, jump: false, gravitySwitch: false };
  private prevInput: InputState = { left: false, right: false, jump: false, gravitySwitch: false };
  
  // Physics Constants
  private gravity = 1500;
  private moveSpeed = 400;
  private jumpPower = 600;
  private maxFallSpeed = 1000;
  private friction = 0.8;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get 2D context");
    this.ctx = ctx;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  public loadLevel(level: LevelData) {
    this.level = level;
    this.respawn();
  }

  private respawn() {
    if (!this.level) return;
    this.player.x = this.level.spawn.x;
    this.player.y = this.level.spawn.y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.gravityFlipped = false;
  }

  public start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.input.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') this.input.right = true;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') this.input.jump = true;
    if (e.code === 'Space') this.input.gravitySwitch = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.input.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') this.input.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') this.input.jump = false;
    if (e.code === 'Space') this.input.gravitySwitch = false;
  };

  private aabb(rect1: {x: number, y: number, width: number, height: number}, rect2: {x: number, y: number, width: number, height: number}) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  private update(dt: number) {
    if (!this.level) return;

    // Convert dt to seconds
    const dtSec = dt / 1000;

    // Movement
    let targetVx = 0;
    if (this.input.left) targetVx = -this.moveSpeed;
    if (this.input.right) targetVx = this.moveSpeed;

    this.player.vx = this.player.vx * this.friction + targetVx * (1 - this.friction);

    // Gravity Switch
    if (this.input.gravitySwitch && !this.prevInput.gravitySwitch) {
      this.player.gravityFlipped = !this.player.gravityFlipped;
      // Small vertical boost on switch to detach from floor/ceiling
      this.player.vy = this.player.gravityFlipped ? -100 : 100;
    }

    // Jump
    if (this.input.jump && !this.prevInput.jump && this.player.grounded) {
      this.player.vy = this.player.gravityFlipped ? this.jumpPower : -this.jumpPower;
      this.player.grounded = false;
    }

    // Apply Gravity
    const gravForce = this.player.gravityFlipped ? -this.gravity : this.gravity;
    this.player.vy += gravForce * dtSec;

    // Clamp fall speed
    if (this.player.vy > this.maxFallSpeed) this.player.vy = this.maxFallSpeed;
    if (this.player.vy < -this.maxFallSpeed) this.player.vy = -this.maxFallSpeed;

    // Move X & Collide
    this.player.x += this.player.vx * dtSec;
    for (const b of this.level.blocks) {
      if (this.aabb(this.player, b)) {
        if (b.type === BlockType.WALL) {
          if (this.player.vx > 0) {
            this.player.x = b.x - this.player.width;
          } else if (this.player.vx < 0) {
            this.player.x = b.x + b.width;
          }
          this.player.vx = 0;
        } else if (b.type === BlockType.SPIKE_UP || b.type === BlockType.SPIKE_DOWN) {
          this.onDie();
          this.respawn();
          return;
        } else if (b.type === BlockType.PORTAL) {
          this.onWin();
          return;
        }
      }
    }

    // Move Y & Collide
    this.player.y += this.player.vy * dtSec;
    this.player.grounded = false;

    for (const b of this.level.blocks) {
      if (this.aabb(this.player, b)) {
        if (b.type === BlockType.WALL) {
          if (this.player.vy > 0) {
            this.player.y = b.y - this.player.height;
            if (!this.player.gravityFlipped) this.player.grounded = true;
          } else if (this.player.vy < 0) {
            this.player.y = b.y + b.height;
            if (this.player.gravityFlipped) this.player.grounded = true;
          }
          this.player.vy = 0;
        } else if (b.type === BlockType.SPIKE_UP || b.type === BlockType.SPIKE_DOWN) {
           this.onDie();
           this.respawn();
           return;
        } else if (b.type === BlockType.PORTAL) {
          this.onWin();
          return;
        }
      }
    }

    // Update Camera
    const targetCamX = this.player.x - this.canvas.width / 2 + this.player.width / 2;
    const targetCamY = this.player.y - this.canvas.height / 2 + this.player.height / 2;
    this.camera.x += (targetCamX - this.camera.x) * 5 * dtSec;
    this.camera.y += (targetCamY - this.camera.y) * 5 * dtSec;

    // Save prev input
    this.prevInput = { ...this.input };
  }

  private drawRectWithGlow(rect: Rect, color: string, glowSize: number = 20) {
    this.ctx.shadowBlur = glowSize;
    this.ctx.shadowColor = color;
    this.ctx.fillStyle = this.ctx.strokeStyle = color;
    
    // Draw outline
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    
    // Fill with slight transparency
    this.ctx.globalAlpha = 0.2;
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    this.ctx.globalAlpha = 1.0;
    this.ctx.shadowBlur = 0;
  }

  private drawTriangleWithGlow(x: number, y: number, size: number, up: boolean, color: string) {
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = color;
    this.ctx.fillStyle = this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    if (up) {
      this.ctx.moveTo(x + size/2, y);
      this.ctx.lineTo(x + size, y + size);
      this.ctx.lineTo(x, y + size);
    } else {
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + size, y);
      this.ctx.lineTo(x + size/2, y + size);
    }
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.globalAlpha = 0.4;
    this.ctx.fill();
    this.ctx.globalAlpha = 1.0;
    this.ctx.shadowBlur = 0;
  }

  private render() {
    // Clear screen
    this.ctx.fillStyle = '#050510'; // Deep dark background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.level) return;

    this.ctx.save();
    this.ctx.translate(-Math.floor(this.camera.x), -Math.floor(this.camera.y));

    // Draw blocks
    for (const b of this.level.blocks) {
      if (b.type === BlockType.WALL) {
        this.drawRectWithGlow(b, '#00f3ff');
      } else if (b.type === BlockType.SPIKE_UP) {
        this.drawTriangleWithGlow(b.x, b.y, b.width, true, '#ff00ea');
      } else if (b.type === BlockType.SPIKE_DOWN) {
        this.drawTriangleWithGlow(b.x, b.y, b.width, false, '#ff00ea');
      } else if (b.type === BlockType.PORTAL) {
        this.drawRectWithGlow(b, '#00ff66', 30);
      }
    }

    // Draw Player
    const playerColor = this.player.gravityFlipped ? '#9d00ff' : '#ffffff';
    this.drawRectWithGlow(this.player, playerColor, 15);

    this.ctx.restore();
  }

  private loop = (time: number) => {
    const dt = time - this.lastTime;
    this.lastTime = time;

    // Cap dt at 50ms to prevent huge jumps
    const safeDt = Math.min(dt, 50);

    this.update(safeDt);
    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
