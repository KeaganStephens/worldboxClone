import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { OverWorld, OverWorldNpcConfig} from '../classes/overWorld';

@Component({
  selector: 'app-world-canvas',
  standalone: true,
  imports: [],
  templateUrl: './world-canvas.component.html',
  styleUrls: ['./world-canvas.component.css'] // Fixed typo: styleUrl to styleUrls
})
export class WorldCanvasComponent implements OnInit {
  private overWorld!: OverWorld;

  listOfNpc :NPC[] = [
    new NPC,
    new NPC,
    new NPC,
    new NPC,
    new NPC,
    new NPC,
    new NPC,
    new NPC,
    new NPC,
    new NPC(5,1)
  ]
 
  npcMovingIndex: MovementPattern = {
    'right': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0]],
    'left': [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 4], [1, 3], [1, 2], [1, 1], [1, 0]]
  };

  ngOnInit(): void {
    this.initializeOverWorld();
    this.startGameLoop();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.moveNpc(this.listOfNpc[0], event.key)
  }

  moveNpc(npc : NPC, input : string | KeyboardEvent){
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
          npc.currentDirection  = 'right';
          break;
      default:
        return;
    }
  }

  npcRandomWalk(npc : NPC){
    let randomDirection = Math.floor(Math.random() * 4 + 1)
    let direction
    switch (randomDirection) {
      case 1:
          direction  = 'w';
          break;
        case 2:
          direction  = 's';
          break;
        case 3:
          direction  = 'a';
          break;
        case 4:
          direction  = 'd';
          break;
      default:
        return;
    }
    this.moveNpc(npc, direction)
  }

  checkValidityOfMovement(direction : string, npc : NPC){
    let lengthOfMovementList = npc.movementQueue.length
    if(npc.movementQueue[lengthOfMovementList - 1] !== direction){
      npc.movementQueue.pop();
      npc.movementQueue.push(direction);
    }
  }

  movementOfNPC(direction : string, npc : NPC){
    npc.isMoving = true;
    switch (direction){
      case 'up':
        npc.currentY--;
        npc.isMovingY = true;
        break
      case 'down':
        npc.currentY++;
        npc.isMovingY = true;
        break
      case 'left':
        npc.currentX--;
        npc.isMovingX = true;
        break
      case 'right':
        npc.currentX++;
        npc.isMovingX = true;
        break
      default:
        break
    }
  }

  initializeOverWorld() {
    const overWorldConfig: OverWorldNpcConfig = {
      element: document.querySelector('.canvasContainer') as HTMLElement,
      canvas: 'gameCanvas',
    };

    this.overWorld = new OverWorld(overWorldConfig);
    this.overWorld.init();
  }

  startGameLoop() { 
    const gameLoop = () => {
      this.render();
      requestAnimationFrame(() => gameLoop());
    };
    gameLoop();
  }

  render() { //todo: move NPC on a later stated to separate 
    for(let i = 0; i < this.listOfNpc.length; i++){
      let npc = this.listOfNpc[i];
      this.npcRandomWalk(npc)
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
      
      this.overWorld.renderNpc(
        i == 0 ? true : false,
        "../../assets/img/pixil-frame-0.png",
        this.getCurrentPositionToDisplay(npc, npc.isMovingX, npc.previousX, npc.currentX),
        this.getCurrentPositionToDisplay(npc, npc.isMovingY, npc.previousY, npc.currentY) ,
        this.npcMovingIndex[npc.currentDirection][npc.frameIndex][1] * npc.frameWidth,
        this.npcMovingIndex[npc.currentDirection][0][0] * npc.frameWidth
        ); 
    }
  }

  changeSpriteAnimation(index : number, array : string[]){
    if(index == array.length ){
      return 0;
    }else{
      return index + 1;
    }
  }

  getCurrentPositionToDisplay(npc: NPC, moving : boolean, previous : any, current : number){ //Todo: remove the extra parameters
    let EndPositionToDisplay = current * 12;
    if(moving){
      if( EndPositionToDisplay < previous.value){
        return previous.value - npc.frameIndex + 1;
      }else{
        return previous.value + npc.frameIndex+ 1;
      }
    }else{
      previous.value = EndPositionToDisplay;
      return EndPositionToDisplay;
    }
  }

}

type MovementPattern = { [key: string]: number[][] };

class NPC {
  currentX: number;
  currentY: number;
  overWorld!: OverWorld;
  isMovingX: boolean;
  isMovingY: boolean;
  currentDirection: string;
  isMoving: boolean;
  frameWidth: number;
  frameIndex: number;
  movementQueue: string[];
  previousX: { value: number };
  previousY: { value: number };
  playable: boolean;
  playerID?: string;

  constructor(currentX: number = 10, currentY: number = 10) {
    this.currentX = currentX;
    this.currentY = currentY;
    this.isMovingX = false;
    this.isMovingY = false;
    this.currentDirection = 'left';
    this.isMoving = false;
    this.frameWidth = 12;
    this.frameIndex = 0;
    this.movementQueue = [];
    this.previousX = { value: 0 };
    this.previousY = { value: 0 };
    this.playable = false;
  }
}
