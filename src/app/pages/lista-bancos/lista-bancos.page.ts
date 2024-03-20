import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { banco } from 'src/app/model/banco';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { DatosBancariosPage } from '../datos-bancarios/datos-bancarios.page';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-lista-bancos',
  templateUrl: './lista-bancos.page.html',
  styleUrls: ['./lista-bancos.page.scss'],
})
export class ListaBancosPage implements OnInit {
bancos:banco[]=[]
nom
clienteAux: any
tipo: String
  constructor(private platform: Platform,
    private navC: NavController,
    private transferir:TransferirDatosService,
    private present: PresentService,
    private db: DbService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateForward("vista-cliente")
    });
  }


  async ionViewDidEnter() {
    this.bancos=[]
    await this.loadAll();
  }

  public async loadAll() {
    try {
      this.transferir.$getObjectSource.subscribe(datos => {
        this.tipo = datos.title
        this.clienteAux = datos.cliente
        if(this.tipo=="Clientes"){
          this.nom=datos.cliente.nom
          this.db.getBancos('CL',this.clienteAux.cod).then(bancos=>{
            this.bancos = bancos
          })
        }else{
          this.nom=datos.cliente.nom
          this.db.getBancos('PR',this.clienteAux.cod).then(bancos=>{
            this.bancos = bancos
          })
        } 
      })
    } catch (err) {
      await this.present.presentToast("Error al cargar los Bancos", "danger");
    }
  }

  async vistaBanco(b: banco) {
    await this.openDatosBanco(b);
    await this.loadAll();
  }

  async openDatosBanco(b?: banco): Promise<any> {
    const modal = await this.modalController.create({
      component: DatosBancariosPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "datosBanco": b
      }      
    });
    await modal.present();
    return await modal.onWillDismiss();
  }

}
