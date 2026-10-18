import { Injectable } from '@angular/core';
import { TERRAINS, TerrainId, WATER_FRAMES, WATER_FRAME_MS } from '../models/terrain.model';

type Side = 'N' | 'E' | 'S' | 'W';
type Corner = 'NE' | 'SE' | 'SW' | 'NW';

@Injectable({
  providedIn: 'root',
})
export class TilesetService {
  readonly tileSize = 10;
  private readonly blend = 4;

  private atlas?: HTMLCanvasElement;
  private readonly baseIndex: Record<TerrainId, number> = {
    soil: 0,
    grass: 1,
    sand: 2,
    water: 3,
  };

  getWaterFrame(elapsed: number = Date.now()): number {
    return Math.floor(elapsed / WATER_FRAME_MS) % WATER_FRAMES;
  }

  private ensureAtlas(): HTMLCanvasElement {
    if (this.atlas) return this.atlas;

    const s = this.tileSize;
    const cols = 3 + WATER_FRAMES;
    const canvas = document.createElement('canvas');
    canvas.width = cols * s;
    canvas.height = s;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    (['soil', 'grass', 'sand'] as TerrainId[]).forEach((id, i) => {
      this.drawTexture(ctx, i * s, id, 0);
    });
    for (let f = 0; f < WATER_FRAMES; f++) {
      this.drawTexture(ctx, (3 + f) * s, 'water', f);
    }

    this.atlas = canvas;
    return canvas;
  }

  private drawTexture(ctx: CanvasRenderingContext2D, x0: number, terrain: TerrainId, frame: number): void {
    const s = this.tileSize;
    const def = TERRAINS[terrain];

    ctx.fillStyle = def.color;
    ctx.fillRect(x0, 0, s, s);

    ctx.fillStyle = def.shade;
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        if ((((x % 5) + (y % 5) * 5) % 3) === 0) ctx.fillRect(x0 + x, y, 1, 1);
      }
    }

    if (terrain === 'water') {
      ctx.fillStyle = def.foam;
      for (let y = 0; y < s; y++) {
        if ((y + frame * 2) % 5 !== 0) continue;
        for (let x = 0; x < s; x++) {
          if ((x + frame) % 3 === 0) ctx.fillRect(x0 + x, y, 1, 1);
        }
      }
    }
  }

  drawBase(ctx: CanvasRenderingContext2D, terrain: TerrainId, frame: number, dx: number, dy: number): void {
    const atlas = this.ensureAtlas();
    const s = this.tileSize;
    const idx = terrain === 'water' ? 3 + (frame % WATER_FRAMES) : this.baseIndex[terrain];
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(atlas, idx * s, 0, s, s, dx, dy, s, s);
  }

  drawShoreEdge(ctx: CanvasRenderingContext2D, side: Side, dx: number, dy: number, isWaterTile: boolean): void {
    const s = this.tileSize;
    const b = this.blend;
    const [r, g, bl, a] = isWaterTile ? [234, 247, 255, 0.85] : [15, 35, 55, 0.28];

    let grad: CanvasGradient;
    switch (side) {
      case 'N':
        grad = ctx.createLinearGradient(0, dy, 0, dy + b);
        break;
      case 'S':
        grad = ctx.createLinearGradient(0, dy + s, 0, dy + s - b);
        break;
      case 'W':
        grad = ctx.createLinearGradient(dx, 0, dx + b, 0);
        break;
      default:
        grad = ctx.createLinearGradient(dx + s, 0, dx + s - b, 0);
    }
    grad.addColorStop(0, `rgba(${r}, ${g}, ${bl}, ${a})`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${bl}, 0)`);

    ctx.fillStyle = grad;
    ctx.fillRect(dx, dy, s, s);
  }

  drawShoreCorner(ctx: CanvasRenderingContext2D, corner: Corner, dx: number, dy: number, isWaterTile: boolean): void {
    const s = this.tileSize;
    const b = this.blend;
    const [r, g, bl, a] = isWaterTile ? [234, 247, 255, 0.85] : [15, 35, 55, 0.28];

    const cx = corner === 'NE' || corner === 'SE' ? dx + s : dx;
    const cy = corner === 'SE' || corner === 'SW' ? dy + s : dy;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b);
    grad.addColorStop(0, `rgba(${r}, ${g}, ${bl}, ${a})`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${bl}, 0)`);

    ctx.fillStyle = grad;
    ctx.fillRect(dx, dy, s, s);
  }
}
