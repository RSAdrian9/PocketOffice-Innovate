import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDireccionesPage } from './datos-direcciones.page';

describe('DatosDireccionesPage', () => {
  let component: DatosDireccionesPage;
  let fixture: ComponentFixture<DatosDireccionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DatosDireccionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
