import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

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