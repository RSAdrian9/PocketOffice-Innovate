import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosPresupuestosPage } from './datos-presupuestos.page';

describe('DatosPresupuestosPage', () => {
  let component: DatosPresupuestosPage;
  let fixture: ComponentFixture<DatosPresupuestosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DatosPresupuestosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
