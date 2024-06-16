import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { OverWorld } from '../classes/overWorld';

@Injectable({
  providedIn: 'root',
})
export class worldGridCells {

    overWorld!: OverWorld;
    L = 20;
    H = 20;
    O = 0;

    canvasWidth = 720;
    canvasHeight = 720;

    numHorizontalTiles = this.canvasWidth / this.L;
    numVerticalTiles = this.canvasHeight / this.H;

    initWorldGrid(overWorld: OverWorld): void {
        this.overWorld = overWorld;
        for (let ty = 0; ty < this.numVerticalTiles; ty++) {
            for (let tx = 0; tx < this.numHorizontalTiles; tx++) {
                this.drawTile(ty, tx);
            }
        }
    }

    drawTile(ty : number, tx : number, color : string = 'white') {
        const topLeft = { x: (this.numVerticalTiles - ty) * this.O + tx * this.L, y: ty * this.H };
        const bottomLeft = { x: (this.numVerticalTiles - ty - 1) * this.O + tx * this.L, y: (ty + 1) * this.H };
        const topRight = { x: (this.numVerticalTiles - ty) * this.O + (tx + 1) * this.L, y: ty * this.H };
        const bottomRight = { x: (this.numVerticalTiles - ty - 1) * this.O + (tx + 1) * this.L, y: (ty + 1) *this.H };

        this.overWorld.ctx.beginPath();
        this.overWorld.ctx.moveTo(topLeft.x, topLeft.y);
        this.overWorld.ctx.lineTo(topRight.x, topRight.y);
        this.overWorld.ctx.lineTo(bottomRight.x, bottomRight.y);
        this.overWorld.ctx.lineTo(bottomLeft.x, bottomLeft.y);
        this.overWorld.ctx.closePath();
        this.overWorld.ctx.fillStyle = color;
        this.overWorld.ctx.fill();
        this.overWorld.ctx.stroke();
    }

    getTileCoordinates(x : number, y : number) {
        const ty = Math.floor(y / this.H);
        const tx = Math.floor((x - (this.numVerticalTiles - (y / this.H)) * this.O) / this.L);
        return { ty, tx };
    }

    // Add event listener to handle drawing on the canvas
    clickedOnGrid(event: MouseEvent){
        const rect = this.overWorld.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const { ty, tx } = this.getTileCoordinates(x, y);
        if (ty >= 0 && ty < this.numVerticalTiles && tx >= 0 && tx < this.numHorizontalTiles) {
            this.drawTile(ty, tx, 'lightblue'); // Change color to lightblue on click
        }
    }

}