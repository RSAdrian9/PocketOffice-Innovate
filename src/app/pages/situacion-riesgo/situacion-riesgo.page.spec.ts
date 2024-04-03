import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SituacionRiesgoPage } from './situacion-riesgo.page';

describe('SituacionRiesgoPage', () => {
  let component: SituacionRiesgoPage;
  let fixture: ComponentFixture<SituacionRiesgoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SituacionRiesgoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
