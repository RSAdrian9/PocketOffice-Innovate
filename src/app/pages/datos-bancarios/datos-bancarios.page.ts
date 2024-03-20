import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { banco } from 'src/app/model/banco';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';

@Component({
  selector: 'app-datos-bancarios',
  templateUrl: './datos-bancarios.page.html',
  styleUrls: ['./datos-bancarios.page.scss'],
})
export class DatosBancariosPage implements OnInit {
  banco: banco;
  constructor(private platform: Platform,
    private navC: NavController,
    private navParams: NavParams,
    private transferir: TransferirDatosService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.banco = this.navParams.get("datosBanco")
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.back()
    });
  }


  public exit() {
    this.modalController.dismiss();
  }
}
