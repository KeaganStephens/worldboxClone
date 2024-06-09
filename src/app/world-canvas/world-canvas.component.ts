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
  private currentX = 0;
  private currentY = 0;
  private overWorld!: OverWorld;
  movingX = false; //todo : improve naming convention and ';' standard
  movingY = false;
  currentNpcDirection : string = 'left';
  npcMoving = false;
  currentWidthOfFrame = 12;
  npcCurrentFrameIndex = 0;
  npcMovementQueue : string[] = [];
  previousX = {value : 0};
  previousY = {value : 0};

  npc = new NPC 
 
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
      switch (event.key) {
        case 'ArrowUp':
          case 'w':
          case 'W':
            this.checkValidityOfMovement('up');
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            this.checkValidityOfMovement('down');
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            this.checkValidityOfMovement('left');
            this.npc.currentDirection = 'left';
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            this.checkValidityOfMovement('right');
            this.npc.currentDirection  = 'right';
            break;
        default:
          return;
      }
  }

  checkValidityOfMovement(direction : string){
    let lengthOfMovementList = this.npc.movementQueue.length
    if(this.npc.movementQueue[lengthOfMovementList - 1] !== direction){
      this.npc.movementQueue.pop();
      this.npc.movementQueue.push(direction);
    }
  }

  movementOfNPC(direction : string){
    this.npc.isMoving = true;
    switch (direction){
      case 'up':
        this.npc.currentY--
        this.npc.isMovingY = true;
        break
      case 'down':
        this.npc.currentY++
        this.npc.isMovingY = true;
        break
      case 'left':
        this.npc.currentX--
        this.npc.isMovingX = true;
        break
      case 'right':
        this.npc.currentX++
        this.npc.isMovingX = true;
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
    if(!this.npc.isMoving){
      let lengthOfMovementList = this.npc.movementQueue.length ;
      if(lengthOfMovementList > 0){
        this.movementOfNPC(this.npc.movementQueue[lengthOfMovementList - 1]);
        this.npc.movementQueue.pop()
      }
    }
    if(this.npc.frameIndex >= this.npcMovingIndex['right'].length - 1){
      this.npc.isMoving = false;
      this.npc.isMovingY = false;
      this.npc.isMovingX = false;
      this.npc.frameIndex = 0;
    }else{
      if(this.npc.isMoving){
        this.npc.frameIndex++;
      }
    }
    
    this.overWorld.renderNpc(
      "../../assets/img/pixil-frame-0.png",
      this.getCurrentPositionToDisplay(this.npc.isMovingX, this.npc.previousX, this.npc.currentX),
      this.getCurrentPositionToDisplay(this.npc.isMovingY, this.npc.previousY, this.npc.currentY) ,
      this.npcMovingIndex[this.npc.currentDirection][this.npc.frameIndex][1] * this.npc.frameWidth,
      this.npcMovingIndex[this.npc.currentDirection][0][0] * this.npc.frameWidth
      ); 
  }

  changeSpriteAnimation(index : number, array : string[]){
    if(index == array.length ){
      return 0;
    }else{
      return index + 1;
    }
  }

  getCurrentPositionToDisplay(moving : boolean, previous : any, current : number){
    let EndPositionToDisplay = current * 12;
    if(moving){
      if( EndPositionToDisplay < previous.value){
        return previous.value - this.npc.frameIndex + 1;
      }else{
        return previous.value + this.npc.frameIndex+ 1;
      }
    }else{
      previous.value = EndPositionToDisplay;
      return EndPositionToDisplay;
    }
  }

}

type MovementPattern = { [key: string]: number[][] };

class NPC {
  currentX: number = 0;
  currentY: number = 0;
  overWorld!: OverWorld;
  isMovingX: boolean = false;
  isMovingY: boolean = false;
  currentDirection: string = 'left';
  isMoving: boolean = false;
  frameWidth: number = 12;
  frameIndex: number = 0;
  movementQueue: string[] = [];
  previousX: { value: number } = { value: 0 };
  previousY: { value: number } = { value: 0 };
  playable: boolean = false;
  playerID?: string;
}