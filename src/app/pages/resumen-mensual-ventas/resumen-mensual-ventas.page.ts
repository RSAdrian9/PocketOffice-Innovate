import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { resumen } from 'src/app/models/resumen.model';
import { IonToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-resumen-mensual-ventas',
  templateUrl: './resumen-mensual-ventas.page.html',
  styleUrls: ['./resumen-mensual-ventas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonToggle]
})
export class ResumenMensualVentasPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  nombre: string = '';
  public resumen: resumen = {};
  public iva: string = '1'
  ocultar_trim1: boolean = false;
  ocultar_trim2: boolean = false;
  ocultar_trim3: boolean = false;
  ocultar_trim4: boolean = false;


  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);

    this.pageController();
  }

  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);

    this.pageController();
  }

  control_boton_trim1(){
    this.ocultar_trim1 = !this.ocultar_trim1;
  }

  control_boton_trim2(){
    this.ocultar_trim2 = !this.ocultar_trim2;
  }

  control_boton_trim3(){
    this.ocultar_trim3 = !this.ocultar_trim3;
  }

  control_boton_trim4(){
    this.ocultar_trim4 = !this.ocultar_trim4;
  }

  controlSelectIVA(event: any) {
    this.iva = event.detail.value;
  }
  

  async cargarResumenMensual() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getResumenMensual('CL', this.codigo).then((resumen) => {
          this.resumen = resumen;

        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.dbService.getResumenMensual('PR', this.codigo).then((resumen) => {
          this.resumen = resumen;

        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
    }

  }


  goBack() {
    this.navC.navigateBack('/vista-cliente/' + this.codigo);
    this.transferirService.sendObjectSource({ ruta: '/vista-cliente' });
  }


  pageController() {
    this.cargarResumenMensual();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}
