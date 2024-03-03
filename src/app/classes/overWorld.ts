export interface OverWorldConfig {
    element: HTMLElement,
    canvas: string,
    src : string
  };
  
  export class OverWorld {
    private element: HTMLElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private src: string;
  
    constructor(config: OverWorldConfig) {
      this.element = config.element;
      this.canvas = this.element.querySelector(`.${config.canvas}`) as HTMLCanvasElement;
      this.ctx = this.canvas.getContext('2d')!;
      this.src = config.src;
    }
  
    init(): void {
      const image = new Image();
      image.onload = () => {
        this.ctx.drawImage(image, 0, 0);
      }
      image.src = this.src;
    }
  }
  