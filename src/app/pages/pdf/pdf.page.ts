import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
const ZOOM_STEP:number = 0.25;
const DEFAULT_ZOOM:number = 1;

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.page.html',
  styleUrls: ['./pdf.page.scss'],
})
export class PdfPage implements OnInit {
  pdf
  public pdfZoom:number = DEFAULT_ZOOM;
  url: SafeResourceUrl;
  constructor(private platform: Platform,
    private navC: NavController,
    private navParams: NavParams,
    private modalController: ModalController,
    private sanitizer: DomSanitizer) { 
      
    }
    public zoomIn()
    {
      this.pdfZoom += ZOOM_STEP;
    }
  
    public zoomOut()
    {
      if (this.pdfZoom > DEFAULT_ZOOM) {
        this.pdfZoom -= ZOOM_STEP;
      }
    }
  
    public resetZoom()
    {
      this.pdfZoom = DEFAULT_ZOOM;
    }
  ngOnInit() {
    this.pdf = this.navParams.get("pdf")    
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.back()
    });
  }
/*  transform() {
    this.url= this.sanitizer.bypassSecurityTrustResourceUrl('https://appgp.mjhudesings.com/documentos/clientes/100023/FACTURA%20NUMERO%20%201-000173.PDF');
  }*/
  public exit() {
    this.modalController.dismiss();
  }
}
