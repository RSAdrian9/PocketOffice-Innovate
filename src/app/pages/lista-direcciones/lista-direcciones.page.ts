import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { direccion } from 'src/app/model/direccion';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { DatosDireccionesPage } from '../datos-direcciones/datos-direcciones.page';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-lista-direcciones',
  templateUrl: './lista-direcciones.page.html',
  styleUrls: ['./lista-direcciones.page.scss'],
})
export class ListaDireccionesPage implements OnInit {
  direcciones: direccion[] = []
  nom
  clienteAux: any
  tipo: String
  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private present: PresentService,
    private navC: NavController,
    private db: DbService,
    private transferir: TransferirDatosService) { }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateForward("vista-cliente")
    });
  }

  async ionViewDidEnter() {
    this.direcciones=[]
    await this.loadAll();
  }

  public async loadAll() {
    try {
      this.transferir.$getObjectSource.subscribe(datos => {
        this.tipo = datos.title
        this.clienteAux = datos.cliente
        if(this.tipo=="Clientes"){
          this.nom=datos.cliente.nom
          this.db.getDirecciones('CL',this.clienteAux.cod).then(direcciones=>{
            this.direcciones = direcciones
          })
        }else{
          this.nom=datos.cliente.nom
          this.db.getDirecciones('PR',this.clienteAux.cod).then(direcciones=>{
            this.direcciones = direcciones
          })
        }
      })
    } catch (err) {
       await this.present.presentToast("Error al cargar los Direcciones", "danger");
    }
  }

  async vistaContacto(d: direccion) {
    await this.openDatosContacto(d);
    await this.loadAll();
  }

  async openDatosContacto(d?: direccion): Promise<any> {
    const modal = await this.modalController.create({
      component: DatosDireccionesPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "datosDireccion": d
      }
    });
    await modal.present();
    return await modal.onWillDismiss();
  }


}
