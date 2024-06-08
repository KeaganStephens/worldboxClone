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
  currentLeftIndex = 0;
  currentRightIndex = 0;
  npcMovementQueue : string[] = []
 
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
            this.checkValidityOfMovement('up')
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            this.checkValidityOfMovement('down')
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            this.checkValidityOfMovement('left')
            this.currentNpcDirection = 'left'
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            this.checkValidityOfMovement('right')
            this.currentNpcDirection = 'right'
            break;
        default:
          return;
      }
  }

  checkValidityOfMovement(direction : string){
    let lengthOfMovementList = this.npcMovementQueue.length
    if(this.npcMovementQueue[lengthOfMovementList - 1] !== direction){
      this.npcMovementQueue.pop()
      this.npcMovementQueue.push(direction)
    }
  }

  movementOfNPC(direction : string){
    this.npcMoving = true
    switch (direction){
      case 'up':
        this.currentY--
        this.movingY = true;
        break
      case 'down':
        this.currentY++
        this.movingY = true;
        break
      case 'left':
        this.currentX--
        this.movingX = true;
        break
      case 'right':
        this.currentX++
        this.movingX = true;
        break
      default:
        break
    }
  }

  initializeOverWorld() {
    const overWorldConfig: OverWorldNpcConfig = {
      element: document.querySelector('.canvasContainer') as HTMLElement,
      canvas: 'gameCanvas',
      src: '../../assets/img/pixilart-drawing.png',
      x: this.currentX,
      y: this.currentY,
      lookDirection: 'movingRight',
    };

    this.overWorld = new OverWorld(overWorldConfig);
    this.overWorld.init();
  }

  startGameLoop() { 
    const gameLoop = () => {
      this.render();
      requestAnimationFrame(() => gameLoop())
    };
    gameLoop()
  }

  render() { //todo: move NPC on a later stated to separate 
    if(this.npcCurrentFrameIndex >= this.npcMovingIndex['right'].length - 1){
      this.npcMoving = false
      this.movingY = false
      this.movingX = false
      this.npcCurrentFrameIndex = 0

      if(!this.npcMoving){
        let lengthOfMovementList = this.npcMovementQueue.length 
        if(lengthOfMovementList > 0){
          this.movementOfNPC(this.npcMovementQueue[lengthOfMovementList - 1])
          this.npcMovementQueue.pop()
        }
      }

    }else{
      if(this.npcMoving){
        this.npcCurrentFrameIndex++
      }
    }

    this.overWorld.renderNpc(
      "../../assets/img/pixil-frame-0.png",
      this.getCurrentPositionToDisplay(this.movingX, this.previousX, this.currentX),
      this.getCurrentPositionToDisplay(this.movingY, this.previousY, this.currentY) ,
      this.npcMovingIndex[this.currentNpcDirection][this.npcCurrentFrameIndex][1] * this.currentWidthOfFrame,
      this.npcMovingIndex[this.currentNpcDirection][0][0] * this.currentWidthOfFrame
      ); 
  }

  changeSpriteAnimation(index : number, array : string[]){
    if(index == array.length ){
      return 0
    }else{
      return index + 1
    }
  }

  //todo: improve code below
  previousX = {value : 0}
  previousY = {value : 0}

  getCurrentPositionToDisplay(moving : boolean, previous : any, current : number){
    let EndPositionToDisplay = current * 12
    if(moving){
      if( EndPositionToDisplay < previous.value){
        return previous.value - this.npcCurrentFrameIndex + 1
      }else{
        return previous.value + this.npcCurrentFrameIndex + 1
      }
    }else{
      previous.value = EndPositionToDisplay
      return EndPositionToDisplay
    }
  }

}

type MovementPattern = { [key: string]: number[][] };