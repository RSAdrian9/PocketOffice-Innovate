import { Component, OnInit } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { facturas } from 'src/app/model/facturas';
import { PdfService } from 'src/app/services/pdf.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { PdfPage } from '../pdf/pdf.page';

@Component({
  selector: 'app-datos-facturas',
  templateUrl: './datos-facturas.page.html',
  styleUrls: ['./datos-facturas.page.scss'],
})
export class DatosFacturasPage implements OnInit {
  facturas: facturas
  constructor(private platform: Platform,
    private navC: NavController,
    private navParams: NavParams,
    private transferir: TransferirDatosService,
    private modalController: ModalController,
    private webview: WebView,
    private pdfS: PdfService) { }

  ngOnInit() {
    this.facturas = this.navParams.get("datosFacturas")
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.back()
    });
  }

  valid(e: String) {
    let flag = false;
    if (e == "1") {
      flag = false
    } else {
      flag = true
    }
    return flag
  }
  
  async openPDF(ruta: string) {
    let pdf=this.webview.convertFileSrc(ruta)
    await this.open(pdf)
  }
  async open(pdf): Promise<any> {
    const modal = await this.modalController.create({
      component: PdfPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "pdf": pdf
      }
    });
    await modal.present();
    return await modal.onWillDismiss();
  }
  public exit() {
    this.modalController.dismiss();
  }
}
