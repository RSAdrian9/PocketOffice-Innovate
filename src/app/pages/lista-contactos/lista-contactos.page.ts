import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { contacto } from 'src/app/model/contacto';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { DatosContactosPage } from '../datos-contactos/datos-contactos.page';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-lista-contactos',
  templateUrl: './lista-contactos.page.html',
  styleUrls: ['./lista-contactos.page.scss'],
})
export class ListaContactosPage implements OnInit {
  contactos:contacto[]=[]
  nom
  clienteAux: any
  tipo: String
  constructor(
    private transferir: TransferirDatosService,
    private modalController: ModalController,
    private present: PresentService,
    private platform: Platform,
    private db: DbService,
    private navC: NavController) { }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateForward("vista-cliente")
    });
  }

  async ionViewDidEnter() {
    this.contactos=[]
    await this.loadAll();
  }

  public async loadAll() {
    try {
      this.transferir.$getObjectSource.subscribe(datos => {
        this.tipo = datos.title
        this.clienteAux = datos.cliente
        
        if(this.tipo=="Clientes"){
          this.nom=datos.cliente.nom
          this.db.getContactos('CL',this.clienteAux.cod).then(contactos=>{
            this.contactos = contactos
          })
        }else{
          this.nom=datos.cliente.nom
          this.db.getContactos('PR',this.clienteAux.cod).then(contactos=>{
            this.contactos = contactos
          })
        }        
      })
    } catch (err) {
        await this.present.presentToast("Error al cargar los Contactos", "danger");
    }
  }

  async vistaContacto(c: contacto) {
    await this.openDatosContacto(c);
    await this.loadAll();
  }

  async openDatosContacto(c?: contacto): Promise<any> {
    const modal = await this.modalController.create({
      component: DatosContactosPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "datosContacto": c
      }      
    });
    await modal.present();
    return await modal.onWillDismiss();
  }

}
