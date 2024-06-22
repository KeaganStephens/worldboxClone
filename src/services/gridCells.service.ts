import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { OverWorld } from '../classes/overWorld';
import { saveMap } from '../classes/mapSave';
import { TestDrawing } from './testDrawing.service';

@Injectable({
  providedIn: 'root',
})
export class worldGridCells {

    constructor(private saveMap : saveMap){}

    overWorld!: OverWorld;
    L = 20;
    H = 20;
    O = 0;
    displayGrid : boolean = !true;

    canvasWidth = 720;
    canvasHeight = 720;

    numHorizontalTiles = this.canvasWidth / this.L;
    numVerticalTiles = this.canvasHeight / this.H;

    mapOfTiles : any = {}

    initWorldGrid(overWorld: OverWorld): void {
        // this.mapOfTiles = this.map.mapOfTiles
        this.overWorld = overWorld;
        this.drawGrid(overWorld, this.mapOfTiles)
        this.mapOfTiles = this.saveMap.mapOfTiles
    }

    drawGrid(overWorld : OverWorld, mapOfTiles : any){
        for (let ty = 0; ty < this.numVerticalTiles; ty++) {
            for (let tx = 0; tx < this.numHorizontalTiles; tx++) {
                let x = `x${tx}`
                let y = `y${ty}`
                if(mapOfTiles[x+y] === undefined){
                    mapOfTiles[x+y] = {
                        traversable: false,
                        tileType: 'transparent'
                    }
                    this.drawTile(overWorld,ty, tx , mapOfTiles[x+y].tileType);
                }else{
                    this.drawTile(overWorld,ty, tx , mapOfTiles[x+y].tileType);
                }
                
            }
        }
    }

    drawTile(overWorld: OverWorld,ty : number, tx : number, color : string = 'transparent', lineColor : string = 'black', size : number = 0) {
        // debugger
        const topLeft = {
            x: ((this.numVerticalTiles - ty) * this.O + tx * this.L) - (size * 20), 
            y: (ty * this.H) - (size * 20)
        };
        const bottomLeft = { 
            x: ((this.numVerticalTiles - ty - 1) * this.O + tx * this.L) - (size * 20),
            y: ((ty + 1) * this.H) + (size * 20)
        };
        const topRight = { 
            x: ((this.numVerticalTiles - ty) * this.O + (tx + 1) * this.L) + (size * 20), 
            y: (ty * this.H) - (size * 20)
        };
        const bottomRight = { 
            x: ((this.numVerticalTiles - ty - 1) * this.O + (tx + 1) * this.L) + (size * 20), 
            y: ((ty + 1) * this.H) + (size * 20)
        };

        overWorld.ctx.beginPath();
        overWorld.ctx.moveTo(topLeft.x, topLeft.y);
        overWorld.ctx.lineTo(topRight.x, topRight.y);
        overWorld.ctx.lineTo(bottomRight.x, bottomRight.y);
        overWorld.ctx.lineTo(bottomLeft.x, bottomLeft.y);
        overWorld.ctx.closePath();
        overWorld.ctx.fillStyle = color;
        overWorld.ctx.fill();
        if(this.displayGrid){
            overWorld.ctx.strokeStyle = lineColor; 
            overWorld.ctx.stroke();
        }
    }

    getTileCoordinates(x : number, y : number) {
        const ty = Math.floor(y / this.H);
        const tx = Math.floor(
            // (x - (this.numVerticalTiles - (y / this.H)) * this.O) / this.L
            x / this.H
            );
        return { tx, ty };
    }

    clickedOnGrid(event: MouseEvent, overWorld: OverWorld, color: string, size : number){ //Todo: rename overWord to more fitting name
        // debugger
        const rect = this.overWorld.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const { tx, ty } = this.getTileCoordinates(x, y);
        if (ty >= 0 && ty < this.numVerticalTiles && tx >= 0 && tx < this.numHorizontalTiles) {
            this.mapOfTiles[`x${tx}y${ty}`].traversable = true;
            this.mapOfTiles[`x${tx}y${ty}`].tileType = color;
            this.drawTile(overWorld, ty, tx, color, color, size);
        }
    }

    getDisplayGrid(x: number, y : number){
        return this.mapOfTiles[`x${x}y${y}`]
    }

}