import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-datos-bancarios',
  templateUrl: './datos-bancarios.page.html',
  styleUrls: ['./datos-bancarios.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DatosBancariosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
