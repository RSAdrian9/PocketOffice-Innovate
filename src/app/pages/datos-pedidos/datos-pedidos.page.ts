import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { pedidos } from 'src/app/model/pedidos';
import { PdfPage } from '../pdf/pdf.page';

@Component({
  selector: 'app-datos-pedidos',
  templateUrl: './datos-pedidos.page.html',
  styleUrls: ['./datos-pedidos.page.scss'],
})
export class DatosPedidosPage implements OnInit {
  pedido:pedidos
  tipo
  constructor(private platform: Platform,
    private navC: NavController,
    private navParams: NavParams,
    private modalController: ModalController) { }

  ngOnInit() {
    this.pedido = this.navParams.get("datosPedido") 
    this.tipo = this.navParams.get("tipo")              
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
    await this.open(ruta)
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
