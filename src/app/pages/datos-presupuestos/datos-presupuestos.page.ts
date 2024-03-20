import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { presupuestos } from 'src/app/model/presupuestos';
import { PdfPage } from '../pdf/pdf.page';

@Component({
  selector: 'app-datos-presupuestos',
  templateUrl: './datos-presupuestos.page.html',
  styleUrls: ['./datos-presupuestos.page.scss'],
})
export class DatosPresupuestosPage implements OnInit {
  presupuesto:presupuestos
  constructor(private platform: Platform,
    private navC: NavController,
    private navParams: NavParams,
    private modalController: ModalController) { }

    ngOnInit() {
      this.presupuesto = this.navParams.get("datosPresupuesto")                
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
