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
  private requestId!: number;
  private overWorld!: OverWorld;
  movingX = false;
  movingY = false;
  tempX = 0;
  tempY = 0; 
  npcSkinLeft = ['movingLeft', 'movingLeft','movingLeft','movingLeft','movingLeft','movingLeft', 'left', 'left','left','left','left','left']; //Improve the way that character movement functions
  npcSkinRight = ['movingRight', 'movingRight','movingRight', 'movingRight', 'movingRight', 'movingRight', 'right', 'right', 'right', 'right', 'right', 'right']; 
  currentNpcDirection : string = 'left';
  npcMoving = false;
  currentWidthOfFrame = 12;
  npcCurrentFrameIndex = 0
 
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
    if(!this.movingY && !this.movingY){
      switch (event.key) {
        case 'ArrowUp':
          case 'w':
          case 'W':
            this.movingY = true;
            this.npcMoving = true
            // this.npcCurrentFrameIndex = 0
            this.currentY--
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            this.movingY = true;
            this.npcMoving = true
            // this.npcCurrentFrameIndex = 0
            this.currentY++
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            this.movingX = true;
            this.npcMoving = true
            this.currentNpcDirection = 'left'
            // this.npcCurrentFrameIndex = 0
            this.currentX--
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            this.movingX = true;
            this.npcMoving = true
            this.currentNpcDirection = 'right'
            // this.npcCurrentFrameIndex = 0
            this.currentX++
            break;
        default:
          return;
      }
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

  startGameLoop() { //I need a greater understanding of how a game loop works 
    const gameLoop = () => {
      // this.update(this.movingX, this.movingY); 
      this.render();
      requestAnimationFrame(() => gameLoop())
    };
    gameLoop()
  }

  // update(x: boolean = false, y: boolean = false) {
  //   if(x){
  //     if(this.tempX == this.currentX * 12){
  //       this.movingX = false
  //       this.currentRightIndex =0
  //       this.currentLeftIndex =0
  //     }else if(this.tempX < this.currentX * 12){
  //       this.currentNpcDirection = 'right';
  //       if(this.tempX % 2){
  //         this.currentRightIndex = this.changeSpriteAnimation(this.currentRightIndex, this.npcSkinRight)
  //       }
  //       this.overWorld.updatePosition(this.tempX, this.currentY * 12, this.npcSkinRight[this.currentRightIndex]);
  //       this.tempX++
  //     }else{
  //       this.currentNpcDirection = 'left';
  //       if((this.tempX % 2)){
  //         this.currentLeftIndex = this.changeSpriteAnimation(this.currentLeftIndex, this.npcSkinLeft)
  //       }
  //       this.overWorld.updatePosition(this.tempX, this.currentY * 12, this.npcSkinLeft[this.currentLeftIndex]);
  //       this.tempX--
  //     }
  //   }else if(y){
  //     if(this.tempY == this.currentY * 12){
  //       this.movingY = false
  //       this.currentRightIndex =0
  //       this.currentLeftIndex =0
  //     }else if(this.tempY < this.currentY * 12){
  //       this.moveNpcVertically(this.currentNpcDirection, this.tempY)
  //       this.tempY++
  //     }else{
  //       this.moveNpcVertically(this.currentNpcDirection, this.tempY)
  //       this.tempY--
  //     }
  //   }else{
  //     this.overWorld.updatePosition(this.currentX * 12, this.currentY * 12, this.currentNpcDirection);
  //   }
  // }

  render() {
    // debugger
    if(this.npcCurrentFrameIndex >= this.npcMovingIndex['right'].length - 1){
      // debugger
      this.npcMoving = false
      this.movingY = false
      this.movingX = false
      this.npcCurrentFrameIndex = 0
    }else{
      if(this.npcMoving){
        this.npcCurrentFrameIndex++
      }
    }
    // debugger
    this.overWorld.renderNpc(
      "../../assets/img/pixil-frame-0.png",
      this.getCurrentPositionToDisplay(),
      this.getCurrentPositionToDisplayY() ,
      this.npcMovingIndex[this.currentNpcDirection][this.npcCurrentFrameIndex][1] * this.currentWidthOfFrame,
      this.npcMovingIndex[this.currentNpcDirection][0][0] * this.currentWidthOfFrame
      ); 
  }

  currentLeftIndex = 0;
  currentRightIndex = 0;

  changeSpriteAnimation(index : number, array : string[]){
    if(index == array.length ){
      return 0
    }else{
      return index + 1
    }
  }

  previousX = 0
  getCurrentPositionToDisplay(){
    let EndPositionToDisplay = this.currentX * 12
    if(this.movingX){
      if( this.currentNpcDirection == 'left'){
        return this.previousX - this.npcCurrentFrameIndex + 1
      }else{
        return this.previousX + this.npcCurrentFrameIndex + 1
      }
    }else{
      this.previousX = EndPositionToDisplay
      return EndPositionToDisplay
    }
  }

  previousY = 0
  getCurrentPositionToDisplayY(){
    let EndPositionToDisplay = this.currentY * 12
    if(this.movingY){
      if( EndPositionToDisplay < this.previousY){
        return this.previousY - this.npcCurrentFrameIndex + 1
      }else{
        return this.previousY + this.npcCurrentFrameIndex + 1
      }
    }else{
      this.previousY = EndPositionToDisplay
      return EndPositionToDisplay
    }
  }

  // moveNpcVertically(currentDirection : string, Y : number){
  //   if(currentDirection == 'right'){
  //     if(Y % 2){
  //       this.currentRightIndex = this.changeSpriteAnimation(this.currentRightIndex, this.npcSkinRight)
  //     }
  //     this.overWorld.updatePosition(this.currentX * 12, Y, this.npcSkinRight[this.currentRightIndex]);
  //   }else{
  //     if(Y % 2){
  //       this.currentLeftIndex = this.changeSpriteAnimation(this.currentLeftIndex, this.npcSkinLeft)
  //     }
  //     this.overWorld.updatePosition(this.currentX * 12, Y, this.npcSkinLeft[this.currentLeftIndex]);
  //   }
  // }
  

}

type MovementPattern = { [key: string]: number[][] };