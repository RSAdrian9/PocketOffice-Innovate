import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HistorialPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  historia: string = '';
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

  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

  async cargarHistorial() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getHistoria('CL', this.codigo).then((historia) => {
          console.log('Historial:', historia); // Agregar esta línea para imprimir el resultado en la consola
          this.historia = historia;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
      case 'proveedor':
        this.dbService.getHistoria('PR', this.codigo).then((historia) => {
          console.log('Historial:', historia); // Agregar esta línea para imprimir el resultado en la consola
          this.historia = historia;
        }).catch((err) => {
          console.log(err);
        });
        this.dbService.getNombreCliente(this.codigo).then((nombre) => {
          this.nombre = nombre;
        });
        break;
    }
  }
  
  

  goBack() {
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
  }


  pageController() {
    this.cargarHistorial();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

}
