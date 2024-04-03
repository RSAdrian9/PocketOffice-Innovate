import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaProveedorPage } from './vista-proveedor.page';

describe('VistaProveedorPage', () => {
  let component: VistaProveedorPage;
  let fixture: ComponentFixture<VistaProveedorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VistaProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
