import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RentabilidadPage } from './rentabilidad.page';

describe('RentabilidadPage', () => {
  let component: RentabilidadPage;
  let fixture: ComponentFixture<RentabilidadPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RentabilidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
