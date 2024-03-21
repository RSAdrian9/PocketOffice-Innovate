import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosAlbaranesPage } from './datos-albaranes.page';

describe('DatosAlbaranesPage', () => {
  let component: DatosAlbaranesPage;
  let fixture: ComponentFixture<DatosAlbaranesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DatosAlbaranesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
