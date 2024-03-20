import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { situacionriesgo } from 'src/app/model/situacionriesgo';
import { DbService } from 'src/app/services/db.service';
import { PresentService } from 'src/app/services/present.service';
import { TransferirDatosService } from 'src/app/services/transferir-datos.service';

@Component({
  selector: 'app-situacion-riesgos',
  templateUrl: './situacion-riesgos.page.html',
  styleUrls: ['./situacion-riesgos.page.scss'],
})
export class SituacionRiesgosPage implements OnInit {
  situacionesriesgo: situacionriesgo[] = []
  situacionriesgo: situacionriesgo = {}
  nom
  tipo
  clienteAux: any
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
    this.situacionesriesgo = []
    this.situacionriesgo = {}
    await this.loadAll();
  }
  public async loadAll() {
    try {
      this.transferir.$getObjectSource.subscribe(datos => {
        this.tipo = datos.title
        this.clienteAux = datos.cliente


        if (this.tipo == "Clientes") {
          this.nom = datos.cliente.nom
          this.db.getSituacionesRiesgo(this.clienteAux.cod).then(situacionesriesgo => {
            this.situacionesriesgo = situacionesriesgo
            this.situacionriesgo = this.situacionesriesgo[0]

          }).catch(error => {
            console.log(error)
          })
        }

      })
    } catch (err) {
      await this.present.presentToast("Error al cargar la Situación de Riesgo", "danger");
    }
  }
  comprobarDiferencia(s: situacionriesgo) {
    if (s.total > s.rie) {
      return "color: red;"
    } else {
      return "color: green;"
    }
  }
}
