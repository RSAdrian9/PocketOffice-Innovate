import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { cliente } from 'src/app/model/cliente';
import { takeWhile } from 'rxjs/operators';
import { CallService } from 'src/app/services/call.service';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { DatePipe } from '@angular/common';
import { proveedor } from 'src/app/model/proveedor';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { NavController, Platform } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-vista-cliente',
  templateUrl: './vista-cliente.page.html',
  styleUrls: ['./vista-cliente.page.scss'],
})
export class VistaClientePage implements OnInit {
  cliente: any
  clienteAux: any
  flag = false
  fechaTipo
  active: boolean = true;
  tipo: String
  constructor(
    private transferir: TransferirDatosService,
    private appC: AppComponent,
    private present: PresentService,
    private platform: Platform,
    private navC: NavController,
    private db: DbService,
    private utils: UtilitiesService,
    public datepipe: DatePipe,
    private callS: CallService) {

  }
  ngOnInit() {
    this.appC.flag = false
    this.platform.backButton.subscribeWithPriority(10, () => {
      //this.navC.navigateForward("cliente")
      this.navC.navigateBack("cliente")
    });
  }
  ionViewWillEnter() {
    this.loadCliente()
  }
  loadCliente() {
    this.transferir.$getObjectSource.pipe(takeWhile(() => this.active)).subscribe(datos => {
      this.tipo = datos.title
      this.clienteAux = datos.cliente
      
      if (this.tipo == "Clientes") {
        this.db.getCli(this.clienteAux.cod).then(res=>{
          this.cliente = res
          //console.log(this.cliente);
          this.fechaTipo = this.datepipe.transform(this.cliente.fcr_crm, 'dd/MM/yyyy')
        })        
      } else {
        this.db.getPro(this.clienteAux.cod).then(res=>{
          this.cliente = res
          console.log(this.cliente);
        })        
      }     
    })
  }

  valid(e: String) {
    return this.utils.valid(e)
  }
  
  ionViewWillLeave() {
    this.active = false
  }

  callNumber(numbre: string) {
    this.callS.call(numbre)
  }

  mailto(email) {
    window.open(`mailto:${email}`, '_system');
  }
  web(web) {
    window.open(`http://${web}`, '_system');
  }
}
