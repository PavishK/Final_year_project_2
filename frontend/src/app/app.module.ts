import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { AboutComponent } from './about/about.component';
import { ReviewsComponent } from './reviews/reviews.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { FullScreenLayoutComponent } from './layouts/full-screen-layout/full-screen-layout.component';
import { CartComponent } from './cart/cart.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { FooterComponent } from './footer/footer.component';
import { DisplayProductDetailsComponent } from './display-product-details/display-product-details.component';
import { StarRatingPipe } from './pipes/star-rating.pipe';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { ManageProductsComponent } from './admin/manage-products/manage-products.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SavedAddressComponent } from './saved-address/saved-address.component';
import { AddressPopupComponent } from './address-popup/address-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ManageCountriesComponent } from './admin/manage-countries/manage-countries.component';
import { ManageCouponsComponent } from './admin/manage-coupons/manage-coupons.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PaymentComponent } from './payment/payment.component';
import { OrdersComponent } from './orders/orders.component';

import { ReactiveFormsModule } from '@angular/forms';
import { SuccessPopupComponent } from './success-popup/success-popup.component';
import { ErrorPopupComponent } from './error-popup/error-popup.component';

import {QRCodeModule} from 'angularx-qrcode';
import { CardPaymentComponent } from './card-payment/card-payment.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProductsComponent,
    AboutComponent,
    ReviewsComponent,
    LoginRegisterComponent,
    MainLayoutComponent,
    FullScreenLayoutComponent,
    CartComponent,
    LoadingSpinnerComponent,
    FooterComponent,
    DisplayProductDetailsComponent,
    StarRatingPipe,
    AdminHomeComponent,
    ManageUsersComponent,
    ManageProductsComponent,
    ManageOrdersComponent,
    AdminPanelComponent,
    EditProfileComponent,
    SavedAddressComponent,
    AddressPopupComponent,
    ManageCountriesComponent,
    ManageCouponsComponent,
    PaymentComponent,
    OrdersComponent,
    SuccessPopupComponent,
    ErrorPopupComponent,
    CardPaymentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    ToastrModule.forRoot({
    positionClass: 'toast-top-right',
    timeOut: 4000,
    closeButton: false
 }),
 HttpClientModule,
 MatIconModule,
 NgxChartsModule,
 QRCodeModule,
  ],
  providers: [
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

