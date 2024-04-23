import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavController, Platform, IonItem, IonItemDivider, IonGrid, IonRow, IonCol} from '@ionic/angular/standalone';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';
import { situacionriesgo } from 'src/app/models/situacionriesgo.model';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-situacion-riesgo',
  templateUrl: './situacion-riesgo.page.html',
  styleUrls: ['./situacion-riesgo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, IonItem, IonItemDivider, IonGrid, IonRow, IonCol]
})
export class SituacionRiesgoPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  nombre: string = '';
  public situacion: situacionriesgo = {};

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

  async cargarSituaciondeRiesgo() {
    this.dbService.getSituacionDeRiesgo(this.codigo).then((situacion) => {
      this.situacion = situacion;
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
    this.cargarSituaciondeRiesgo();

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.goBack();
    });
  }

}
