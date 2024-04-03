import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbaranesPage } from './albaranes.page';

describe('AlbaranesPage', () => {
  let component: AlbaranesPage;
  let fixture: ComponentFixture<AlbaranesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AlbaranesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
