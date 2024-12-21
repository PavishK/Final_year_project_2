import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  private key:string='User-Data';

  setData(userData:any):void{
    localStorage.setItem(this.key,JSON.stringify(userData));

  }

  getData(): any {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }

  removeData():void{
    localStorage.removeItem(this.key);
  }

}
