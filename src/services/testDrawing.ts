import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { OverWorld } from '../classes/overWorld';

@Injectable({
  providedIn: 'root',
})
export class TestDrawing {

  overWorld!: OverWorld;
  coord = { x: 0, y: 0 };
  paint = false;
  windowWidth!: number;
  windowHeight!: number;
  startOfCanvasX!: number;
  startOfCanvasY!: number;

  initDrawing(overWorld: OverWorld): void {
    this.overWorld = overWorld;
  }

  getWindowDimensions(windowWidth : number, windowHeight: number){
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    // width="360" height="204" 
    this.startOfCanvasX = (windowWidth - 1080) / 2 
    this.startOfCanvasY = (windowHeight - 612) / 2 
  }

  getPosition(event: MouseEvent | TouchEvent): void {
    if (event instanceof MouseEvent) {
      this.coord.x = event.clientX - this.startOfCanvasX
      this.coord.y = event.clientY - this.startOfCanvasY
    } else if (event instanceof TouchEvent) {
      const touch = event.touches[0];
      this.coord.x = touch.clientX 
      this.coord.y = touch.clientY 
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

  sketch(event: MouseEvent | TouchEvent): void {
    // debugger
    if (!this.paint) return;
    this.overWorld.ctx.beginPath();
    this.overWorld.ctx.lineWidth = 10;
    this.overWorld.ctx.lineCap = 'round';
    this.overWorld.ctx.strokeStyle = 'blue';
    this.overWorld.ctx.moveTo(this.coord.x, this.coord.y);
    this.getPosition(event);
    this.overWorld.ctx.lineTo(this.coord.x, this.coord.y);
    this.overWorld.ctx.stroke();
  }
}
