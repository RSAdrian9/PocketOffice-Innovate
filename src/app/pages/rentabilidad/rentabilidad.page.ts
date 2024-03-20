import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { rentabilidad } from 'src/app/model/rentabilidad';
import { DbService } from 'src/app/services/db.service';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';

@Component({
  selector: 'app-rentabilidad',
  templateUrl: './rentabilidad.page.html',
  styleUrls: ['./rentabilidad.page.scss'],
})
export class RentabilidadPage implements OnInit {
  rentabilidades: rentabilidad[] = []
  rentabilidad: rentabilidad={}
  nom
  clienteAux:any
  constructor(private platform: Platform,
    private present: PresentService,
    private navC: NavController,
    private db: DbService,
    private transferir: TransferirDatosService) { }
 
    ngOnInit() {
      this.platform.backButton.subscribeWithPriority(10, () => {
        this.navC.navigateForward("vista-cliente")
      });
    }
    async ionViewDidEnter() {
      this.rentabilidades=[]
      this.rentabilidad={}
      await this.loadAll();
    }
    public async loadAll() {
      try {
        this.transferir.$getObjectSource.subscribe(datos => {
          this.clienteAux = datos.cliente
          this.nom = datos.cliente.nom

          this.db.getRentabilidad(this.clienteAux.cod).then(rentabilidad=>{
            this.rentabilidades =rentabilidad;
            
            this.rentabilidad=this.rentabilidades[0]
          })
        })
        
      } catch (err) {
        await this.present.presentToast("Error al cargar la Rentabilidad", "danger");
      }
    }
  
}
