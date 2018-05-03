import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { RestaurantFireService } from './restaurant-fire-service'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CartFireService {

  orderCounter: number = 0;
  orders: AngularFireList<{}>;

  constructor(private afDB: AngularFireDatabase, private restaurantService: RestaurantFireService) {
    this.orders = this.afDB.list(`orders/${this.restaurantService.getActive().id}/user1`);
  }

  addToCart(restaurant_id, dish, quantity) {
    this.orderCounter = this.orderCounter + 1;
    return this.orders.push({dish_id: dish.id, quantity: quantity, status: 'preparing'});
  }

  getOrders() {
    return this.orders.valueChanges().map(orders => {
      return orders.map((order: any) => {
        order.dish = this.restaurantService.getDish(order.dish_id);
        return order
      });
    });
  }

  removefromCart(order) {
    // let index = this.orders.indexOf(order);
    // if (index > -1) {
    //   this.orders.splice(index, 1);
    // }
    // return Promise.resolve();
  }

  editQtdOrder(order, op) {
  	// let order = this.orders[id - 1]
		// let index = this.orders.indexOf(order);
		// let order;
  //   if (index > -1) {
  //     this.orders[index];
  //   }

		for (let i in this.orders) {
			if (this.orders[i].id === order.id) {
				if (op === 'minus') {
					this.orders[i].qtd--;
		    	break;
				}
				if (op === 'plus') {
					this.orders[i].qtd++;
		    	break;
				}
			}
		}
		return Promise.resolve();
  }

  cleanCart() {
  	// this.orders = [];
  }

  // findAll() {
  //   return Promise.resolve(restaurants);
  // }

  // findById(id) {
  //   return Promise.resolve(restaurants[id - 1]);
  // }

  // findByName(searchKey: string) {
  //   let key: string = searchKey.toUpperCase();
  //   return Promise.resolve(restaurants.filter((restaurant: any) =>
  //       (restaurant.title +  ' ' +restaurant.address +  ' ' + restaurant.city + ' ' + restaurant.description).toUpperCase().indexOf(key) > -1));
  // }

  // getFavorites() {
  //   return Promise.resolve(this.favorites);
  // }

  // favorite(restaurant) {
  //   this.favoriteCounter = this.favoriteCounter + 1;
  //   this.favorites.push({id: this.favoriteCounter, restaurant: restaurant});
  //   return Promise.resolve();
  // }

  // unfavorite(favorite) {
  //   let index = this.favorites.indexOf(favorite);
  //   if (index > -1) {
  //     this.favorites.splice(index, 1);
  //   }
  //   return Promise.resolve();
  // }

}
