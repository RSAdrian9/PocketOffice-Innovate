import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaEfectoPage } from './vista-efecto.page';

describe('VistaEfectoPage', () => {
  let component: VistaEfectoPage;
  let fixture: ComponentFixture<VistaEfectoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VistaEfectoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
