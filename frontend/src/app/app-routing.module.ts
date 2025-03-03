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
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { ManageProductsComponent } from './admin/manage-products/manage-products.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SavedAddressComponent } from './saved-address/saved-address.component';
import { ManageCouponsComponent } from './admin/manage-coupons/manage-coupons.component';
import { ManageCountriesComponent } from './admin/manage-countries/manage-countries.component';
import { OrdersComponent } from './orders/orders.component';

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
      },
      {
        path:'cart',
        component:CartComponent,
      }
    ]
  },{
    path:'admin',
    component:AdminPanelComponent,
    children:[
      {
        path:'',
        redirectTo:'admin-home',
        pathMatch:'full',
      },
      {
        path:'admin-home',
        component:AdminHomeComponent,
      },
      {
        path:'users-management',
        component:ManageUsersComponent,
      },
      {
        path:'products-management',
        component:ManageProductsComponent,
      },
      {
        path:'orders-management',
        component:ManageOrdersComponent,
      },
      {
        path:'coupons-management',
        component:ManageCouponsComponent,
      },
      {
        path:'countries-management',
        component:ManageCountriesComponent
      }
    ]
  },
  {
    path:'user',
    component:FullScreenLayoutComponent,
    children:[
      {
        path:'edit-profile',
        component:EditProfileComponent,
      },
      {
        path:'saved-address',
        component:SavedAddressComponent,
      },
      {
        path:'orders',
        component:OrdersComponent,
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
