import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MayorDatosPage } from './mayor-datos.page';

describe('MayorDatosPage', () => {
  let component: MayorDatosPage;
  let fixture: ComponentFixture<MayorDatosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MayorDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
