import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenMensualVentasPage } from './resumen-mensual-ventas.page';

describe('ResumenMensualVentasPage', () => {
  let component: ResumenMensualVentasPage;
  let fixture: ComponentFixture<ResumenMensualVentasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResumenMensualVentasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
