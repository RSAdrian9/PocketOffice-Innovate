import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { efectos } from 'src/app/model/efectos';

@Component({
  selector: 'app-efectos-datos',
  templateUrl: './efectos-datos.page.html',
  styleUrls: ['./efectos-datos.page.scss'],
})
export class EfectosDatosPage implements OnInit {
  efecto: efectos
  tipo
  constructor(private platform: Platform,
    private navC: NavController,
    private navParams: NavParams,
    private modalController: ModalController) { }

  ngOnInit() {
    this.efecto = this.navParams.get("datosEfecto")
    this.tipo = this.navParams.get("tipo")
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.back()
    });
  }
  public exit() {
    this.modalController.dismiss();
  }
}
