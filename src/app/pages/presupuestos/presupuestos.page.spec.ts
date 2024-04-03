import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresupuestosPage } from './presupuestos.page';

describe('PresupuestosPage', () => {
  let component: PresupuestosPage;
  let fixture: ComponentFixture<PresupuestosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PresupuestosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
