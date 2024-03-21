import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosPedidosPage } from './datos-pedidos.page';

describe('DatosPedidosPage', () => {
  let component: DatosPedidosPage;
  let fixture: ComponentFixture<DatosPedidosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DatosPedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
