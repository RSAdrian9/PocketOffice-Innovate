import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { mayor } from 'src/app/models/mayor.model';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-vista-mayor',
  templateUrl: './vista-mayor.page.html',
  styleUrls: ['./vista-mayor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VistaMayorPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''
  numero: string = ''
  mayor: mayor = {}

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
    this.cargarMayor();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

  goBack() {
    this.navC.navigateBack('/mayor/' + this.tipo + '/' + this.codigo);
    this.transferirService.sendObjectSource({ ruta: '/mayor' });

  }

  cargarMayor() {
    switch (this.tipo) {
      case 'cliente':
        this.dbService.getDatosMayorDeCuentas('CL', this.codigo, this.numero).then((mayor) => {
          this.mayor = mayor;
        });
        break;

      case 'proveedor':
        this.dbService.getDatosMayorDeCuentas('PR', this.codigo, this.numero).then((mayor) => {
          this.mayor = mayor;
        });
        break;
    }
  }

  formatearNumero(numero: any) {
    let numeroFormateado = parseFloat(numero).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return numeroFormateado;
  }

}
