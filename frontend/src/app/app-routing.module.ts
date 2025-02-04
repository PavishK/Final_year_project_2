import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { AboutComponent } from './about/about.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { FullScreenLayoutComponent } from './layouts/full-screen-layout/full-screen-layout.component';
import { CartComponent } from './cart/cart.component';
import { DisplayProductDetailsComponent } from './display-product-details/display-product-details.component';

const routes: Routes = [
  {
    path:'',
    component:MainLayoutComponent,
    children:[
      {
        path:'',
        redirectTo:'home',
        pathMatch:'full',
      },
      {
        path:'home',
        component:HomeComponent,
      },
      {
        path:'products',
        component:ProductsComponent,
      },
      {
        path:'about',
        component:AboutComponent,
      },
      {
        path:'reviews',
        component:ReviewsComponent,
      },
      {
        path:'product',
        component:DisplayProductDetailsComponent,
      }
    ]
  },
  {
    path:'user',
    component:FullScreenLayoutComponent,
    children:[
      {
        path:'cart',
        component:CartComponent,
      }
    ]
  },
  // {
  //   path:'display-product-details',
  //   component:FullScreenLayoutComponent,
  //   children:[
  //     {
  //       path:'product',
  //       component:DisplayProductDetailsComponent,
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
