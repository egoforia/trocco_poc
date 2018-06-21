import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, MenuController, ToastController, PopoverController, ModalController, Platform } from 'ionic-angular';
import { RestaurantFireService } from '../../providers/restaurant-fire-service';
import { Observable } from 'rxjs/Observable';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsersFireService } from '../../providers/users-fire-service';

@IonicPage({
	name: 'page-home',
	segment: 'home',
	priority: 'high'
})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  restaurants: Observable<any>;
  searchKey: string = "";
  yourLocation: string = "463 Beacon Street Guest House";

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public service: RestaurantFireService,
    public firebase: Firebase,
    public afAuth: AngularFireAuth,
    private usersService: UsersFireService
  ) {
		this.menuCtrl.swipeEnable(true, 'authenticated');
		this.menuCtrl.enable(true);
		this.findAll();
  }

  openRestaurantListPage(proptype) {
  	this.navCtrl.push('page-restaurant-list', proptype);
  }

  openRestaurantFilterPage() {
    let modal = this.modalCtrl.create('page-restaurant-filter');
    modal.present();
  }

  openNearbyPage() {
    this.navCtrl.push('page-nearby');
  }

  openOrders() {
    this.navCtrl.push('page-orders');
  }

  openCart() {
    this.navCtrl.push('page-cart');
  }

	openRestaurantDetail(restaurant) {
		this.service.setActive(restaurant);

  	this.navCtrl.push('page-check-number');
	}

  openSettingsPage() {
  	this.navCtrl.push('page-settings');
  }

  openNotificationsPage() {
  	this.navCtrl.push('page-notifications');
  }

  openCategoryPage() {
    this.navCtrl.push('page-category');
  }

	onInput(event) {
	    // this.service.findByName(this.searchKey)
	    //     .then(data => {
	    //         this.restaurants = data;
	    //     })
	    //     .catch(error => alert(JSON.stringify(error)));
	}

	onCancel(event) {
	    this.findAll();
	}

	findAll() {
    this.restaurants = this.service.findAll();
	}

  alertLocation() {
    let changeLocation = this.alertCtrl.create({
      title: 'Change Location',
      message: "Type your Address to change restaurant list in that area.",
      inputs: [
        {
          name: 'location',
          placeholder: 'Enter your new Location',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Change',
          handler: data => {
            console.log('Change clicked', data);
            this.yourLocation = data.location;
            let toast = this.toastCtrl.create({
              message: 'Location was change successfully',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create('page-notifications');
    popover.present({
      ev: myEvent
    });
  }

  ionViewWillEnter() {
      this.navCtrl.canSwipeBack();
  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe((user: any) => {
      this.saveUserDeviceToken(user);    
    });
  }

  saveUserDeviceToken(user: any) {
    this.platform.ready().then(() => {
      if(this.platform.is('cordova')) {
        this.firebase.getToken().then(token => {
          this.usersService.addDeviceToken(user.uid, token);
        });
      }
    });
  }

  showConfirmEntranceValueAlert(restaurant) {
    const confirm = this.alertCtrl.create({
      title: `Para entrar nesse restaurante poderá ser adicionado um valor de entrada ao seu pedido. Você concorda?`,
      message: '',
      buttons: [
        {
          text: 'Voltar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Concordo',
          handler: () => {
            console.log('Agree clicked');
            this.openRestaurantDetail(restaurant);
          }
        }
      ]
    });
    confirm.present();
  }
}
