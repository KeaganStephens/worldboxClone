import { Injectable } from '@angular/core';
import { NPC, MovementPattern } from '../models/npc.model';
import { OverWorld } from '../classes/overWorld';
import { worldGridCells } from './gridCells.service';

@Injectable({
  providedIn: 'root',
})
export class NpcService {

  constructor(private gridCells: worldGridCells){}
  listOfNpc: NPC[] = [
    new NPC(12, 1, true),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC()
  ];

  npcMovingIndex: MovementPattern = { //todo: fix movement of npc, Grid is now set up as 10px while npc moves 12px 
    right: [
      [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0],
    ],
    left: [
      [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 4], [1, 3], [1, 2], [1, 1], [1, 0],
    ],
  };

  moveNpc(npc: NPC, input: string | KeyboardEvent) {
    switch (input) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.checkValidityOfMovement('up', npc);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.checkValidityOfMovement('down', npc);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.checkValidityOfMovement('left', npc);
        npc.currentDirection = 'left';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.checkValidityOfMovement('right', npc);
        npc.currentDirection = 'right';
        break;
      default:
        return;
    }
  }

  npcRandomWalk(npc: NPC) {
    const randomDirection = Math.floor(Math.random() * 4 + 1);
    let direction;
    switch (randomDirection) {
      case 1:
        direction = 'w';
        break;
      case 2:
        direction = 's';
        break;
      case 3:
        direction = 'a';
        break;
      case 4:
        direction = 'd';
        break;
      default:
        return;
    }
    this.moveNpc(npc, direction);
  }

  checkValidityOfMovement(direction: string, npc: NPC) {
    const lengthOfMovementList = npc.movementQueue.length;
    let gridIndex : any
    switch (direction) {
      case 'up':
        gridIndex = this.gridCells.getDisplayGrid(npc.currentX, npc.currentY - 1);
        break;
      case 'down':
        gridIndex = this.gridCells.getDisplayGrid(npc.currentX, npc.currentY + 1);
        break;
      case 'left':
        gridIndex = this.gridCells.getDisplayGrid(npc.currentX - 1, npc.currentY);
        
        break;
      case 'right':
        gridIndex = this.gridCells.getDisplayGrid(npc.currentX + 1, npc.currentY);
        break;
      default:
        break;
    }
    if (npc.movementQueue[lengthOfMovementList - 1] !== direction && gridIndex.traversable) {
      npc.movementQueue.pop();
      npc.movementQueue.push(direction);
    }
  }

  movementOfNPC(direction: string, npc: NPC) {
    npc.isMoving = true;
    switch (direction) {
      case 'up':
        npc.currentY--;
        npc.isMovingY = true;
        break;
      case 'down':
        npc.currentY++;
        npc.isMovingY = true;
        break;
      case 'left':
        npc.currentX--;
        npc.isMovingX = true;
        break;
      case 'right':
        npc.currentX++;
        npc.isMovingX = true;
        break;
      default:
        break;
    }
  }
  
  chosenNpc !: NPC
  render(overWorld : OverWorld) { 
    for(let i = 0; i < this.listOfNpc.length; i++){
      let npc = this.listOfNpc[i];
      
      if(!npc.isMoving){
        let lengthOfMovementList = npc.movementQueue.length ;
        if(lengthOfMovementList > 0){
          this.movementOfNPC(npc.movementQueue[lengthOfMovementList - 1], npc);
          npc.movementQueue.pop()
        }
      }

      if(npc.frameIndex >= this.npcMovingIndex['right'].length - 1){
        npc.isMoving = false;
        npc.isMovingY = false;
        npc.isMovingX = false;
        npc.frameIndex = 0;
      }else{
        if(npc.isMoving){
          npc.frameIndex++;
        }
      }

      if(!npc.playable){
        this.npcRandomWalk(npc)
      }else{
        this.chosenNpc = npc
      }

      // let maxFrameFire = 12;
      // let currentFrameFire = 0;
      // if(this.chosenNpc){
      //   overWorld.renderNpc(
      //     i == 0 ? true : false,
      //     "../../assets/img/chosen.png",
      //     this.getCurrentPositionToDisplay(this.chosenNpc, this.chosenNpc.isMovingX, this.chosenNpc.previousX, this.chosenNpc.currentX),
      //     this.getCurrentPositionToDisplay(this.chosenNpc, this.chosenNpc.isMovingY, this.chosenNpc.previousY, this.chosenNpc.currentY) ,
      //     this.npcMovingIndex['right'][npc.frameIndex][1] * npc.frameWidth,
      //     this.npcMovingIndex['right'][0][0] * npc.frameWidth
      //   );  
      // }

      overWorld.renderNpc(
        i == 0 ? true : false,
        "../../assets/img/npcAdam.png",
        this.getCurrentPositionToDisplay(npc, npc.isMovingX, npc.previousX, npc.currentX),
        this.getCurrentPositionToDisplay(npc, npc.isMovingY, npc.previousY, npc.currentY) ,
        this.npcMovingIndex[npc.currentDirection][npc.frameIndex][1] * npc.frameWidth,
        this.npcMovingIndex[npc.currentDirection][0][0] * npc.frameWidth
      ); 
    }
  }

  getCurrentPositionToDisplay(
    npc: NPC,
    moving: boolean,
    previous: any,
    current: number
  ) {
    const EndPositionToDisplay = current * 10;
    if (moving) {
      if (EndPositionToDisplay < previous.value) {
        return previous.value - npc.frameIndex ;
      } else {
        return previous.value + npc.frameIndex ;
      }
    } else {
      previous.value = EndPositionToDisplay;
      return EndPositionToDisplay;
    }
  }
}
