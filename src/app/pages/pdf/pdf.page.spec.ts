import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfPage } from './pdf.page';

describe('PdfPage', () => {
  let component: PdfPage;
  let fixture: ComponentFixture<PdfPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PdfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
