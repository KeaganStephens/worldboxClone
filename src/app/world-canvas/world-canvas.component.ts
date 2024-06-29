import { Component, HostListener, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2 } from '@angular/core';
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
  // windowWidth!: number;
  // windowHeight!: number;
  activeKeys: Set<string> = new Set();
  scaleValue = 2; 

  @ViewChild('gameCanvas') gameCanvas!: ElementRef;
  @ViewChild('gameCanvasDraw') gameCanvasDraw!: ElementRef;
  @ViewChild('gameCanvasGrid') gameCanvasGrid!: ElementRef;

  constructor(
    private npcService: NpcService,
    private drawing: TestDrawing,
    private worldGrid : worldGridCells,
    private renderer: Renderer2
  ){}

  ngOnInit(): void {
    this.scaleValue = this.worldGrid.getScaleValue()
    this.initializeOverWorld();
    // this.windowDimensions()
    this.startGameLoop();
  }

  ngAfterViewInit(): void {
    this.scaleCanvasAll();
  }

  scaleCanvasAll() {
    this.scaleCanvas(this.gameCanvas, this.scaleValue);
    this.scaleCanvas(this.gameCanvasDraw, this.scaleValue);
    this.scaleCanvas(this.gameCanvasGrid, this.scaleValue);
  }

  scaleCanvas(canvas: ElementRef, scale: number) {
    this.renderer.setStyle(canvas.nativeElement, 'transform', `translate(-50%, -50%) scale(${scale})`);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // this.windowDimensions()
  }

  // @HostListener('window:keydown', ['$event']) //todo: fix the way movement of chosen npc works, when holding down the moving key and then letting go. It moves one more than expected.
  // handleKeyDown(event: KeyboardEvent) {
  //   console.log(event.key)
  //   this.npcService.moveNpc(this.npcService.listOfNpc[0], event.key)
  // }

  @HostListener('window:keydown', ['$event']) 
  handleKeyDown(event: KeyboardEvent) {
    this.activeKeys.add(event.key.toLowerCase());
    this.handleMovement();
  }

  @HostListener('window:keyup', ['$event']) 
  handleKeyUp(event: KeyboardEvent) {
    this.activeKeys.delete(event.key.toLowerCase());
  }

  handleMovement() {
    const npc = this.npcService.listOfNpc[0];
    const keys = Array.from(this.activeKeys);
    
    // Log keys for debugging
    console.log(keys);

    if (keys.includes('arrowup') || keys.includes('w')) {
      if (keys.includes('arrowright') || keys.includes('d')) {
        this.npcService.moveNpc(npc, 'ArrowUpArrowRight');
      } else if (keys.includes('arrowleft') || keys.includes('a')) {
        this.npcService.moveNpc(npc, 'ArrowUpArrowLeft');
      } else {
        this.npcService.moveNpc(npc, 'ArrowUp');
      }
    } else if (keys.includes('arrowdown') || keys.includes('s')) {
      if (keys.includes('arrowright') || keys.includes('d')) {
        this.npcService.moveNpc(npc, 'ArrowDownArrowRight');
      } else if (keys.includes('arrowleft') || keys.includes('a')) {
        this.npcService.moveNpc(npc, 'ArrowDownArrowLeft');
      } else {
        this.npcService.moveNpc(npc, 'ArrowDown');
      }
    } else if (keys.includes('arrowright') || keys.includes('d')) {
      this.npcService.moveNpc(npc, 'ArrowRight');
    } else if (keys.includes('arrowleft') || keys.includes('a')) {
      this.npcService.moveNpc(npc, 'ArrowLeft');
    }
  }

  @HostListener('click', ['$event'])
  gridClick(event: MouseEvent): void {
    this.drawing.startPainting(event);
    this.drawing.sketch(event);
    this.drawing.stopPainting();
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  startPainting(event: MouseEvent | TouchEvent): void {
    this.drawing.startPainting(event);
  }

  @HostListener('mouseup')
  @HostListener('touchend')
  stopPainting(): void {
    this.drawing.stopPainting();
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  sketch(event: MouseEvent): void {
    this.drawing.sketch(event);
  }

  initializeOverWorld() {
    // debugger
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

  // windowDimensions(){
  //   this.windowWidth = window.innerWidth;
  //   this.windowHeight = window.innerHeight;
  //   this.drawing.getWindowDimensions(this.windowWidth, this.windowHeight)
  // }

  onColorChange(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.drawing.setStrokeStyle(color);
  }

  getCurrentScale(){
    return this.scaleValue;
  }
}