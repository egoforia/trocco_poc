import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
// import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { foodIonicApp } from './app.component';

import { PipesModule } from '../pipes/pipes.module';

import { AngularFireModule } from 'angularfire2';
// for AngularFireDatabase
import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
// for AngularFireAuth
import { AngularFireAuthModule } from 'angularfire2/auth';
// import { AngularFireAuth } from 'angularfire2/auth';

import { Facebook } from '@ionic-native/facebook';

import {MessageService} from "../providers/message-service-mock";
import {RestaurantService} from "../providers/restaurant-service-mock";
import {DishService} from "../providers/dish-service-mock";
import {CategoryService} from "../providers/category-service-mock";
import {CartService} from "../providers/cart-service-mock";
import {OrdersService} from "../providers/orders-service-mock";

export const firebaseConfig = {
  apiKey: "AIzaSyCpeYNLer4m1nEG_ZT6N50dnoZfbeIpj4Y",
  authDomain: "trocco-ea3f1.firebaseapp.com",
  databaseURL: "https://trocco-ea3f1.firebaseio.com",
  projectId: "trocco-ea3f1",
  storageBucket: "trocco-ea3f1.appspot.com",
  messagingSenderId: "15700150803"
};

@NgModule({
  declarations: [
    foodIonicApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(foodIonicApp, {
			preloadModules: true,
			iconMode: 'md',
			mode: 'md'
    }),
    IonicStorageModule.forRoot({
      name: '__foodIonicDB',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    PipesModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    Facebook
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    foodIonicApp
  ],
  providers: [
    RestaurantService,
    DishService,
    CategoryService,
    MessageService,
    CartService,
		OrdersService,
    Facebook,
    // { provide: LocationStrategy, useClass: PathLocationStrategy },
    // { provide: APP_BASE_HREF, useValue : '/' },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
