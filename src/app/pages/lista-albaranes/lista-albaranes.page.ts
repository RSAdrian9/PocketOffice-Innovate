import { DatePipe, formatNumber } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController, NavController, Platform } from '@ionic/angular';
import { albaranes } from 'src/app/model/albaranes';
import { DbService } from 'src/app/services/db.service';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { DatosAlbaranesPage } from '../datos-albaranes/datos-albaranes.page';

@Component({
  selector: 'app-lista-albaranes',
  templateUrl: './lista-albaranes.page.html',
  styleUrls: ['./lista-albaranes.page.scss'],
})
export class ListaAlbaranesPage implements OnInit {

  tipoAlbaran = "Todos"
  albaranFacturado = "Todos"
  @ViewChild('mySelectTipo', { static: false }) selectRef: IonSelect;
  @ViewChild('mySelectFacturado', { static: false }) selectRef2: IonSelect;
  albaranes: albaranes[] = []
  albAux: albaranes[] = []
  nom
  total: number = 0
  total2
  clienteAux: any
  tipo: String
  constructor(private modalController: ModalController,
    private platform: Platform,
    private present: PresentService,
    private navC: NavController,
    public datepipe: DatePipe,
    private db: DbService,
    private transferir: TransferirDatosService) { }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateForward("vista-cliente")
    });
  }
  async ionViewDidEnter() {
    this.tipoAlbaran = "Todos"
    this.albaranFacturado = "Todos"
    this.albaranes = []
    this.albAux = []
    await this.loadAll();
  }
  public async loadAll() {
    try {
      this.transferir.$getObjectSource.subscribe(datos => {
        this.tipo = datos.title
        this.clienteAux = datos.cliente

        if (this.tipo == "Clientes") {
          this.nom = datos.cliente.nom
          this.db.getAlbaranes('CL', this.clienteAux.cod).then(albaranes => {
            this.albaranes = albaranes
            this.albAux = this.albaranes
            this.filtro()
          }).catch(error => {
            console.log(error)
          })
        } else {
          this.nom = datos.cliente.nom
          this.db.getAlbaranes('PR', this.clienteAux.cod).then(albaranes => {
            this.albaranes = albaranes
            this.albAux = this.albaranes
            this.filtro()
          }).catch(error => {
            console.log(error)
          })
        }



      })
    } catch (err) {
      await this.present.presentToast("Error al cargar los albaranes", "danger");
    }

    /*try {
      this.transferir.$getObjectSource.subscribe(res => {
        this.nom = res.cliente.nom
        this.albaranes = this.albaranes.concat(res.cliente.albaranes)
      })
      this.albAux = this.albaranes
      this.filtro()
    } catch (err) {
      await this.present.presentToast("Error al cargar las albaranes", "danger");
    }*/
  }
  openSelectTipo() {
    this.selectRef.open()
  }
  openSelectFecha() {
    this.selectRef2.open()
  }

  filtro() {
    this.total = 0
    this.total2 = "0"
    if (this.tipoAlbaran == "Cobrados") {
      this.albAux = this.albaranes.filter(element => {
        if (element.est == "3") {
          return this.filtroFacturado(element)
        }
      })
    } else if (this.tipoAlbaran == "Pendientes") {
      this.albAux = this.albaranes.filter(element => {
        if (element.est == "1") {
          return this.filtroFacturado(element)
        }
      })
    } else if (this.tipoAlbaran == "Todos") {
      this.albAux = this.albaranes.filter(element => {
        return this.filtroFacturado(element)
      })
    }
  }

  filtroFacturado(element) {
    if (this.albaranFacturado == "Facturados" && element.fac == "1") {
      let n = parseFloat(element.toteu)
      this.total += n
      this.total = Math.round(this.total * 100) / 100
      this.total2 = this.formatNumber(this.total);
      return element
    } else if (this.albaranFacturado == "No Facturados" && element.fac == "0") {
      let n = parseFloat(element.toteu)
      this.total += n
      this.total = Math.round(this.total * 100) / 100
      this.total2 = this.formatNumber(this.total);
      return element
    } else if (this.albaranFacturado == "Todos") {
      let n = parseFloat(element.toteu)
      this.total += n
      this.total = Math.round(this.total * 100) / 100
      this.total2 = this.formatNumber(this.total);
      return element
    }
  }
  formatNumber(num) {
    return num.toString().replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }
  async vistaAlbaran(d: albaranes) {
    await this.openDatosAlbaran(d);
  }

  async openDatosAlbaran(d?: albaranes): Promise<any> {
    const modal = await this.modalController.create({
      component: DatosAlbaranesPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "datosAlbaran": d
      }
    });
    await modal.present();
    return await modal.onWillDismiss();
  }

  comprobarAlbaran(albaran: albaranes) {
    if (albaran.est == "3") {
      return "--background: #73DF67; color: #fff;"
    } else if (albaran.est == "1") {
      return "--background: #EB612F; color: #fff;"
    } else if (albaran.est == "2") {
      return "--background: #50BEF3; color: #fff;"
    }
  }
}
