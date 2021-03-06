import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
    templateUrl: 'app.html'
})
export class foodIonicApp {
    @ViewChild(Nav) nav: Nav;

  	tabsPlacement: string = 'bottom';
  	tabsLayout: string = 'icon-top';

    rootPage: any;
    showMenu: boolean = true;

    homeItem: any;

    initialItem: any;

    messagesItem: any;

    settingsItem: any;

    appMenuItems: Array<MenuItem>;

    yourRestaurantMenuItems: Array<MenuItem>;

    accountMenuItems: Array<MenuItem>;

    helpMenuItems: Array<MenuItem>;

    user: firebase.User;

    constructor(public platform: Platform, public afAuth: AngularFireAuth) {
      this.initializeApp();

      this.afAuth.authState.subscribe(user => {
        this.rootPage = 'page-home';
      });

      this.homeItem = { component: 'page-home' };
      this.messagesItem = { component: 'page-message-list'};

      this.appMenuItems = [
        {title: 'Restaurants', component: 'page-restaurant-list', icon: 'home'},
        {title: 'Dish List', component: 'page-dish-list', icon: 'pizza'},
        {title: 'Nearby', component: 'page-nearby', icon: 'compass'},
        {title: 'By Category', component: 'page-category', icon: 'albums'},
        {title: 'Latest Orders', component: 'page-orders', icon: 'list-box'},
        {title: 'Cart', component: 'page-cart', icon: 'cart'},
        {title: 'Favorite Restaurants', component: 'page-favorite-list', icon: 'heart'},
        {title: 'Orders Lobby', component: 'page-orders-lobby', icon: 'heart'}
      ];

      this.yourRestaurantMenuItems = [
        {title: 'Register Restaurant', component: 'page-your-restaurant', icon: 'clipboard'}
      ];

      this.accountMenuItems = [
        {title: 'Login', component: 'page-auth', icon: 'log-in'},
        {title: 'My Account', component: 'page-my-account', icon: 'contact'},
        {title: 'Logout', component: 'page-auth', icon: 'log-out'},
      ];

      this.helpMenuItems = [
        {title: 'Extra Pages (with Animations)', component: 'page-custom-pages', icon: 'albums'},
        {title: 'About', component: 'page-about', icon: 'information-circle'},
        {title: 'Support', component: 'page-support', icon: 'call'},
        {title: 'App Settings', component: 'page-settings', icon: 'cog'},
        {title: 'Walkthrough', component: 'page-walkthrough', icon: 'photos'}
      ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
        });

	    if (!this.platform.is('mobile')) {
	      this.tabsPlacement = 'top';
	      this.tabsLayout = 'icon-left';
	    }
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
