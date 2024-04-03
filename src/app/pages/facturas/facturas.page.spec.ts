import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacturasPage } from './facturas.page';

describe('FacturasPage', () => {
  let component: FacturasPage;
  let fixture: ComponentFixture<FacturasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FacturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
