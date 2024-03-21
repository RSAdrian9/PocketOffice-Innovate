import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosFacturasPage } from './datos-facturas.page';

describe('DatosFacturasPage', () => {
  let component: DatosFacturasPage;
  let fixture: ComponentFixture<DatosFacturasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DatosFacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
