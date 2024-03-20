import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController, NavController, Platform } from '@ionic/angular';
import { anios } from 'src/app/model/anios';
import { mayor } from 'src/app/model/mayor';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { MayorDatosPage } from '../mayor-datos/mayor-datos.page';
import * as startOfDay from "date-fns";
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { DbService } from 'src/app/services/db.service';
@Component({
  selector: 'app-mayor',
  templateUrl: './mayor.page.html',
  styleUrls: ['./mayor.page.scss'],
})
export class MayorPage implements OnInit {
  tipoMayor = "Todo"
  fechaMayor = "Todo"
  anioMayor = ""
  fini = new Date().getFullYear() + "-01-01"
  ffin = new Date().getFullYear() + "-12-31"
  @ViewChild('mySelectTipo', { static: false }) selectRef: IonSelect;
  @ViewChild('mySelectFecha', { static: false }) selectRef2: IonSelect;
  @ViewChild('mySelectAnio', { static: false }) selectRef3: IonSelect;
  mayor: mayor[] = []
  mayAux: mayor[] = []
  mayAux2: mayor[] = []
  mayAux3: mayor[] = []

  anios: anios[] = []
  nom
  clienteAux: any
  tipo: String
  totales = {}
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

  ionViewWillLeave() {
    this.screenOrientation.unlock()
  }
  async ionViewDidEnter() {
    this.mayor = []
    this.mayAux = []
    this.mayAux2 = []
    this.mayAux3 = []
    this.anios = []
    await this.loadAll();
    this.openSelectAnio()
  }

  public async loadAll() {
    try {
      this.transferir.$getObjectSource.subscribe(datos => {
        this.tipo = datos.title
        this.clienteAux = datos.cliente.cod
        console.log(datos)

        if (this.tipo == "Clientes") {
          this.nom = datos.cliente.nom
          this.db.getMayor('CL', this.clienteAux).then(mayor => {
            this.mayor = mayor
            this.mayAux = this.mayor
            //console.log(this.mayor)

            this.filtro()
          })
        } else {
          this.nom = datos.cliente.nom
          this.db.getMayor('PR', this.clienteAux).then(mayor => {
            this.mayor = mayor
            this.mayAux = this.mayor
            this.filtro()
          })

        }

        this.db.getAnios().then(anios => {
          this.anios = anios
        })

      })
      // this.mayAux = this.mayor     
      //  this.filtro()
    } catch (err) {
      console.log(err);
      await this.present.presentToast("Error al cargar el mayor", "danger");
    }
  }
  openSelectTipo() {
    this.selectRef.open()
  }
  openSelectFecha() {
    this.selectRef2.open()
  }
  openSelectAnio() {
    return this.selectRef3.open()
  }

  filtro() {

    let anio = this.anioMayor.slice(4)

    this.fini = this.datepipe.transform(this.fini, "yyyy-MM-dd")
    this.fini = anio + this.fini.slice(-6)
    this.ffin = this.datepipe.transform(this.ffin, "yyyy-MM-dd")
    this.ffin = anio + this.ffin.slice(-6)

    let ini = new Date(this.fini)
    let fin = new Date(this.ffin)

    this.mayAux2 = []
    this.mayAux.forEach(element => {
      if (element.anio2 == this.anioMayor) {
        this.mayAux2.push(element)
      }
    });
    this.mayAux3 = this.mayAux2.filter(element => {

      let d = element.fec2.slice(0, 2)
      let m = element.fec2.slice(3, -5)
      let y = element.fec2.slice(6)
      return startOfDay.isWithinInterval(new Date(y + "-" + m + "-" + d), { start: ini, end: fin })
    })

    if (this.mayAux3[this.mayAux3.length - 1] == undefined) {
      this.totales = {
        deb: "0",
        hab: "0",
        sal: "0"
      }
    } else {
      this.totales = {
        deb: this.mayAux3[this.mayAux3.length - 1].deb,
        hab: this.mayAux3[this.mayAux3.length - 1].hab,
        sal: this.mayAux3[this.mayAux3.length - 1].sal
      }
    }
  }

  async vistaMayor(d: mayor) {
    await this.openDatosMayor(d);
  }

  async openDatosMayor(d?: mayor): Promise<any> {
    const modal = await this.modalController.create({
      component: MayorDatosPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "datosMayor": d
      }
    });
    await modal.present();
    return await modal.onWillDismiss();
  }


  filtroFecha(element) {
    if (this.fechaMayor == "Hoy") {
      return element.fec2 == this.datepipe.transform(new Date(), "dd/MM/yyyy")
    } else if (this.fechaMayor == "Semana") {
      let d = element.fec2.slice(0, 2)
      let m = element.fec2.slice(3, -5)
      let y = element.fec2.slice(6)

      if (new Date(y + "-" + m + "-" + d).getTime() >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).getTime() &&
        new Date(y + "-" + m + "-" + d).getTime() <= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6, 0, 0, 0).getTime()) {
        return element
      }
    } else if (this.fechaMayor == "Mes") {
      let m = element.fec2.slice(3, -5)
      let y = element.fec2.slice(6)
      let f = m + "/" + y
      if (f == this.datepipe.transform(new Date(), "MM/yyyy")) {
        return element
      }
    } else if (this.fechaMayor == "Año") {
      let y = element.fec2.slice(6)
      if (y == this.datepipe.transform(new Date(), "yyyy")) {
        return element
      }
    } else if (this.fechaMayor == "Todo") {
      return element
    }
  }

}