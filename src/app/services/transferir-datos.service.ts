import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferirDatosService {
  objectSource = new BehaviorSubject<any>({});
  private listSource = new BehaviorSubject<any[]>([]);

  $getObjectSource = this.objectSource.asObservable();
  $getListSource = this.listSource.asObservable();
  nombreCliente: any;

  constructor() { }

 /**
 * Envía los datos proporcionados al origen del objeto.
 *
 * @param {any} data - Los datos a enviar al origen del objeto.
 */
  sendObjectSource(data: any) {
    this.objectSource.next(data);
  }

 /**
 * Envía la lista proporcionada al origen de la lista.
 *
 * @param {any[]} list - La lista a enviar al origen de la lista.
 */
  sendListSource(list: any[]) {
    this.listSource.next(list);
  }
}