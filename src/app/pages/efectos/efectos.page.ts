import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController, NavController, Platform } from '@ionic/angular';
import { efectos } from 'src/app/model/efectos';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { EfectosDatosPage } from '../efectos-datos/efectos-datos.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-efectos',
  templateUrl: './efectos.page.html',
  styleUrls: ['./efectos.page.scss'],
})
export class EfectosPage implements OnInit {
  tipoEfecto = "Todas"
  fechaEfecto = "Año"
  @ViewChild('mySelectTipo', { static: false }) selectRef: IonSelect;
  @ViewChild('mySelectFecha', { static: false }) selectRef2: IonSelect;
  efectos: efectos[] = []
  efecAux: efectos[] = []
  nom
  tipo
  total: number = 0
  clienteAux: any
  constructor(private modalController: ModalController,
    private platform: Platform,
    private present: PresentService,
    private navC: NavController,
    public datepipe: DatePipe,
    private db: DbService,
    private transferir: TransferirDatosService,
    private screenOrientation: ScreenOrientation) { }

  ngOnInit() {
    if (this.platform.width() <= 369) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    }
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateForward("vista-cliente")
    });
  }
  async ionViewDidEnter() {
    this.efectos = []
    this.efecAux = []
    await this.loadAll();
  }

  ionViewWillLeave() {
    this.screenOrientation.unlock()
  }
  public async loadAll() {

    try {
      this.transferir.$getObjectSource.subscribe(datos => {
        this.tipo = datos.title
        this.clienteAux = datos.cliente


        if (this.tipo == "Clientes") {
          this.nom = datos.cliente.nom
          this.db.getEfectos("C", this.clienteAux.cod).then(efectos => {
            this.efectos = efectos
            this.efecAux = this.efectos
            this.filtro()
          }).catch(error=>{
            console.log(error)
          })
        } else {
          this.nom = datos.cliente.nom
          this.db.getEfectos("P", this.clienteAux.cod).then(efectos => {
            this.efectos = efectos
            this.efecAux = this.efectos
            this.filtro()
          }).catch(error=>{
            console.log(error)
          })
        }
      })
    } catch (err) {
      await this.present.presentToast("Error al cargar los Efectos", "danger");
    }
    /*try {
      this.transferir.$getObjectSource.subscribe(res => {
        this.nom = res.cliente.nom
        this.efectos = this.efectos.concat(res.cliente.efectos)
        this.tipo = res.title;
      })
      this.efecAux = this.efectos
      this.filtro()
    } catch (err) {
      await this.present.presentToast("Error al cargar los Efectos", "danger");
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
    if (this.tipoEfecto == "Cobradas") {
      this.efecAux = this.efectos.filter(element => {
        if (element.est == "3") {
          return this.filtroFecha(element)
        }
      })
    } else if (this.tipoEfecto == "Pendientes") {
      this.efecAux = this.efectos.filter(element => {
        if (element.est == "1") {
          return this.filtroFecha(element)
        }
      })
    } else if (this.tipoEfecto == "Todas") {
      this.efecAux = this.efectos.filter(element => {
        return this.filtroFecha(element)
      })
    }
  }

  filtroFecha(element) {
    if (this.fechaEfecto == "Hoy") {
      if (element.fec2 == this.datepipe.transform(new Date(), "dd/MM/yyyy")) {
        let n = parseFloat(element.impeu)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        return element
      }
    } else if (this.fechaEfecto == "Semana") {
      let d = element.fec2.slice(0, 2)
      let m = element.fec2.slice(3, -5)
      let y = element.fec2.slice(6)

      if (new Date(y + "-" + m + "-" + d).getTime() >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).getTime() &&
        new Date(y + "-" + m + "-" + d).getTime() <= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6, 0, 0, 0).getTime()) {
        let n = parseFloat(element.impeu)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        return element
      }
    } else if (this.fechaEfecto == "Mes") {
      let m = element.fec2.slice(3, -5)
      let y = element.fec2.slice(6)
      let f = m + "/" + y
      if (f == this.datepipe.transform(new Date(), "MM/yyyy")) {
        let n = parseFloat(element.impeu)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        return element
      }
    } else if (this.fechaEfecto == "Año") {
      let y = element.fec2.slice(6)
      if (y == this.datepipe.transform(new Date(), "yyyy")) {
        let n = parseFloat(element.impeu)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        return element
      }
    } else if (this.fechaEfecto == "Todo") {
      let n = parseFloat(element.impeu)
      this.total += n
      this.total = Math.round(this.total * 100) / 100
      return element
    }
  }


  async vistaEfecto(d: efectos) {
    await this.openDatosEfecto(d);
  }

  async openDatosEfecto(d?: efectos): Promise<any> {
    const modal = await this.modalController.create({
      component: EfectosDatosPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "datosEfecto": d,
        "tipo": this.tipo
      }
    });
    await modal.present();
    return await modal.onWillDismiss();
  }

  comprobarEfecto(efecto: efectos) {
    if (efecto.est == "3") {
      return "background-color: #73DF67; color: #fff;"
    } else if (efecto.est == "1") {
      return "background-color: #EB612F; color: #fff;"
    } else if (efecto.est == "2") {
      return "background-color: #50BEF3; color: #fff;"
    }
  }

}
