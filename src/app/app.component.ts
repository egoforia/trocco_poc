import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { RestaurantFireService } from '../providers/restaurant-fire-service'
import { UsersFireService } from '../providers/users-fire-service';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

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
    items: Observable<any[]>;
    user: any;

    constructor(
      public platform: Platform,
      public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public firebase: Firebase,
      public afDB: AngularFireDatabase,
      public afAuth: AngularFireAuth,
      private usersService: UsersFireService,
      private restaurantService: RestaurantFireService
    ) {
        this.user = {
            photoUrl: '',
            displayName: '',
            email: ''
        }
        this.initializeApp();
        // this.initializeFirebase();

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
        this.statusBar.overlaysWebView(false);
        const authSubscription = this.afAuth.authState.subscribe((user: any) => {
            if(user) {
                this.usersService.getUser$(user.uid).subscribe((_user: any) => {
                    this.user = JSON.parse(JSON.stringify(_user));
                    this.saveUserDeviceToken(this.user);
                    if(!this.user.phoneNumber) {
                        this.rootPage = 'page-complete-user-information';
                    } else {
                        this.restaurantService.recoveryActive((_res) => {
                            const guestSubs = this.restaurantService.getGuestSubscriber();
                            guestSubs.subscribe((guest: any) => {
                                if(guest) {
                                    this.rootPage = 'page-check-number';
                                }
                            });
                        }, (e: Error) => {
                            console.error(e);
                            this.logout();
                        });
                    }
                });
            } else {
                this.rootPage = 'page-walkthrough';
            }

            authSubscription.unsubscribe();
            this.splashScreen.hide();
        });
      });

	    if (!this.platform.is('mobile')) {
	      this.tabsPlacement = 'top';
	      this.tabsLayout = 'icon-left';
	    }
    }

    initializeFirebase() {
      this.firebase.getToken()
        .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
        .catch(error => console.error('Error getting token', error));
    }

    saveUserDeviceToken(user: any) {
        this.firebase.getToken().then(token => {
            this.usersService.addDeviceToken(user.uid, token);
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page);
    }

    logout() {
      this.afAuth.auth.signOut();
      this.nav.setRoot('page-auth');
    }

    goToHomeOrRestaurantDetail() {
        if (this.restaurantService.getActive()) {
            this.nav.setRoot('page-restaurant-detail');
        } else {
            this.nav.setRoot('page-home');
        }
    }
}
