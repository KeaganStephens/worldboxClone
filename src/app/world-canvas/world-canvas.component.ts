import { Component, OnInit } from '@angular/core';
import { OverWorld, OverWorldConfig } from '../classes/overWorld';

@Component({
  selector: 'app-world-canvas',
  standalone: true,
  imports: [],
  templateUrl: './world-canvas.component.html',
  styleUrl: './world-canvas.component.css'
})
export class WorldCanvasComponent implements OnInit{

  ngOnInit(): void {
    const overWorldConfig: OverWorldConfig = {
      element: document.querySelector(".canvasContainer") as HTMLElement,
      canvas: 'gameCanvas',
      src : "../../assets/img/pixilart-drawing.png"
    };

    const overWorld = new OverWorld(overWorldConfig);
    overWorld.init();
  }

}
