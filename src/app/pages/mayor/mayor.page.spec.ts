import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MayorPage } from './mayor.page';

describe('MayorPage', () => {
  let component: MayorPage;
  let fixture: ComponentFixture<MayorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MayorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
