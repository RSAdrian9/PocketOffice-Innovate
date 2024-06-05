import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AjustesPage implements OnInit {

  constructor() { }

 /**
 * Inicializa el componente después de que Angular haya inicializado todas las propiedades vinculadas.
 * Aquí puedes poner el código de inicialización que depende de los enlaces,
 * directivas de atributos o otras características de Angular.
 */
  ngOnInit() {
  }

}