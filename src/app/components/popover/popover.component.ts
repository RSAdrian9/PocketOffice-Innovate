import { Component } from '@angular/core';
import { IonItem, IonItemDivider, IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  standalone: true,
  imports: [ IonItem, IonList, IonItemDivider]
})
export class PopoverComponent {

  constructor() {}

  opcionSeleccionada(opcion: string) {
    console.log('Opción seleccionada:', opcion);
    // Aquí puedes agregar la lógica para manejar la opción seleccionada
  }
}
