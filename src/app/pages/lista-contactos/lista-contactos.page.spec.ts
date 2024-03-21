import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaContactosPage } from './lista-contactos.page';

describe('ListaContactosPage', () => {
  let component: ListaContactosPage;
  let fixture: ComponentFixture<ListaContactosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaContactosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
