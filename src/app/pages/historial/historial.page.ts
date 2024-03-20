import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { cliente } from 'src/app/model/cliente';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  cliente: any
  nom
  constructor(
    private platform: Platform,
    private navC: NavController,
    private transferir: TransferirDatosService) { }

  ngOnInit() {    
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateForward("vista-cliente")
    });
    this.transferir.$getObjectSource.subscribe(res => {
      this.nom=res.cliente.nom
      this.cliente = res.cliente
    })
  }

}
