import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-rentabilidad',
  templateUrl: './rentabilidad.page.html',
  styleUrls: ['./rentabilidad.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RentabilidadPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
