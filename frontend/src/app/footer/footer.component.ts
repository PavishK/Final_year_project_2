import { Component,OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  public email:string="smt-bakery@gmail.com";
  public phno:string="+91 98427-20663";
  public address:string="63, INDIRA STREET KANJIKOVIL ROAD, PERUNDURAI, Erode, TamilNadu-638052";

}
