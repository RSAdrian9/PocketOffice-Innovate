import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-lista-bancos',
  templateUrl: './lista-bancos.page.html',
  styleUrls: ['./lista-bancos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListaBancosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
