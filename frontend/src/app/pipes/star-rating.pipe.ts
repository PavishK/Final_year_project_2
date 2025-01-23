import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'starRating'
})
export class StarRatingPipe implements PipeTransform {

  transform(rating:number, max:number=5): string {
    const fullStar=`<span class="text-h-t-color">&#9733;</span>`.repeat(Math.floor(rating));
    const emptyStar=`<span class="text-h-t-color">&#9734;</span>`.repeat(max-Math.floor(rating));
    return fullStar+emptyStar;
  }

}
