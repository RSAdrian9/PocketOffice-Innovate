import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-datos-presupuestos',
  templateUrl: './datos-presupuestos.page.html',
  styleUrls: ['./datos-presupuestos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatosPresupuestosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
