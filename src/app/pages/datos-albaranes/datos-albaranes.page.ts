import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-datos-albaranes',
  templateUrl: './datos-albaranes.page.html',
  styleUrls: ['./datos-albaranes.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatosAlbaranesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
