import { Injectable } from '@angular/core';
import { OverWorld } from '../classes/overWorld';
import { TilesetService } from './tileset.service';
import { TerrainId, TERRAINS, DEFAULT_TERRAIN, ERASER_TERRAIN } from '../models/terrain.model';
import { TILE_SIZE, CANVAS_SIZE } from '../models/world.config';

@Injectable({
  providedIn: 'root',
})
export class worldGridCells {

  constructor(private tileset: TilesetService) {}

  scaleValue = 1;
  overWorld!: OverWorld;
  L = TILE_SIZE;
  H = this.L;
  displayGrid: boolean = false;

  canvasWidth = CANVAS_SIZE;
  canvasHeight = CANVAS_SIZE;

  numHorizontalTiles = this.canvasWidth / this.L;
  numVerticalTiles = this.canvasHeight / this.H;

  mapOfTiles: Record<string, { terrain: TerrainId }> = {};
  private mapBuilt = false;

  initWorldGrid(overWorld: OverWorld): void {
    this.overWorld = overWorld;
    if (!this.mapBuilt) {
      this.buildDefaultMap();
      this.mapBuilt = true;
      this.drawGrid(overWorld, this.tileset.getWaterFrame());
    }
  }

  private buildDefaultMap(): void {
    for (let ty = 0; ty < this.numVerticalTiles; ty++) {
      for (let tx = 0; tx < this.numHorizontalTiles; tx++) {
        this.mapOfTiles[`x${tx}y${ty}`] = { terrain: DEFAULT_TERRAIN };
      }
    }
  }

  drawGrid(overWorld: OverWorld, frame: number): void {
    for (let ty = 0; ty < this.numVerticalTiles; ty++) {
      for (let tx = 0; tx < this.numHorizontalTiles; tx++) {
        this.renderTile(overWorld, tx, ty, frame);
      }
    }
  }

  private terrainAt(tx: number, ty: number, fallback: TerrainId): TerrainId {
    if (tx < 0 || ty < 0 || tx >= this.numHorizontalTiles || ty >= this.numVerticalTiles) return fallback;
    const tile = this.mapOfTiles[`x${tx}y${ty}`];
    return tile ? tile.terrain : fallback;
  }

  renderTile(overWorld: OverWorld, tx: number, ty: number, frame: number): void {
    const s = this.L;
    const dx = tx * s;
    const dy = ty * s;
    const ctx = overWorld.ctx;
    const terrain = this.terrainAt(tx, ty, DEFAULT_TERRAIN);

    ctx.clearRect(dx, dy, s, s);
    this.tileset.drawBase(ctx, terrain, frame, dx, dy);

    const isWater = terrain === 'water';
    const N = this.terrainAt(tx, ty - 1, terrain);
    const E = this.terrainAt(tx + 1, ty, terrain);
    const S = this.terrainAt(tx, ty + 1, terrain);
    const W = this.terrainAt(tx - 1, ty, terrain);

    const edges: [('N' | 'E' | 'S' | 'W'), TerrainId][] = [['N', N], ['E', E], ['S', S], ['W', W]];
    for (const [side, nb] of edges) {
      if ((nb === 'water') !== isWater) this.tileset.drawShoreEdge(ctx, side, dx, dy, isWater);
    }

    const corners: [('NE' | 'SE' | 'SW' | 'NW'), TerrainId][] = [
      ['NE', this.terrainAt(tx + 1, ty - 1, terrain)],
      ['SE', this.terrainAt(tx + 1, ty + 1, terrain)],
      ['SW', this.terrainAt(tx - 1, ty + 1, terrain)],
      ['NW', this.terrainAt(tx - 1, ty - 1, terrain)],
    ];
    for (const [corner, nb] of corners) {
      if ((nb === 'water') !== isWater) this.tileset.drawShoreCorner(ctx, corner, dx, dy, isWater);
    }

    if (this.displayGrid) {
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.strokeRect(dx + 0.5, dy + 0.5, s - 1, s - 1);
    }
  }

  private renderAround(overWorld: OverWorld, tx: number, ty: number, frame: number): void {
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        const nx = tx + ox;
        const ny = ty + oy;
        if (nx < 0 || ny < 0 || nx >= this.numHorizontalTiles || ny >= this.numVerticalTiles) continue;
        this.renderTile(overWorld, nx, ny, frame);
      }
    }
  }

  getTileCoordinates(x: number, y: number) {
    const ty = Math.floor(y / this.H);
    const tx = Math.floor(x / this.H);
    return { tx, ty };
  }

  private eventToTile(event: MouseEvent) {
    const rect = this.overWorld.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / this.scaleValue;
    const y = (event.clientY - rect.top) / this.scaleValue;
    return this.getTileCoordinates(x, y);
  }

  clickedOnGrid(event: MouseEvent, overWorld: OverWorld, terrain: TerrainId): void {
    const { tx, ty } = this.eventToTile(event);
    if (tx < 0 || ty < 0 || tx >= this.numHorizontalTiles || ty >= this.numVerticalTiles) return;
    const key = `x${tx}y${ty}`;
    if (!this.mapOfTiles[key]) this.mapOfTiles[key] = { terrain: DEFAULT_TERRAIN };
    this.mapOfTiles[key].terrain = terrain;
    this.renderAround(overWorld, tx, ty, this.tileset.getWaterFrame());
  }

  eraseOnGrid(event: MouseEvent, overWorld: OverWorld): void {
    const { tx, ty } = this.eventToTile(event);
    if (tx < 0 || ty < 0 || tx >= this.numHorizontalTiles || ty >= this.numVerticalTiles) return;
    const key = `x${tx}y${ty}`;
    if (!this.mapOfTiles[key]) this.mapOfTiles[key] = { terrain: DEFAULT_TERRAIN };
    this.mapOfTiles[key].terrain = ERASER_TERRAIN;
    this.renderAround(overWorld, tx, ty, this.tileset.getWaterFrame());
  }

  isTraversable(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.numHorizontalTiles || y >= this.numVerticalTiles) return false;
    const tile = this.mapOfTiles[`x${x}y${y}`];
    return !!tile && TERRAINS[tile.terrain].traversable;
  }

  getDisplayGrid(x: number, y: number) {
    return this.mapOfTiles[`x${x}y${y}`];
  }

  // ponytail: scans full 256x256 map each tick; fine while water area is small, index water tiles if it grows
  renderWaterTiles(): void {
    if (!this.overWorld) return;
    const frame = this.tileset.getWaterFrame();
    for (const key in this.mapOfTiles) {
      if (this.mapOfTiles[key].terrain !== 'water') continue;
      const coords = key.slice(1).split('y');
      this.renderTile(this.overWorld, Number(coords[0]), Number(coords[1]), frame);
    }
  }

  setDisplayGrid(display: boolean) {
    this.displayGrid = display;
  }

  getScaleValue() {
    return this.scaleValue;
  }

  updateScaleValue(value: number) {
    this.scaleValue = value;
  }

  getOverWorldCanvas() {
    return this.overWorld;
  }
}
