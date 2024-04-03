import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-vista-proveedor',
  templateUrl: './vista-proveedor.page.html',
  styleUrls: ['./vista-proveedor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VistaProveedorPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
