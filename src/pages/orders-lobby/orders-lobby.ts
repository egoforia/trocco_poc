import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase } from 'angularfire2/database';
import { RestaurantFireService } from '../../providers/restaurant-fire-service'

/**
 * Generated class for the OrdersLobbyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'page-orders-lobby',
	segment: 'orders-lobby'
})
@Component({
  selector: 'page-orders-lobby',
  templateUrl: 'orders-lobby.html',
})
export class OrdersLobbyPage {

  // orders: any = {
  //
  //   "preparing$":  new Observable<any[]>(),
  //   "ready$":      new Observable<any[]>(),
  // };

  open$: Observable<void>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public afDB: AngularFireDatabase, public restaurantService: RestaurantFireService) {
    const restaurant_id = restaurantService.getActive().id;
    const today = new Date().toISOString().slice(0, 10);

    console.log(`orders/${restaurant_id}/${today}`);
    this.open$ = this.afDB.list(`orders/${restaurant_id}/${today}`)
      .valueChanges()
      .map((order :any) => {
        order.dishes.map(item => {
          item.dish = this.restaurantService.getDish(item.dish_id);
        });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersLobbyPage');
  }

}
