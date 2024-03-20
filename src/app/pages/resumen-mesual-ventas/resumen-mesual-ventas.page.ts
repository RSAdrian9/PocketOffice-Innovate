import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, NavController, Platform } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';

@Component({
  selector: 'app-resumen-mesual-ventas',
  templateUrl: './resumen-mesual-ventas.page.html',
  styleUrls: ['./resumen-mesual-ventas.page.scss'],
})
export class ResumenMesualVentasPage implements OnInit {
  resumen
  ocultar1: boolean = false;
  ocultar2: boolean = false;
  ocultar3: boolean = false;
  ocultar4: boolean = false;
  iva = "Con Iva"
  @ViewChild('mySelectIva', { static: false }) selectRef: IonSelect;
  nom
  clienteAux: any
  tipo
  constructor(private platform: Platform,
    private present: PresentService,
    private navC: NavController,
    private db: DbService,
    private transferir: TransferirDatosService) { }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateForward("vista-cliente")
    });
  }
  openSelectIva() {
    this.selectRef.open()
  }
  async ionViewDidEnter() {
    this.resumen = {}
    await this.loadAll();
  }
  public async loadAll() {
    try {
      this.transferir.$getObjectSource.subscribe(datos => {
        this.tipo = datos.title
        this.clienteAux = datos.cliente
        this.nom = datos.cliente.nom
        if (this.tipo == "Clientes") {
          this.db.getResumenMensual('CL', this.clienteAux.cod).then(resumen => {
            this.resumen = resumen;
          }).catch(error => {
            console.log(error);
          });
        } else {
          this.db.getResumenMensual('PR', this.clienteAux.cod).then(resumen => {
            this.resumen = resumen;
          }).catch(error => {
            console.log(error);
          });
        }

      })

    } catch (err) {
      await this.present.presentToast("Error al cargar mensual de ventas", "danger");
    }
  }
  accion1() {
    this.ocultar1 = !this.ocultar1;
  }

  accion2() {
    this.ocultar2 = !this.ocultar2;
  }

  accion3() {
    this.ocultar3 = !this.ocultar3;
  }

  accion4() {
    this.ocultar4 = !this.ocultar4;
  }

}
