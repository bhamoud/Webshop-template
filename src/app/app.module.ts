import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SetProductComponent } from './admin/setproduct/setproduct.component';

//app components
import { AppComponent } from './app.component';
import { AboutComponent } from './shared/about/about.component';
import { AdmintabComponent } from './admin/admintab/admintab.component';
import { AdminordersComponent } from './admin/adminorders/adminorders.component';
import { AdmincartsComponent } from './admin/admincarts/admincarts.component';
import { AdminusersComponent } from './admin/adminusers/adminusers.component';
import { CartsComponent } from './user/carts/carts.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './shared/login/login.component';
import { OrdersComponent } from './user/orders/orders.component';
import { ProductComponent } from './user/product/product.component';
import { SettingsComponent } from './settings/settings.component';
import { ShopComponent } from './shop/shop.component';
import { UserComponent } from './user/user/user.component';

//firebase settings
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { DropZoneDirective } from './shared/dropzone/dropzone.directive';
import { FileSizePipe } from './shared/dropzone/filesize.pipe';
import { FileUploadComponent } from './shared/dropzone/fileupload.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    SettingsComponent,
    ShopComponent,
    FooterComponent,
    HeaderComponent,
    SetProductComponent,
    AdmintabComponent,
    AdminordersComponent,
    AdmincartsComponent,
    AdminusersComponent,
    OrdersComponent,
    CartsComponent,
    UserComponent,
    ProductComponent,
    LoginComponent,
    DropZoneDirective,
    FileSizePipe,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    MaterialModule
    ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'fr'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
