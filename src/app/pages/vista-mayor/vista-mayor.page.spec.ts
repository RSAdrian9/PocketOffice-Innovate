import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaMayorPage } from './vista-mayor.page';

describe('VistaMayorPage', () => {
  let component: VistaMayorPage;
  let fixture: ComponentFixture<VistaMayorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VistaMayorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
