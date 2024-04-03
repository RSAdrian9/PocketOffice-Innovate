import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BancosPage } from './bancos.page';

describe('BancosPage', () => {
  let component: BancosPage;
  let fixture: ComponentFixture<BancosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BancosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
