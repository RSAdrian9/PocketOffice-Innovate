import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EfectosPage } from './efectos.page';

describe('EfectosPage', () => {
  let component: EfectosPage;
  let fixture: ComponentFixture<EfectosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EfectosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
