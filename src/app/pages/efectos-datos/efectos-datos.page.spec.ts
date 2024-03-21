import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EfectosDatosPage } from './efectos-datos.page';

describe('EfectosDatosPage', () => {
  let component: EfectosDatosPage;
  let fixture: ComponentFixture<EfectosDatosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EfectosDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
