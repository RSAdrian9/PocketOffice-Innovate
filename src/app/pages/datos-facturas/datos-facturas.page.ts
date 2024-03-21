import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-datos-facturas',
  templateUrl: './datos-facturas.page.html',
  styleUrls: ['./datos-facturas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatosFacturasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
