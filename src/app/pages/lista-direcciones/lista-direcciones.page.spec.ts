import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaDireccionesPage } from './lista-direcciones.page';

describe('ListaDireccionesPage', () => {
  let component: ListaDireccionesPage;
  let fixture: ComponentFixture<ListaDireccionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaDireccionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
