import { Component, HostListener, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2, PLATFORM_ID, Inject } from '@angular/core';
import { OverWorld, OverWorldNpcConfig} from '../../classes/overWorld';
import { NpcService } from '../../services/npc.service';
import { TestDrawing } from '../../services/testDrawing.service';
import { worldGridCells } from '../../services/gridCells.service';
import { TerrainId, TERRAIN_LIST, DEFAULT_TERRAIN } from '../../models/terrain.model';
import { CANVAS_SIZE } from '../../models/world.config';
import { isPlatformBrowser, NgFor } from '@angular/common';

@Component({
  selector: 'app-world-canvas',
  standalone: true,
  imports: [NgFor],
  templateUrl: './world-canvas.component.html',
  styleUrls: ['./world-canvas.component.css'] // Fixed typo: styleUrl to styleUrls
})
export class WorldCanvasComponent implements OnInit, OnDestroy  {
  private overWorld!: OverWorld;
  windowWidth!: number;
  windowHeight!: number;
  activeKeys: Set<string> = new Set();
  scaleValue = 2; 
  translateX = 50;
  translateY = 50;
  scaleChanged : boolean = false;

  top = 50;
  left = 50;
  rectOriginalTop : any;
  rectOriginalLeft : any;

  topInPx = 0;
  leftInPx = 0;

  mousePosition = {
    x : 0,
    y : 0
  }

  debug = false;
  currentTool: 'brush' | 'eraser' = 'brush';
  terrains = TERRAIN_LIST;
  currentTerrain: TerrainId = DEFAULT_TERRAIN;

  private isBrowser: boolean;
  private waterInterval?: ReturnType<typeof setInterval>;

  @ViewChild('gameCanvas') gameCanvas!: ElementRef;
  @ViewChild('gameCanvasDraw') gameCanvasDraw!: ElementRef;

  constructor(
    private npcService: NpcService,
    private drawing: TestDrawing,
    private worldGrid : worldGridCells,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ){this.isBrowser = isPlatformBrowser(this.platformId);}

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.scaleValue = this.worldGrid.getScaleValue()
    this.initializeOverWorld();
    this.windowDimensions()
    this.startGameLoop();
    window.addEventListener('wheel', this.handleWheelEvent, { passive: false });
    window.addEventListener('gesturestart', this.handleGestureEvent, { passive: false });
    window.addEventListener('gesturechange', this.handleGestureEvent, { passive: false });
    window.addEventListener('gestureend', this.handleGestureEvent, { passive: false });
    this.updateScaleValue(this.computeFitScale())
    this.waterInterval = setInterval(() => this.worldGrid.renderWaterTiles(), 250);
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      window.removeEventListener('wheel', this.handleWheelEvent);
      window.removeEventListener('gesturestart', this.handleGestureEvent);
      window.removeEventListener('gesturechange', this.handleGestureEvent);
      window.removeEventListener('gestureend', this.handleGestureEvent);
      if (this.waterInterval !== undefined) clearInterval(this.waterInterval);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.scaleCanvasAll();
  }

  scaleCanvasAll() {
    this.scaleCanvas(this.gameCanvas, this.scaleValue, this.translateX, this.translateY);
    this.scaleCanvas(this.gameCanvasDraw, this.scaleValue, this.translateX, this.translateY);
  }

  scaleCanvas(canvas: ElementRef, scale: number, translateX: number, translateY: number) {
    this.renderer.setStyle(canvas.nativeElement, 'transform', `translate(${translateX}%, ${translateY}%) scale(${scale})`);
    this.renderer.setStyle(canvas.nativeElement, 'top', `${this.top}%`)
    this.renderer.setStyle(canvas.nativeElement, 'left', `${this.left}%`)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (!this.isBrowser) return;
    this.windowDimensions();
    this.updateScaleValue(this.computeFitScale());
  }

  computeFitScale(): number {
    return Math.min(this.windowWidth, this.windowHeight) / CANVAS_SIZE;
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
    // this.mousePosition.x = event.clientX;
    // this.mousePosition.y = event.clientY;
    this.drawing.sketch(event);
  }

  initializeOverWorld() {
    const element = document.querySelector('.canvasContainer') as HTMLElement;
    const overNpcConfig: OverWorldNpcConfig = { element, canvas: 'gameCanvas' };
    const overTerrainConfig: OverWorldNpcConfig = { element, canvas: 'gameCanvasDraw' };

    const terrainOverWorld = new OverWorld(overTerrainConfig);
    this.overWorld = new OverWorld(overNpcConfig);
    terrainOverWorld.canvas.width = CANVAS_SIZE;
    terrainOverWorld.canvas.height = CANVAS_SIZE;
    this.overWorld.canvas.width = CANVAS_SIZE;
    this.overWorld.canvas.height = CANVAS_SIZE;
    this.drawing.initDrawing(terrainOverWorld);
    this.worldGrid.initWorldGrid(terrainOverWorld);
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
    // debugger
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.mousePosition.x = this.windowWidth / 2
    this.mousePosition.y = this.windowHeight/ 2

    this.topInPx = (50 / 100) * this.windowHeight;
    this.leftInPx = (50 / 100) * this.windowWidth;
  }

  handleWheelEvent = (event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault();
      this.scaleChanged = true;

      let rect = this.worldGrid.getOverWorldCanvas().canvas.getBoundingClientRect()
      let test = event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientX < rect.bottom
      if(event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientX < rect.bottom){
        
        let height = (this.windowHeight - rect.height) / 2;
        let width = (this.windowWidth - rect.width) / 2;
        
        if (event instanceof MouseEvent) {
          this.mousePosition.x = (event.clientX - rect.left) + width;
          this.mousePosition.y = (event.clientY - rect.top) + height;
        }
        if (event.deltaY < 0) {
          this.updateScaleValue(this.scaleValue + 0.05); 
        } else if (event.deltaY > 0) {
          this.updateScaleValue(this.scaleValue - 0.05); 
        }
      }
    }else{
      // debugger
      console.log(this.top)
      
      this.top = this.top + (event.deltaY * -1) / (16 / this.scaleValue);
      this.left = this.left + (event.deltaX * -1) / (16 / this.scaleValue);
      this.scaleCanvasAll();
    }
  };

  handleGestureEvent = (event: Event) => {
    event.preventDefault();
  };

  updateScaleValue(value: number = this.scaleValue) {
    this.translateX = -50;
    this.translateY = -50;

    let diffX = this.mousePosition.x - (this.windowWidth / 2);
    let diffY = this.mousePosition.y - (this.windowHeight / 2);

    this.top = (this.topInPx + (diffY * -1)) / this.windowHeight * 100;
    this.left = (this.leftInPx + (diffX * -1)) / this.windowWidth * 100;
    
    this.scaleValue = Math.max(0.1, Math.min(value, 10)); 
    this.scaleCanvasAll();
    this.worldGrid.updateScaleValue(this.scaleValue);
    console.log(`Scale value updated to: ${this.scaleValue}`);
  }

  setTerrain(terrain: TerrainId) {
    this.currentTerrain = terrain;
    this.drawing.setTerrain(terrain);
    this.setTool('brush');
  }

  setTool(tool: 'brush' | 'eraser') {
    this.currentTool = tool;
    this.drawing.setTool(tool);
  }

  toggleDebug() {
    this.debug = !this.debug;
    this.worldGrid.setDisplayGrid(this.debug);
  }

  zoomIn() {
    this.updateScaleValue(this.scaleValue + 0.1);
  }

  zoomOut() {
    this.updateScaleValue(this.scaleValue - 0.1);
  }

  resetZoom() {
    this.updateScaleValue(this.computeFitScale());
  }

  getCurrentScale(){
    return this.scaleValue;
  }
}