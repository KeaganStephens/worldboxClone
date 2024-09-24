import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-scale-canvas',
  standalone: true,
  imports: [],
  templateUrl: './test-scale-canvas.component.html',
  styleUrl: './test-scale-canvas.component.css'
})
export class TestScaleCanvasComponent implements OnInit {

  canvasDimension = 2560;
  canvasScale = 0.1;
  increaseCanvasScale = 0.010;

  ngOnInit(): void {
    let gameCanvas = document.getElementById('gameCanvas')
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if(gameCanvas){
      gameCanvas.style.height = this.formatStylePx(this.canvasDimension);
      gameCanvas.style.width = this.formatStylePx(this.canvasDimension);
      gameCanvas.style.transform = `scale(${this.canvasScale})`;

      let canvasDimensionScaled = this.canvasDimension * this.canvasScale;

      let mapAreaTop = (windowHeight / 2) - canvasDimensionScaled / 2;
      let mapAreaLeft = (windowWidth / 2) - canvasDimensionScaled / 2;

      this.setCanvasPosition(gameCanvas, mapAreaTop, mapAreaLeft);

      gameCanvas.addEventListener('click', (event) => {
        let newCanvasScale = this.canvasScale + this.increaseCanvasScale;

        let windowClickPointX = event.clientX;
        let windowClickPointY = event.clientY;

        let canvasFromLeft = ( ( windowWidth - canvasDimensionScaled ) / 2)
        let canvasFromTop = ( ( windowHeight - canvasDimensionScaled ) / 2)

        let mapClickPointX = windowClickPointX - canvasFromLeft;
        let mapClickPointY = windowClickPointY - canvasFromTop;

        let nextMapClickPointX = (mapClickPointX / this.canvasScale) * newCanvasScale;
        let nextMapClickPointY = (mapClickPointY / this.canvasScale) * newCanvasScale;

        let diffScaledCanvasX = nextMapClickPointX - mapClickPointX;
        let diffScaledCanvasY = nextMapClickPointY - mapClickPointY;

        mapAreaLeft = mapAreaLeft - diffScaledCanvasX;
        mapAreaTop =  mapAreaTop - diffScaledCanvasY;
        
        canvasDimensionScaled = this.canvasDimension * newCanvasScale;

        this.canvasScale = newCanvasScale;
        if(gameCanvas){
          gameCanvas.style.backgroundColor = 'blue';
          gameCanvas.style.transform = `scale(${this.canvasScale})`;
          this.setCanvasPosition(gameCanvas, mapAreaTop, mapAreaLeft);
        }
      })
    }
  }

  formatStylePx(number : number){
    return `${number}px`
  }

  setCanvasPosition(canvas : HTMLElement ,mapAreaTop : number, mapAreaLeft : number) {
    let canvasDimensionScaled = this.canvasDimension * this.canvasScale;
    let canvasAlignTop = -((this.canvasDimension - canvasDimensionScaled) / 2);
    let canvasAlignLeft = -((this.canvasDimension - canvasDimensionScaled) / 2);

    let mapAreaTopDisplay = canvasAlignTop + mapAreaTop;
    let mapAreaLeftDisplay = canvasAlignLeft + mapAreaLeft;

    canvas.style.top = this.formatStylePx(mapAreaTopDisplay);
    canvas.style.left = this.formatStylePx(mapAreaLeftDisplay);
  }

}
