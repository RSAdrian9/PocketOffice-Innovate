import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController, NavController, Platform } from '@ionic/angular';
import { estados } from 'src/app/model/estados';
import { presupuestos } from 'src/app/model/presupuestos';
import { DbService } from 'src/app/services/db.service';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { DatosPresupuestosPage } from '../datos-presupuestos/datos-presupuestos.page';

@Component({
  selector: 'app-lista-presupuestos',
  templateUrl: './lista-presupuestos.page.html',
  styleUrls: ['./lista-presupuestos.page.scss'],
})
export class ListaPresupuestosPage implements OnInit {
  estadoPresupuesto
  fechaPresupuesto = "Año"
  @ViewChild('mySelectEstado', { static: false }) selectRef: IonSelect;
  @ViewChild('mySelectFecha', { static: false }) selectRef2: IonSelect;
  presupuestos: presupuestos[] = []
  estados: estados[] = []
  preAux: presupuestos[] = []
  nom
  est
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
    this.fechaPresupuesto = "Año"
    this.est = ""
    this.presupuestos = []
    this.preAux = []
    this.estados = []
    await this.loadAll();
  }

  public async loadAll() {
    try {
      this.transferir.$getObjectSource.subscribe(datos => {
        this.tipo = datos.title
        this.clienteAux = datos.cliente
        //this.estados = this.estados.concat(this.db.getEstados());
        this.db.getEstados().then(estados=>{
          this.estados = this.estados.concat(estados);
          this.estadoPresupuesto = this.estados[0].des
        }).catch(error=>{
          console.log(error);
        })
        

        if (this.tipo == "Clientes") {
          this.nom = datos.cliente.nom
          this.db.getPresupuestos(this.clienteAux.cod).then(presupuestos => {
            this.presupuestos = presupuestos
            this.preAux = this.presupuestos
            this.filtro()
          })
        }


      })
    } catch (err) {
      await this.present.presentToast("Error al cargar los presupuestos", "danger");
    }
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
    this.estados.forEach(element2 => {
      if (this.estadoPresupuesto == "TODOS" && element2.des == "TODOS") {
        this.preAux = this.presupuestos.filter(element => {
          return this.filtroFecha(element)
        });
      } else {
        let nomDes = element2.des
        if (this.estadoPresupuesto == nomDes) {
          this.preAux = this.presupuestos.filter(element => {
            this.est = element.est
            if (element.est == this.estadoPresupuesto) {
              return this.filtroFecha(element)
            }
          })
        }
      }
    });
  }


  async vistaPresupuesto(d: presupuestos) {
    await this.openDatosPresupuesto(d);
  }

  async openDatosPresupuesto(d?: presupuestos): Promise<any> {
    const modal = await this.modalController.create({
      component: DatosPresupuestosPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "datosPresupuesto": d
      }
    });
    await modal.present();
    return await modal.onWillDismiss();
  }


  filtroFecha(element) {
    if (this.fechaPresupuesto == "Hoy") {
      if (element.fec2 == this.datepipe.transform(new Date(), "dd/MM/yyyy")) {
        let n = parseFloat(element.toteu)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2 = this.formatNumber(this.total);
        return element
      }
    } else if (this.fechaPresupuesto == "Semana") {
      let d = element.fec2.slice(0, 2)
      let m = element.fec2.slice(3, -5)
      let y = element.fec2.slice(6)

      if (new Date(y + "-" + m + "-" + d).getTime() >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).getTime() &&
        new Date(y + "-" + m + "-" + d).getTime() <= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6, 0, 0, 0).getTime()) {
        let n = parseFloat(element.toteu)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2 = this.formatNumber(this.total);
        return element
      }
    } else if (this.fechaPresupuesto == "Mes") {
      let m = element.fec2.slice(3, -5)
      let y = element.fec2.slice(6)
      let f = m + "/" + y
      if (f == this.datepipe.transform(new Date(), "MM/yyyy")) {
        let n = parseFloat(element.toteu)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2 = this.formatNumber(this.total);
        return element
      }
    } else if (this.fechaPresupuesto == "Año") {
      let y = element.fec2.slice(6)
      if (y == this.datepipe.transform(new Date(), "yyyy")) {
        let n = parseFloat(element.toteu)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2 = this.formatNumber(this.total);
        return element
      }
    } else if (this.fechaPresupuesto == "Todo") {
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
}
