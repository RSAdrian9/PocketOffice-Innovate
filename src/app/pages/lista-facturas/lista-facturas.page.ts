import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController, NavController, Platform } from '@ionic/angular';
import { facturas } from 'src/app/model/facturas';
import { DbService } from 'src/app/services/db.service';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { DatosFacturasPage } from '../datos-facturas/datos-facturas.page';

@Component({
  selector: 'app-lista-facturas',
  templateUrl: './lista-facturas.page.html',
  styleUrls: ['./lista-facturas.page.scss'],
})
export class ListaFacturasPage implements OnInit {
  tipoFactura = "Todas"
  fechaFactura = "Año"
  @ViewChild('mySelectTipo', { static: false }) selectRef: IonSelect;
  @ViewChild('mySelectFecha', { static: false }) selectRef2: IonSelect;
  facturas: facturas[] = []
  facAux: facturas[] = []
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
    this.tipoFactura = "Todas"
    this.fechaFactura = "Año"
    this.facturas = []
    this.facAux = []
    await this.loadAll();
  }
  openSelectTipo() {
    this.selectRef.open()
  }
  openSelectFecha() {
    this.selectRef2.open()
  }
  public async loadAll() {
    try {
      this.transferir.$getObjectSource.subscribe(datos => {
        this.tipo = datos.title
        this.clienteAux = datos.cliente
        
        if(this.tipo=="Clientes"){
          this.nom=datos.cliente.nom
          this.db.getFacturas('CL',this.clienteAux.cod).then(facturas=>{
            this.facturas = facturas
            this.facAux = this.facturas
            this.filtro() 
          }).catch(error =>{
            console.log(error)
          })
        }else{
          this.nom=datos.cliente.nom
          this.db.getFacturas('PR',this.clienteAux.cod).then(facturas=>{
            this.facturas = facturas
            this.facAux = this.facturas
            this.filtro() 
          }).catch(error =>{
            console.log(error)
          })
        }
        
        
        
      })
    } catch (err) {
      await this.present.presentToast("Error al cargar las facturas", "danger");
    }
  }

  filtro() {
    this.total = 0
    this.total2="0"
    if (this.tipoFactura == "Cobradas") {
      this.facAux = this.facturas.filter(element => {
        if (element.est == "3") {
          return this.filtroFecha(element)
        }
      })
    } else if (this.tipoFactura == "Pendientes") {
      this.facAux = this.facturas.filter(element => {
        if (element.est == "1") {
          return this.filtroFecha(element)
        }
      })
    } else if (this.tipoFactura == "Todas") {
      this.facAux = this.facturas.filter(element => {
        return this.filtroFecha(element)
      })
    }
  }

  async vistaFactura(d: facturas) {
    await this.openDatosFactura(d);
  }

  async openDatosFactura(d?: facturas): Promise<any> {
    const modal = await this.modalController.create({
      component: DatosFacturasPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "datosFacturas": d
      }
    });
    await modal.present();
    return await modal.onWillDismiss();
  }

  filtroFecha(element) {
    if (this.fechaFactura == "Hoy") {
      if(element.fec2 == this.datepipe.transform(new Date(), "dd/MM/yyyy")){
        let n = parseFloat(element.totmon)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2=this.formatNumber(this.total);
        return element
      }
    } else if (this.fechaFactura == "Semana") {
      let d = element.fee2.slice(0, 2)
      let m = element.fee2.slice(3, -5)
      let y = element.fee2.slice(6)

      if (new Date(y + "-" + m + "-" + d).getTime() >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).getTime() &&
        new Date(y + "-" + m + "-" + d).getTime() <= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 6, 0, 0, 0).getTime()) {
          let n = parseFloat(element.totmon)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2=this.formatNumber(this.total);
        return element
      }
    } else if (this.fechaFactura == "Mes") {
      let m = element.fee2.slice(3, -5)
      let y = element.fee2.slice(6)
      let f = m + "/" + y
      if (f == this.datepipe.transform(new Date(), "MM/yyyy")) {
        let n = parseFloat(element.totmon)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2=this.formatNumber(this.total);
        return element
      }
    } else if (this.fechaFactura == "Año") {
      let y = element.fee2.slice(6)
      if (y == this.datepipe.transform(new Date(), "yyyy")) {
        let n = parseFloat(element.totmon)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2=this.formatNumber(this.total);
        return element
      }
    } else if (this.fechaFactura == "Todo") {
      let n = parseFloat(element.totmon)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2=this.formatNumber(this.total);
      return element
    }
  }
  formatNumber(num) {
    return num.toString().replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }

  comprobarFactura(factura: facturas) {
    if (factura.est == "3") {
      return "--background: #73DF67; color: #fff;"
    } else if (factura.est == "1") {
      return "--background: #EB612F; color: #fff;"
    } else if (factura.est == "2") {
      return "--background: #50BEF3; color: #fff;"
    }
  }

}
