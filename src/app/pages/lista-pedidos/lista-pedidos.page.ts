import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSelect, ModalController, NavController, Platform } from '@ionic/angular';
import { element } from 'protractor';
import { estados } from 'src/app/model/estados';
import { pedidos } from 'src/app/model/pedidos';
import { DbService } from 'src/app/services/db.service';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { DatosPedidosPage } from '../datos-pedidos/datos-pedidos.page';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.page.html',
  styleUrls: ['./lista-pedidos.page.scss'],
})
export class ListaPedidosPage implements OnInit {
  estadoPedido
  pulsado: boolean
  fechaPedido = "Año"
  @ViewChild('mySelectEstado', { static: false }) selectRef: IonSelect;
  @ViewChild('mySelectFecha', { static: false }) selectRef2: IonSelect;
  pedidos: pedidos[] = []
  estados: estados[] = []
  peAux: pedidos[] = []
  nom
  est
  tipo
  total: number = 0
  total2
  clienteAux: any
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
    this.fechaPedido = "Año"
    this.est = ""
    this.tipo = ""
    this.pedidos = []
    this.peAux = []
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
          this.estadoPedido = this.estados[0].des
        }).catch(error=>{
          console.log(error);
        })

        
        
        if (this.tipo == "Clientes") {
          this.nom = datos.cliente.nom
          this.db.getPedidos('CL', this.clienteAux.cod).then(pedidos => {
            this.pedidos = pedidos
            this.peAux = this.pedidos
            this.filtro()
          })
        } else {
          this.nom = datos.cliente.nom
          this.db.getPedidos('PR', this.clienteAux.cod).then(pedidos => {
            this.pedidos = pedidos
            this.peAux = this.pedidos
            this.filtro()
          })
        }


      })
    } catch (err) {
      await this.present.presentToast("Error al cargar los pedidos", "danger");
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
    if (this.tipo == 'Clientes') {
      this.estados.forEach(element2 => {
        if (this.estadoPedido == "TODOS" && element2.des == "TODOS") {
          this.peAux = this.pedidos.filter(element => {
            return this.filtroFecha(element)
          });
        } else {
          let nomDes = element2.des
          if (this.estadoPedido == nomDes) {
            this.peAux = this.pedidos.filter(element => {
              this.est = element.est
              if (element.est == this.estadoPedido) {
                return this.filtroFecha(element)
              }
            })
          }
        }
      });
    } else {
      this.peAux = this.pedidos.filter(element => {
        return this.filtroFecha(element)
      });
    }
  }


  async vistaPedidos(d: pedidos) {
    await this.openDatosPedidos(d);
  }

  async openDatosPedidos(d?: pedidos): Promise<any> {
    const modal = await this.modalController.create({
      component: DatosPedidosPage,
      cssClass: 'my-custom-class',
      componentProps: {
        "datosPedido": d,
        "tipo": this.tipo
      }
    });
    await modal.present();
    return await modal.onWillDismiss();
  }

  filtroFecha(element) {
    if (this.fechaPedido == "Hoy") {
      if (element.fec2 == this.datepipe.transform(new Date(), "dd/MM/yyyy")) {
        let n = parseFloat(element.toteu)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2 = this.formatNumber(this.total);
        return element
      }
    } else if (this.fechaPedido == "Semana") {
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
    } else if (this.fechaPedido == "Mes") {
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
    } else if (this.fechaPedido == "Año") {
      let y = element.fec2.slice(6)
      if (y == this.datepipe.transform(new Date(), "yyyy")) {
        let n = parseFloat(element.toteu)
        this.total += n
        this.total = Math.round(this.total * 100) / 100
        this.total2 = this.formatNumber(this.total);
        return element
      }
    } else if (this.fechaPedido == "Todo") {
      let n = parseFloat(element.toteu)
      this.total += n
      this.total = Math.round(this.total * 100) / 100
      this.total2 = this.formatNumber(this.total);
      return element
    }
  }
  comprobarPedido(p: pedidos) {
    let ser = p.ser.trim()
    if (ser == "2") {
      return "--background: #73DF67; color: #fff;"
    } else if (ser == "") {
      return "--background: #EB612F; color: #fff;"
    } else if (ser == "1") {
      return "--background: #50BEF3; color: #fff;"
    }
  }
  formatNumber(num) {
    return num.toString().replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  }
}
