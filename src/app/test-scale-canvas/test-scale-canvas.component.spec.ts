import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestScaleCanvasComponent } from './test-scale-canvas.component';

describe('TestScaleCanvasComponent', () => {
  let component: TestScaleCanvasComponent;
  let fixture: ComponentFixture<TestScaleCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestScaleCanvasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestScaleCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
