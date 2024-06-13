import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { OverWorld, OverWorldNpcConfig} from '../../classes/overWorld';
import { NPC,MovementPattern } from '../../models/npc.model';
import { NpcService } from '../../services/npc.service';

@Component({
  selector: 'app-world-canvas',
  standalone: true,
  imports: [],
  templateUrl: './world-canvas.component.html',
  styleUrls: ['./world-canvas.component.css'] // Fixed typo: styleUrl to styleUrls
})
export class WorldCanvasComponent implements OnInit {
  private overWorld!: OverWorld;

  constructor(private npcService: NpcService) {}

  ngOnInit(): void {
    this.initializeOverWorld();
    this.startGameLoop();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.npcService.moveNpc(this.npcService.listOfNpc[0], event.key)
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
    for(let i = 0; i < this.npcService.listOfNpc.length; i++){
      let npc = this.npcService.listOfNpc[i];
      this.npcService.npcRandomWalk(npc)
      if(!npc.isMoving){
        let lengthOfMovementList = npc.movementQueue.length ;
        if(lengthOfMovementList > 0){
          this.npcService.movementOfNPC(npc.movementQueue[lengthOfMovementList - 1], npc);
          npc.movementQueue.pop()
        }
      }
      if(npc.frameIndex >= this.npcService.npcMovingIndex['right'].length - 1){
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
        this.npcService.getCurrentPositionToDisplay(npc, npc.isMovingX, npc.previousX, npc.currentX),
        this.npcService.getCurrentPositionToDisplay(npc, npc.isMovingY, npc.previousY, npc.currentY) ,
        this.npcService.npcMovingIndex[npc.currentDirection][npc.frameIndex][1] * npc.frameWidth,
        this.npcService.npcMovingIndex[npc.currentDirection][0][0] * npc.frameWidth
        ); 
    }
  }
}