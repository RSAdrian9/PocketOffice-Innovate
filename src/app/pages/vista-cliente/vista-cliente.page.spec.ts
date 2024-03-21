import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaClientePage } from './vista-cliente.page';

describe('VistaClientePage', () => {
  let component: VistaClientePage;
  let fixture: ComponentFixture<VistaClientePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VistaClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
