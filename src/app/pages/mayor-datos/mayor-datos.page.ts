import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { mayor } from 'src/app/model/mayor';

@Component({
  selector: 'app-mayor-datos',
  templateUrl: './mayor-datos.page.html',
  styleUrls: ['./mayor-datos.page.scss'],
})
export class MayorDatosPage implements OnInit {
  mayor: mayor
  constructor(private platform: Platform,
    private navC: NavController,
    private navParams: NavParams,
    private modalController: ModalController) { }

    ngOnInit() {
      this.mayor = this.navParams.get("datosMayor")
      console.log(this.mayor);
      
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.navC.back()
      });
    }
    public exit() {
      this.modalController.dismiss();
    }

}
