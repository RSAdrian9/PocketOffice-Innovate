import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { rentabilidad } from 'src/app/models/rentabilidad.model';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-rentabilidad',
  templateUrl: './rentabilidad.page.html',
  styleUrls: ['./rentabilidad.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RentabilidadPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  nombre: string = '';
  public rentabilidad: rentabilidad = {};

  constructor(    
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);

    this.pageController();
  }

  ionViewDidEnter() {
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.pageController();
  }

  async cargarRentabilidad() {
    this.dbService.getRentabilidad(this.codigo).then((rentabilidad) => {
      this.rentabilidad = rentabilidad;

    });
    this.dbService.getNombreCliente(this.codigo).then((nombre) => {
      this.nombre = nombre;
    });
  }


  goBack() {
    this.navC.navigateBack('/vista-cliente/' + this.codigo);
    this.transferirService.sendObjectSource({ ruta: '/vista-cliente' });
  }


  pageController() {
    this.cargarRentabilidad();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

}
