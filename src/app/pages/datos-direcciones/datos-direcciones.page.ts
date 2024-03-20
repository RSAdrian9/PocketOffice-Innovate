import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { direccion } from 'src/app/model/direccion';
import { CallService } from 'src/app/services/call.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-datos-direcciones',
  templateUrl: './datos-direcciones.page.html',
  styleUrls: ['./datos-direcciones.page.scss'],
})
export class DatosDireccionesPage implements OnInit {
  direccion: direccion;
  constructor(private platform: Platform,
    private navC: NavController,
    private navParams: NavParams,
    private transferir:TransferirDatosService,
    private utils:UtilitiesService,
    private modalController: ModalController,
    private callS: CallService) { }

  ngOnInit() {
    this.direccion = this.navParams.get("datosDireccion")
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.back()
    });
  }
  valid(e:String){
    return this.utils.valid(e)
  }
  callNumber(numbre: string) {
    this.callS.call(numbre)
  }

  public exit() {
    this.modalController.dismiss();
  }
}
