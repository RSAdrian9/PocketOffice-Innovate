import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mayor',
  templateUrl: './mayor.page.html',
  styleUrls: ['./mayor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MayorPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  codigo: string = ''
  tipo: string = ''

  constructor(    
    private platform: Platform,
    private transferirService: TransferirDatosService,
    private navC: NavController
  ) { }

  ngOnInit() {
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo') as string;
    this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo') as string;
    console.log(this.activatedRoute.snapshot.params);
    
    this.pageController();        
  }

  pageController() {
    
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

}
