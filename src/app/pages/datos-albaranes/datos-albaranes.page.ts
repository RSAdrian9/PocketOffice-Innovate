import { Component, OnInit } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { albaranes } from 'src/app/model/albaranes';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { PdfPage } from '../pdf/pdf.page';

@Component({
  selector: 'app-datos-albaranes',
  templateUrl: './datos-albaranes.page.html',
  styleUrls: ['./datos-albaranes.page.scss'],
})
export class DatosAlbaranesPage implements OnInit {
  albaran:albaranes
  constructor(private platform: Platform,
    private navC: NavController,
    private navParams: NavParams,
    private transferir:TransferirDatosService,
    private webview: WebView,
    private modalController: ModalController) { }

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
  ngOnInit() {
    this.albaran = this.navParams.get("datosAlbaran")
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.back()
    });
  }
  public exit() {
    this.modalController.dismiss();
  }
}
