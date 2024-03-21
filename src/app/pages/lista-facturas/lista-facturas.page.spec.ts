import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaFacturasPage } from './lista-facturas.page';

describe('ListaFacturasPage', () => {
  let component: ListaFacturasPage;
  let fixture: ComponentFixture<ListaFacturasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaFacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
