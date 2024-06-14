import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { OverWorld, OverWorldNpcConfig} from '../../classes/overWorld';
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
      setTimeout(() => {
        this.npcService.render(this.overWorld);
        requestAnimationFrame(() => gameLoop());
      }, 41);
    };
    gameLoop();
  }

}