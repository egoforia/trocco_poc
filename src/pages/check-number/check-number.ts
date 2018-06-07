import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestaurantFireService } from '../../providers/restaurant-fire-service';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the CheckNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage( {
  name: 'page-check-number'
})
@Component({
  selector: 'page-check-number',
  templateUrl: 'check-number.html',
})
export class CheckNumberPage {

  restaurant: any;
  guest: Observable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restaurantService: RestaurantFireService) {
    this.restaurant = this.restaurantService.getActive();
    this.redirectToCorrectPage();
  }

  redirectToCorrectPage() {
    this.restaurantService.getGuestSubscriber().subscribe(guest => {
      if(guest) {
        switch (guest["status"]) {
          case 'waiting':
            this.navCtrl.setRoot('page-restaurant-detail');
            break;
          case 'open':
            this.navCtrl.setRoot('page-restaurant-detail');
            break;
          case 'preparing':
            this.navCtrl.setRoot('page-restaurant-detail');
            break;
          case 'ok':
            this.navCtrl.setRoot('page-home');
            break;
          case 'canceling':
            this.navCtrl.setRoot('page-home');
            break;
          default:
            this.navCtrl.setRoot('page-home');
            break;
        }
      } else {
        this.navCtrl.setRoot('page-home');
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckNumberPage');
  }

}
