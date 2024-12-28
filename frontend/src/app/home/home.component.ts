import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { RouterManagerService } from '../router-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {



  public Counter:AnimatedCounter=new AnimatedCounter();
  constructor(private router:RouterManagerService){}


  @ViewChild('counterElement') counterElement!: ElementRef;
  countersStarted = false;

  @HostListener('window:scroll', [])
  onScroll() {
    const rect = this.counterElement.nativeElement.getBoundingClientRect();
    if (!this.countersStarted && rect.top <= window.innerHeight && rect.bottom >= 0) {
      this.countersStarted = true;
      this.Counter.animateValue('value1',100,1500);
      this.Counter.animateValue('value2',20,1500);
      this.Counter.animateValue('value3',101,1500);
    }
  }

  ngOnInit(): void {}



  handleMoreBtn():void{
    this.router.moveTo('/about');
  }

  handleProductsBtn():void{
    this.router.moveTo('/products');
  }
  handleReviewsBtn():void{
    this.router.moveTo("/reviews");
  }


}

//Animated Counter Increment

class AnimatedCounter {

  public value1:number=0;
  public value2:number=0;
  public value3:number=0;

  animateValue(property: 'value1' | 'value2' | 'value3', target: number, duration: number) {
    const stepTime = Math.abs(Math.floor(duration / target));
    const interval = setInterval(() => {
      this[property]++;
      if (this[property] >= target) {
        clearInterval(interval);
      }
    }, stepTime);
  }

}
