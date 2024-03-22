import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { analytics, eyeOutline, peopleSharp, warning, warningOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { clienteTmp } from 'src/app/models/clienteTmp';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClientesPage implements OnInit {
  clientes: Array<clienteTmp> = [

  ];

  constructor(private router: Router) {
    this.clientes = [
      { id: '1', cod: '000001', nom: 'MANUEL', activo: 0, riesgo: 1000, total: 540.25 },
      { id: '45', cod: '000053', nom: 'FRANCISCO', activo: 1, riesgo: 1200, total: 1345.86 },
      { id: '103', cod: '000107', nom: 'ANTONIO', activo: 1, riesgo: 800, total: 230.78 }
    ]

    addIcons({
      peopleSharp,
      warning,
      analytics,
      warningOutline,
      eyeOutline
    })

  }


  comprobarDiferencia(s: clienteTmp) {
    if (s.riesgo > 0.00) {
      if (s.total > s.riesgo) {
        return "color: red;"
      } else {
        return "color: green;"
      }
    } else {
      return "color: green;"
    }
  }


  verDetallesCliente(s: clienteTmp) {
    this.router.navigate(['/vista-cliente'])
  }




  ngOnInit() {
  }

}

