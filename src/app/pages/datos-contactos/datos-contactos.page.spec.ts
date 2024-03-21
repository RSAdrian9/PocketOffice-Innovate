import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosContactosPage } from './datos-contactos.page';

describe('DatosContactosPage', () => {
  let component: DatosContactosPage;
  let fixture: ComponentFixture<DatosContactosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DatosContactosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
