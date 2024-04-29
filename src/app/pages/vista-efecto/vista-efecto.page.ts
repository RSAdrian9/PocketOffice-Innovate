import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { efectos } from 'src/app/models/efectos.model';
import { DbService } from 'src/app/services/db.service';


@Component({
  selector: 'app-vista-efecto',
  templateUrl: './vista-efecto.page.html',
  styleUrls: ['./vista-efecto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VistaEfectoPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  numero: string = ''
  efecto: efectos = {}

  constructor(
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController,
    private dbService: DbService

  ) { }

  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.numero = this.activatedRoute.snapshot.paramMap.get('numero') as string;

    this.pageController();
  }

  ionViewDidEnter() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    this.numero = this.activatedRoute.snapshot.paramMap.get('numero') as string;

    this.pageController();
  }

  pageController() {
    this.cargarEfecto();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  goBack() {
    this.navC.navigateBack('/efectos/' + this.tipo + '/' + this.codigo);
    this.transferirService.sendObjectSource({ ruta: '/efectos' });

  }

  cargarEfecto() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getDatosEfecto('C', this.codigo, this.numero).then((efecto) => {
          this.efecto = efecto;
        });
        break;

      case 'proveedor':
        this.dbService.getDatosEfecto('P', this.codigo, this.numero).then((efecto) => {
          this.efecto = efecto;
        });
        break;
    }
  }

  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}
