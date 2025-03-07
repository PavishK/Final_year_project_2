import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  private key:string='User-Data';

  setData(userData:any):void{
    localStorage.setItem(this.key,this.encrypt(JSON.stringify(userData)));

  }

  getData(): any {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(this.decrypt(data)) : null;
  }

  removeData():void{
    localStorage.removeItem(this.key);
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, environment.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, environment.key).toString(CryptoJS.enc.Utf8);
  }

}
