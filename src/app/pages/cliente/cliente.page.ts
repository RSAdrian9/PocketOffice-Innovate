import { stringify } from '@angular/compiler/src/util';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Network } from '@ionic-native/network/ngx';
import { IonSelect, ModalController, NavController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { cliente } from 'src/app/model/cliente';
import { proveedor } from 'src/app/model/proveedor';
import { PresentService } from 'src/app/services/present.service';
import { DbService } from 'src/app/services/db.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { VistaClientePage } from '../vista-cliente/vista-cliente.page';


@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  clientes: cliente[] = []
  proveedores: proveedor[] = []
  clientesAUX: cliente[] = []
  proveedoresAUX: proveedor[] = []
  
  riesgo = "Todo"
  tipoActivo = "Todo"
  search
  title
  tablaCliente = "clientes";
  tablaProveedores = "proveedores";
  dbC: PouchDB.Database<{}>
  dbP: PouchDB.Database<{}>
  active: boolean = true;
  @ViewChild('mySelectRiesgo', { static: false }) selectRef: IonSelect;
  @ViewChild('mySelectActivo', { static: false }) selectRef2: IonSelect;
  constructor(
    private navC: NavController,
    private transferir: TransferirDatosService,
    private platform: Platform,
    private present: PresentService,
    private nativeS: NativeStorage,    
    private db: DbService,
    private route: Router,
    private network: Network) {    
    
  }

  async ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.back()
    });
    this.transferir.$getObjectSource.pipe(takeWhile(() => this.active)).subscribe(res => {
      if (res.title != undefined || res.title != null) {
        this.title = res.title
      }
    })

    
    //this.db.descargarSQLite();

    try{
      if (this.title == "Clientes") {
        
        this.clientes = this.db.getClientesParaListaNormal();
        this.clientesAUX = this.clientes
      } else {         
        
        this.proveedores = this.db.getProveedoresParaListaNormal();
        this.proveedoresAUX = this.proveedores           
      }
    }catch(err){
      console.log(err);
    }
   
            
      

  }

  openSelectRiesgo() {
    this.selectRef.open()
  }
  openSelectActivo() {
    this.selectRef2.open()
  }
  ionViewWillEnter() {
    this.riesgo = "Todo"
    this.tipoActivo = "Todo"
    this.active = true
    this.transferir.$getObjectSource.pipe(takeWhile(() => this.active)).subscribe(res => {
      if (res.title != undefined || res.title != null) {
        this.title = res.title
      }
    })
    if (this.title == "Clientes") {
      /*this.db.getClientesParaLista().then(clientes=>{
        this.clientes=clientes;
      }).catch(err=>console.log("getClientesParaLista en ionViewWillEnter: "+err))*/
      /*this.clientes = this.db.getClientesParaListaNormal();
      this.clientesAUX = this.clientes*/
    } else {         
      /*this.db.getProveedoresParaLista().then(proveedores=>{
        this.proveedores=proveedores;
      }).catch(err=>console.log("getProveedoresParaLista en ionViewWillEnter: "+err))*/
      /*this.proveedores = this.db.getProveedoresParaListaNormal();
      this.proveedoresAUX = this.proveedores */          
    }        
         
  }
  ionViewWillLeave() {
    this.active = false
  }
  public async loadAll() {          
      
      if (this.title == "Clientes") {        
        /*this.db.getClientesParaLista().then(clientes=>{
          this.clientes=clientes;
        }).catch(err=>console.log("getClientesParaLista en loadAll: "+err))*/
        this.clientes = this.db.getClientesParaListaNormal();
        this.clientesAUX = this.clientes     
      } else {       
        /*this.db.getProveedoresParaLista().then(proveedores=>{
          this.proveedores=proveedores;
        }).catch(err=>console.log("getProveedoresParaLista en loadAll: "+err))*/
        this.proveedores = this.db.getProveedoresParaListaNormal();
        this.proveedoresAUX = this.proveedores       
      }
    
  }  

  

  refrescar() {
    
      if (this.title == "Clientes") {        
        this.clientes = []
        this.clientesAUX = []
      } else {        
        this.proveedores = []
        this.proveedoresAUX = []
      }
      this.loadAll();
    
  }

  async vistaCliente(c?: any) {
    await this.openVistaCliente(c);
  }
  async openVistaCliente(c?: any): Promise<any> {
    
    this.transferir.sendObjectSource({ cliente: c, title: this.title })
    this.navC.navigateForward("/vista-cliente")
  }

  public async searchCliente($event) {
    this.searchClienteLocal($event)
  }

  public async searchClienteLocal($event) {
    
    if (this.title == "Clientes") {
      let value = $event.detail.value;
      value = value.trim();
      if (value != '') {
        this.clientesAUX = this.clientes.filter((data) => {
          return (data.nom.toLowerCase().indexOf(value.toLowerCase()) > -1);
        })
      } else {          
        /*this.db.getClientesParaLista().then(clientes=>{
          this.clientes=clientes;
        }).catch(err=>console.log("getClientesParaLista en searchClienteLocal: "+err))*/
        this.clientes = this.db.getClientesParaListaNormal();
        this.clientesAUX = this.clientes              
      }
    } else {
      let value = $event.detail.value;
      value = value.trim();
      if (value != '') {
        this.proveedoresAUX = this.proveedores.filter((data) => {
          return (data.nom.toLowerCase().indexOf(value.toLowerCase()) > -1);
        })
      } else {
        /*this.db.getProveedoresParaLista().then(proveedores=>{
          this.proveedores=proveedores;
        }).catch(err=>console.log("getProveedoresParaLista en searchClienteLocal: "+err))*/
        this.proveedores = this.db.getProveedoresParaListaNormal();
        this.proveedoresAUX = this.proveedores            
      }
    }
    
  }
  filtro() {
    if(this.title=="Clientes"){
      if (this.riesgo == "Riesgo") {
        this.clientesAUX = this.clientes.filter(element => {
          if(element.riesgo>"0,00"){
            if (element.total > element.rie) {
              return this.filtroActivo(element)
            }
          }
        })
      } else if (this.riesgo == "Todo") {
        this.clientesAUX = this.clientes.filter(element => {
          return this.filtroActivo(element)
        })
      }
    }else{
      this.proveedoresAUX = this.proveedores.filter(element => {
        return this.filtroActivo(element)
      })
    }
    
  }

  filtroActivo(element){
    if(this.tipoActivo=="Todo"){
      return element
    }else if (this.tipoActivo == "Activos" && element.activo=="1") {
      return element
    }else if (this.tipoActivo == "No Activos" && element.activo=="0") {
      return element
    }
  }
  comprobarDiferencia(s: cliente) {
    if(s.rie>"0,00"){
      if (s.total > s.rie) {
        return "color: red;"
      } else {
        return "color: green;"
      }
    }else{
      return "color: green;"
    }
  }
}
