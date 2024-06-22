export interface OverWorldNpcConfig {
    element: HTMLElement,
    canvas: string,
  };
  
export class OverWorld {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(config: OverWorldNpcConfig) {
    this.element = config.element;
    this.canvas = this.element.querySelector(`.${config.canvas}`) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
  }

  clearCanvas(){ 
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
  }

  renderNpc(
      clearCanvas : boolean = false,
      img : string = "../../assets/img/pixilart-drawing.png",
      currentX : number = 0,
      currentY : number = 0,
      leftCut : number = 0,
      topCut : number = 0,
      widthOfCut : number = 12,  
      heightOfCut : number = 12,
      sizeToDraw1 : number = 12,
      sizeToDraw2 : number = 12
    ){ //pass in parameters for npc to enhance multiple npc 
    const hero = new Image();
    hero.onload = () => {
      if(clearCanvas) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); 
      this.ctx.imageSmoothingEnabled = false; 
      this.ctx.drawImage(
          hero,
            leftCut, //left cut
            topCut, //top  cut
            12, //width of cut
            12, //height of cut 
            currentX - 1, //x position on canvas 
            currentY - 2, //y position on canvas
            12, //size to draw
            12 //size to draw
          );
    }
    hero.src = img;
  }

  renderFloorTile(
    overWord : OverWorld, 
    clearCanvas : boolean = false,
    img : string = "../../assets/img/dirtBlock.png",
    currentX : number = 0,
    currentY : number = 0,
    leftCut : number = 0,
    topCut : number = 0,
    widthOfCut : number = 18,  
    heightOfCut : number = 18,
    sizeToDraw1 : number = 18 * 1.7,
    sizeToDraw2 : number = 18 * 1.7
  ){ //pass in parameters for npc to enhance multiple npc 
  const hero = new Image();
  hero.onload = () => {
    if(clearCanvas) overWord.ctx.clearRect(0, 0, overWord.canvas.width, overWord.canvas.height); 
    overWord.ctx.imageSmoothingEnabled = false; 
    overWord.ctx.drawImage(
        hero,
          leftCut, //left cut
          topCut, //top  cut
          widthOfCut, //width of cut
          heightOfCut, //height of cut 
          currentX - 5, //x position on canvas 
          currentY - 5, //y position on canvas
          sizeToDraw1, //size to draw
          sizeToDraw2 //size to draw
        );
  }
  hero.src = img;
}

}
