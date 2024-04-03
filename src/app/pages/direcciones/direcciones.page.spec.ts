import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DireccionesPage } from './direcciones.page';

describe('DireccionesPage', () => {
  let component: DireccionesPage;
  let fixture: ComponentFixture<DireccionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DireccionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
