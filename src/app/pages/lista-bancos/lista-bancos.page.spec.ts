import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaBancosPage } from './lista-bancos.page';

describe('ListaBancosPage', () => {
  let component: ListaBancosPage;
  let fixture: ComponentFixture<ListaBancosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListaBancosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
