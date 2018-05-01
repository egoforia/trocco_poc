import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// import { CartService } from '../../providers/cart-service-mock';
import { CartFireService } from '../../providers/cart-fire-service'
import { RestaurantFireService } from '../../providers/restaurant-fire-service'
import { Observable } from 'rxjs/Observable';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public cartService: CartFireService, public restaurantService: RestaurantFireService) {
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
		// this.orders = .subscribe();

		this.cartService.getOrders().subscribe((orders: any) => {
    	this.orders = orders;

    	this.totalVal = 0;

			for (let order of orders) {
				order.dish = this.restaurantService.getDish(order.dish_id);
				console.log(order);
				// this.restaurantService.getDish(order.dish_id).subscribe(dish => {
				// 	console.log(order, dish);
				// 	order.dish = dish;
				// });
			}
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
