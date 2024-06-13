import { Injectable } from '@angular/core';
import { NPC, MovementPattern } from '../models/npc.model';

@Injectable({
  providedIn: 'root',
})
export class NpcService {
  listOfNpc: NPC[] = [
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(),
    new NPC(5, 1),
  ];

  npcMovingIndex: MovementPattern = {
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
    if (npc.movementQueue[lengthOfMovementList - 1] !== direction) {
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

  getCurrentPositionToDisplay(
    npc: NPC,
    moving: boolean,
    previous: any,
    current: number
  ) {
    const EndPositionToDisplay = current * 12;
    if (moving) {
      if (EndPositionToDisplay < previous.value) {
        return previous.value - npc.frameIndex + 1;
      } else {
        return previous.value + npc.frameIndex + 1;
      }
    } else {
      previous.value = EndPositionToDisplay;
      return EndPositionToDisplay;
    }
  }
}
