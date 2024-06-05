import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

 /**
 * Valida una cadena de texto verificando si es nula, indefinida o vacía después de eliminar los espacios en blanco.
 *
 * @param {String} e - La cadena de texto a validar.
 * @return {boolean} Devuelve true si la cadena es nula, indefinida o vacía después de eliminar los espacios en blanco, de lo contrario devuelve false.
 */
  valid(e?: String): boolean {
    let flag: boolean = false
    if (e == null || e == undefined) {
      flag = true
    } else {
      e = e.trim()
      if (e == "") {
        flag = true
      } else {
        flag = false
      }
    }
    return flag
  }
}