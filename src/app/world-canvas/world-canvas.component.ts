import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { OverWorld, OverWorldNpcConfig} from '../../classes/overWorld';
import { NpcService } from '../../services/npc.service';
import { TestDrawing } from '../../services/testDrawing.service';
import { worldGridCells } from '../../services/gridCells.service';

@Component({
  selector: 'app-world-canvas',
  standalone: true,
  imports: [],
  templateUrl: './world-canvas.component.html',
  styleUrls: ['./world-canvas.component.css'] // Fixed typo: styleUrl to styleUrls
})
export class WorldCanvasComponent implements OnInit {
  private overWorld!: OverWorld;
  windowWidth!: number;
  windowHeight!: number;

  constructor(
    private npcService: NpcService,
    private drawing: TestDrawing,
    private worldGrid : worldGridCells
  ){}

  ngOnInit(): void {
    this.initializeOverWorld();
    this.windowDimensions()
    this.startGameLoop();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowDimensions()
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.npcService.moveNpc(this.npcService.listOfNpc[0], event.key)
  }

  @HostListener('click', ['$event'])
  gridClick(event: MouseEvent): void {
    this.worldGrid.clickedOnGrid(event);
  }

  @HostListener('mousedown', ['$event'])
  startPainting(event: MouseEvent): void {
    this.drawing.startPainting(event)
  }
  
  @HostListener('mouseup')
  stopPainting(): void {
    this.drawing.stopPainting()
  }

  @HostListener('mousemove', ['$event'])
  sketch(event: MouseEvent): void {
    this.drawing.sketch(event)
  }

  initializeOverWorld() {
    const overNpcConfig: OverWorldNpcConfig = {
      element: document.querySelector('.canvasContainer') as HTMLElement,
      canvas: 'gameCanvas',
    };
    const overWorldConfig: OverWorldNpcConfig = {
      element: document.querySelector('.canvasContainer') as HTMLElement,
      canvas: 'gameCanvasDraw',
    };
    const overWorldGridCells: OverWorldNpcConfig = {
      element: document.querySelector('.canvasContainer') as HTMLElement,
      canvas: 'gameCanvasGrid',
    };
    this.overWorld = new OverWorld(overNpcConfig);
    this.drawing.initDrawing(new OverWorld(overWorldConfig))
    this.worldGrid.initWorldGrid(new OverWorld(overWorldGridCells))
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

  windowDimensions(){
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.drawing.getWindowDimensions(this.windowWidth, this.windowHeight)
  }

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.drawing.setStrokeStyle(color);
  }

}