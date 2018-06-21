import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestaurantFireService } from '../../providers/restaurant-fire-service';

@IonicPage( {
  name: 'page-check-number'
})
@Component({
  selector: 'page-check-number',
  templateUrl: 'check-number.html',
})
export class CheckNumberPage {
  restaurant: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public restaurantService: RestaurantFireService) {
    this.restaurant = this.restaurantService.getActive();
    this.redirectToCorrectPage();
  }

  redirectToCorrectPage() {
    this.restaurantService.getGuestSubscriber().subscribe((guest: any) => {
      if(guest) {
        if(guest.status == 'open') {
          this.navCtrl.setRoot('page-restaurant-detail');
        } else if (guest.status != 'waiting' && guest.status != 'open') {
          this.navCtrl.setRoot('page-home');
        }
      }
    });
  }
}
