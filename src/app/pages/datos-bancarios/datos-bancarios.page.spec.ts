import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosBancariosPage } from './datos-bancarios.page';

describe('DatosBancariosPage', () => {
  let component: DatosBancariosPage;
  let fixture: ComponentFixture<DatosBancariosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DatosBancariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
