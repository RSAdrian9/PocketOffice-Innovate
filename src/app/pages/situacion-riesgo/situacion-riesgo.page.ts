import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-situacion-riesgo',
  templateUrl: './situacion-riesgo.page.html',
  styleUrls: ['./situacion-riesgo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SituacionRiesgoPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''

  constructor(    
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController
  ) { }

  ngOnInit() {
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);
    
    this.pageController();        
  }

  pageController() {

    this.transferirService.sendObjectSource({ codigo: this.codigo })
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navC.navigateBack('/vista-cliente/' + this.codigo);
      this.transferirService.sendObjectSource({ ruta: '/vista-cliente' });
    });
  }

}
