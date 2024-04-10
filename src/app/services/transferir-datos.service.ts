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

  sendObjectSource(data: any) {
    this.objectSource.next(data);
  }
  
  sendListSource(list: any[]) {
    this.listSource.next(list);
  }
}