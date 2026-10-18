import { Injectable } from '@angular/core';
import { OverWorld } from '../classes/overWorld';
import { worldGridCells } from './gridCells.service';
import { TerrainId, DEFAULT_TERRAIN } from '../models/terrain.model';

@Injectable({
  providedIn: 'root',
})
export class TestDrawing {

  constructor(private GridCells: worldGridCells) {}

  overWorld!: OverWorld;
  coord = { x: 0, y: 0 };
  paint = false;
  windowWidth!: number;
  windowHeight!: number;
  startOfCanvasX!: number;
  startOfCanvasY!: number;
  currentTerrain: TerrainId = DEFAULT_TERRAIN;
  tool: 'brush' | 'eraser' = 'brush';

  initDrawing(overWorld: OverWorld): void {
    this.overWorld = overWorld;
  }

  setTerrain(terrain: TerrainId) {
    this.currentTerrain = terrain;
  }

  setTool(tool: 'brush' | 'eraser') {
    this.tool = tool;
  }

  getPosition(event: MouseEvent | TouchEvent): void {
    const rect = this.overWorld.canvas.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      this.coord.x = event.clientX - rect.left;
      this.coord.y = event.clientY - rect.top;
    } else if (event instanceof TouchEvent) {
      const touch = event.touches[0];
      this.coord.x = touch.clientX - rect.left;
      this.coord.y = touch.clientY - rect.top;
    }
  }

  startPainting(event: MouseEvent | TouchEvent): void {
    this.paint = true;
    this.getPosition(event);
  }

  stopPainting(): void {
    this.paint = false;
  }

  sketch(event: MouseEvent): void {
    if (!this.paint) return;
    if (this.tool === 'eraser') {
      this.GridCells.eraseOnGrid(event, this.overWorld);
    } else {
      this.GridCells.clickedOnGrid(event, this.overWorld, this.currentTerrain);
    }
  }
}
