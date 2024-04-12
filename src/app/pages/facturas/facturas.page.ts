import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { facturas } from 'src/app/models/facturas.model';
import { DbService } from 'src/app/services/db.service';
import { IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, IonList]
})
export class FacturasPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  filtro: string = ''
  factura: facturas[] = [];
  nombre: string = '';

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

  onViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

  async cargarFacturas() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getListadoFacturas('CL', this.codigo, '').then((facturas) => {
          console.log(facturas);
          this.factura = facturas;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.dbService.getListadoFacturas('PR', this.codigo, '').then((facturas) => {
          console.log(facturas);
          this.factura = facturas;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
    }
  }

  pageController() {
    this.cargarFacturas();
    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      switch (this.tipo) {
        case 'cliente':
          this.navC.navigateBack('/vista-cliente/' + this.codigo);
          this.transferirService.sendObjectSource({ ruta: '/vista-cliente' });
          break;
        case 'proveedor':
          this.navC.navigateBack('/vista-proveedor/' + this.codigo);
          this.transferirService.sendObjectSource({ ruta: '/vista-proveedor' });
          break;
      }

    });
  }

  navigateToClienteDetails(banco: any) {
    if (this.tipo === 'cliente') {
      this.navC.navigateForward('/vista-cliente/' + this.codigo);
    } else if (this.tipo === 'proveedor') {
      this.navC.navigateForward('/vista-proveedor/' + this.codigo);
    }
  }

}
