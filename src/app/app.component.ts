import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorldCanvasComponent } from './world-canvas/world-canvas.component';
import { TestScaleCanvasComponent } from './test-scale-canvas/test-scale-canvas.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WorldCanvasComponent,
    TestScaleCanvasComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'worldboxClone';
}
