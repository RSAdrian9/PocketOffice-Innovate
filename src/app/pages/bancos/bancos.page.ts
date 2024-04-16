import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { banco } from 'src/app/models/banco.model';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.page.html',
  styleUrls: ['./bancos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BancosPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  bancos: banco[] = [];
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
    this.pageController();

  }

  onViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

  async cargarBancos() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getBancos('CL', this.codigo).then((bancos) => {
          console.log(bancos);
          this.bancos = bancos;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.dbService.getBancos('PR', this.codigo).then((bancos) => {
          console.log(bancos);
          this.bancos = bancos;
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
    this.cargarBancos();
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

  navigateToClienteDetails() {
    if (this.tipo === 'cliente') {
      this.navC.navigateForward('/vista-cliente/' + this.codigo);
    } else if (this.tipo === 'proveedor') {
      this.navC.navigateForward('/vista-proveedor/' + this.codigo);
    }
  }

}