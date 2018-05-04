import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// import { CartService } from '../../providers/cart-service-mock';
import { CartFireService } from '../../providers/cart-fire-service';
import { RestaurantFireService } from '../../providers/restaurant-fire-service';

import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage({
	name: 'page-cart',
	segment: 'cart'
})

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})

export class CartPage {

	orders: any;
	totalVal: number = 0;

  constructor (
		public navCtrl: NavController,
		public navParams: NavParams,
		public cartService: CartFireService,
		public restaurantService: RestaurantFireService,
		private afAuth: AngularFireAuth
	) {

  }

	ionViewDidLoad() {
		this.getOrders();
	}

  removeOrder (order) {
    // this.cartService.removefromCart(order)
    //     .then(() => {
    //         this.getOrders();
    //     })
    //     .catch(error => alert(JSON.stringify(error)));
  }

  getOrders () {
		this.afAuth.authState.subscribe(user => {
			this.orders = this.cartService.getOrders();
		});
  }

	// getDish (dish_id) {
	//
	// }

  // minus adult when click minus button
  minusQtd(order) {
		// this.cartService.editQtdOrder(order, 'minus')
    //   .then(() => {
    //       this.getOrders();
    //   })
    //   .catch(error => alert(JSON.stringify(error)));
  }

  // plus adult when click plus button
  plusQtd(order) {
		// this.cartService.editQtdOrder(order, 'plus')
    //   .then(() => {
    //       this.getOrders();
    //   })
    //   .catch(error => alert(JSON.stringify(error)));
  }

  openCheckout() {
      this.navCtrl.push('page-checkout', {orders: this.orders});
  }

}
