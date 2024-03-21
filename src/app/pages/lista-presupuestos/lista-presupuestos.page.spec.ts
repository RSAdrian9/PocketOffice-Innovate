import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPresupuestosPage } from './lista-presupuestos.page';

describe('ListaPresupuestosPage', () => {
  let component: ListaPresupuestosPage;
  let fixture: ComponentFixture<ListaPresupuestosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaPresupuestosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
