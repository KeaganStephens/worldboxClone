import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { OverWorld } from '../classes/overWorld';
import { saveMap } from '../classes/mapSave';
import { TestDrawing } from './testDrawing.service';

@Injectable({
  providedIn: 'root',
})
export class worldGridCells {

    constructor(private saveMap : saveMap){}

    scaleValue =  0.3;
    overWorld!: OverWorld;
    L = 10;
    H = this.L;
    O = 0;
    displayGrid : boolean = !true;

    canvasWidth = 2560;
    canvasHeight = 2560;

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
                    // // debugger
                    this.drawTile(overWorld,ty, tx , mapOfTiles[x+y].tileType);
                    if( mapOfTiles[x+y].tileType !== 'transparent'){
                        overWorld.renderFloorTile(overWorld, false, '../../assets/img/dirtBlock.png',tx * this.L, ty * this.L)
                    }
                }
                
            }
        }
    }

    drawTile(overWorld: OverWorld,ty : number, tx : number, color : string = 'transparent', lineColor : string = 'black', size : number = 0, biome : boolean = true) {
        // debugger
        const topLeft = {
            x: ((this.numVerticalTiles - ty) * this.O + tx * this.L) - (size * this.L), 
            y: (ty * this.H) - (size * this.L)
        };
        const bottomLeft = { 
            x: ((this.numVerticalTiles - ty - 1) * this.O + tx * this.L) - (size * this.L),
            y: ((ty + 1) * this.H) + (size * this.L)
        };
        const topRight = { 
            x: ((this.numVerticalTiles - ty) * this.O + (tx + 1) * this.L) + (size * this.L), 
            y: (ty * this.H) - (size * this.L)
        };
        const bottomRight = { 
            x: ((this.numVerticalTiles - ty - 1) * this.O + (tx + 1) * this.L) + (size * this.L), 
            y: ((ty + 1) * this.H) + (size * this.L)
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
        const x = (event.clientX - rect.left) / this.scaleValue;
        const y = (event.clientY - rect.top) / this.scaleValue;

        const { tx, ty } = this.getTileCoordinates(x, y);
        if (ty >= 0 && ty < this.numVerticalTiles && tx >= 0 && tx < this.numHorizontalTiles) {
            this.mapOfTiles[`x${tx}y${ty}`].traversable = true;
            this.mapOfTiles[`x${tx}y${ty}`].tileType = color;
            overWorld.renderFloorTile(overWorld, false, '../../assets/img/dirtBlock.png',tx * this.L, ty * this.L)
            this.drawTile(overWorld, ty, tx, color, color, size);
        }
    }

    getDisplayGrid(x: number, y : number){
        return this.mapOfTiles[`x${x}y${y}`]
    }

    getScaleValue(){
        return this.scaleValue;
    }

    updateScaleValue(value : number){
        this.scaleValue = value;
    }

    getOverWorldCanvas(){
        return this.overWorld;
    }
}