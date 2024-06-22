import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { OverWorld } from '../classes/overWorld';
import { worldGridCells } from './gridCells.service';
import { saveMap } from '../classes/mapSave';

@Injectable({
  providedIn: 'root',
})
export class TestDrawing {

  constructor(private GridCells: worldGridCells, private map : saveMap){}

  overWorld!: OverWorld;
  coord = { x: 0, y: 0 };
  paint = false;
  windowWidth!: number;
  windowHeight!: number;
  startOfCanvasX!: number;
  startOfCanvasY!: number;
  private strokeStyle: string = 'lightblue';

  initDrawing(overWorld: OverWorld): void {
    this.overWorld = overWorld;
    // debugger
    this.GridCells.drawGrid(overWorld, this.map.mapOfTiles)
  }

  setStrokeStyle(color: string) {
    this.strokeStyle = color;
  }

  getWindowDimensions(windowWidth : number, windowHeight: number){
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    // width="360" height="204" * 2 Todo: make a more robust why to change width 
    this.startOfCanvasX = (windowWidth - 720) / 2 
    this.startOfCanvasY = (windowHeight - 720) / 2 
  }

  getPosition(event: MouseEvent | TouchEvent): void {
    // debugger
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
    // debugger
    this.paint = true;
    this.getPosition(event);
  }

  stopPainting(): void {
    this.paint = false;
  }

  sketch(event: MouseEvent): void {
    // debugger
    if (!this.paint) return;
    this.GridCells.clickedOnGrid(event, this.overWorld, this.strokeStyle, 0);
  }

  // getCanvas(){
  //   return this.overWorld
  // }
}
