export interface OverWorldNpcConfig {
    element: HTMLElement,
    canvas: string,
  };
  
export class OverWorld {
  private element: HTMLElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(config: OverWorldNpcConfig) {
    this.element = config.element;
    this.canvas = this.element.querySelector(`.${config.canvas}`) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
  }

  init(): void {
  }

  renderNpc(
      img : string = "../../assets/img/pixilart-drawing.png",
      currentX : number = 0,
      currentY : number = 0,
      leftCut : number = 0,
      topCut : number = 0,
      widthOfCut : number = 12,  
      heightOfCut : number = 12,
      sizeToDraw1 : number = 12,
      sizeToDraw2 : number = 12,
    ){ //pass in parameters for npc to enhance multiple npc 
    const hero = new Image();
    hero.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
      this.ctx.imageSmoothingEnabled = false; 
      this.ctx.drawImage(
          hero,
            leftCut, //left cut
            topCut, //top  cut
            12, //width of cut
            12, //height of cut 
            currentX, //x position on canvas 
            currentY, //y position on canvas
            12, //size to draw
            12 //size to draw
          );
    }
    hero.src = img;
  }

  clearCanvas(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}
