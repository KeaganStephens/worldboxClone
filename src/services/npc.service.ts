import { Injectable } from '@angular/core';
import { NPC, MovementPattern, NPCState } from '../models/npc.model';
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
  const key = typeof input === 'string' ? input.toLowerCase() : input.key.toLowerCase();

  switch (key) {
      case 'arrowup':
      case 'w':
          this.checkValidityOfMovement('up', npc);
          break;
      case 'arrowdown':
      case 's':
          this.checkValidityOfMovement('down', npc);
          break;
      case 'arrowleft':
      case 'a':
          this.checkValidityOfMovement('left', npc);
          npc.currentDirection = 'left';
          break;
      case 'arrowright':
      case 'd':
          this.checkValidityOfMovement('right', npc);
          npc.currentDirection = 'right';
          break;
      // Diagonal movements
      case 'arrowuparrowright':
      case 'warrowright':
        // debugger
          this.checkValidityOfMovement('up-right', npc);
          npc.currentDirection = 'right';
          break;
      case 'arrowuparrowleft':
      case 'warrowleft':
          this.checkValidityOfMovement('up-left', npc);
          npc.currentDirection = 'left';
          break;
      case 'arrowdownarrowright':
      case 'sarrowright':
          this.checkValidityOfMovement('down-right', npc);
          npc.currentDirection = 'right';
          break;
      case 'arrowdownarrowleft':
      case 'sarrowleft':
          this.checkValidityOfMovement('down-left', npc);
          npc.currentDirection = 'left';
          break;
      default:
          return;
  }
}

// npcRandomWalk(npc: NPC) {
//   const directions = ['w', 's', 'a', 'd', 'wArrowRight', 'wArrowLeft', 'sArrowRight', 'sArrowLeft'];
//   const randomIndex = Math.floor(Math.random() * directions.length);
//   const randomDirection = directions[randomIndex];
//   this.moveNpc(npc, randomDirection);
// }

//chatgpt weighted random direction(todo: look into more realistic)

// npcRandomWalk(npc: NPC) {
//   // Define possible directions with weights
//   const directions = [
//       { direction: 'w', weight: 3 },
//       { direction: 's', weight: 3 },
//       { direction: 'a', weight: 2 },
//       { direction: 'd', weight: 2 },
//       { direction: 'wArrowRight', weight: 1 },
//       { direction: 'wArrowLeft', weight: 1 },
//       { direction: 'sArrowRight', weight: 1 },
//       { direction: 'sArrowLeft', weight: 1 }
//   ];

//   // Calculate the total weight
//   const totalWeight = directions.reduce((sum, dir) => sum + dir.weight, 0);

//   // Pick a random number between 0 and totalWeight
//   let randomNum = Math.random() * totalWeight;

//   // Select a direction based on the random number
//   for (let i = 0; i < directions.length; i++) {
//       randomNum -= directions[i].weight;
//       if (randomNum < 0) {
//           this.moveNpc(npc, directions[i].direction);
//           return;
//       }
//   }
// }

npcRandomWalk(npc: NPC) { //todo: chatgpt generated State-Based Behavior look into this.
  switch (npc.state) {
      case NPCState.Idle:
          // Stay idle for a random amount of time
          if (Math.random() < 0.1) { // 10% chance to start wandering
              npc.state = NPCState.Wandering;
          }
          break;
      case NPCState.Wandering:
          // Move in a random direction
          const directions = ['w', 's', 'a', 'd', 'wArrowRight', 'wArrowLeft', 'sArrowRight', 'sArrowLeft'];
          const randomIndex = Math.floor(Math.random() * directions.length);
          const randomDirection = directions[randomIndex];
          this.moveNpc(npc, randomDirection);
          // Random chance to switch to idle
          if (Math.random() < 0.1) { // 10% chance to go idle
              npc.state = NPCState.Idle;
          }
          break;
      case NPCState.Seeking:
          // Example: Move towards a target (not implemented in this simple example)
          break;
      default:
          break;
  }
}

checkValidityOfMovement(direction: string, npc: NPC) {
  const lengthOfMovementList = npc.movementQueue.length;
  let gridIndex: any;
  const [dx, dy] = this.getDeltaForDirection(direction);

  if (dx !== undefined && dy !== undefined) {
      gridIndex = this.gridCells.getDisplayGrid(npc.currentX + dx, npc.currentY + dy);
  }

  if (gridIndex && gridIndex.traversable && npc.movementQueue[lengthOfMovementList - 1] !== direction) {
      npc.movementQueue.pop();
      npc.movementQueue.push(direction);
  }
}

getDeltaForDirection(direction: string): [number, number] {
    switch (direction) {
        case 'up':
            return [0, -1];
        case 'down':
            return [0, 1];
        case 'left':
            return [-1, 0];
        case 'right':
            return [1, 0];
        case 'up-right':
            return [1, -1];
        case 'up-left':
            return [-1, -1];
        case 'down-right':
            return [1, 1];
        case 'down-left':
            return [-1, 1];
        default:
            return [0, 0];
    }
}


  // movementOfNPC(direction: string, npc: NPC) {
  //   npc.isMoving = true;
  //   switch (direction) {
  //     case 'up':
  //       npc.currentY--;
  //       npc.isMovingY = true;
  //       break;
  //     case 'down':
  //       npc.currentY++;
  //       npc.isMovingY = true;
  //       break;
  //     case 'left':
  //       npc.currentX--;
  //       npc.isMovingX = true;
  //       break;
  //     case 'right':
  //       npc.currentX++;
  //       npc.isMovingX = true;
  //       break;
  //     default:
  //       break;
  //   }
  // }
  
  movementOfNPC(direction: string, npc: NPC) {
    npc.isMoving = true;
    const [dx, dy] = this.getDeltaForDirection(direction);

    if (dx !== undefined && dy !== undefined) {
        npc.currentX += dx;
        npc.currentY += dy;
        npc.isMovingX = dx !== 0;
        npc.isMovingY = dy !== 0;
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
