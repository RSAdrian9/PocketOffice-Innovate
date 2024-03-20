import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, Platform } from '@ionic/angular';
import { contacto } from 'src/app/model/contacto';
import { CallService } from 'src/app/services/call.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-datos-contactos',
  templateUrl: './datos-contactos.page.html',
  styleUrls: ['./datos-contactos.page.scss'],
})
export class DatosContactosPage implements OnInit {
  contacto: contacto;
  constructor(private platform: Platform,
    private navC: NavController,
    private navParams: NavParams,
    private transferir: TransferirDatosService,
    private utils:UtilitiesService,
    private modalController: ModalController,
    private callS: CallService) {

  }

  ngOnInit() {
    this.contacto = this.navParams.get("datosContacto")
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
  
  mailto(email) {
    window.open(`mailto:${email}`, '_system');
 }

  public exit() {
    this.modalController.dismiss();
  }
}
