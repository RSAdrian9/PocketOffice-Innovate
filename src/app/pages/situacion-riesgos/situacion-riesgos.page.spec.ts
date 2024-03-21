import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SituacionRiesgosPage } from './situacion-riesgos.page';

describe('SituacionRiesgosPage', () => {
  let component: SituacionRiesgosPage;
  let fixture: ComponentFixture<SituacionRiesgosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SituacionRiesgosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
