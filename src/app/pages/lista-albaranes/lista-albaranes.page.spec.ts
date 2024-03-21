import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaAlbaranesPage } from './lista-albaranes.page';

describe('ListaAlbaranesPage', () => {
  let component: ListaAlbaranesPage;
  let fixture: ComponentFixture<ListaAlbaranesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaAlbaranesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
