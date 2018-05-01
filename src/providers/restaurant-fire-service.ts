import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RestaurantFireService {

  // favoriteCounter: number = 0;
  // favorites: Array<any> = [];
  restaurants: Observable<any>;
  active: any = {"id": 1};

  constructor(private afDB: AngularFireDatabase) {
    this.restaurants = this.afDB.list('estabelecimentos').valueChanges();
  }

  findAll() {
    return this.restaurants;
  }

	// getRestaurants() {
	// 	return this.restaurants;
	// }
  //
  // findById(id) {
  //   return Promise.resolve(restaurants[id - 1]);
  // }
  //
	getItem(id) {
    return this.afDB.object(`estabelecimentos/${id}`).valueChanges();

		// for (var i = 0; i < this.restaurants.length; i++) {
		// 	if (this.restaurants[i].id === parseInt(id)) {
		// 		return this.restaurants[i];
		// 	}
		// }
		// return null;
	}

  setActive(restaurant) {
    this.active = restaurant;
  }

  getActive() {
    return this.active;
  }

  getDish(dish_id) {
    return this.afDB.object(`estabelecimentos/${this.active.id}/dishes/${dish_id}`).valueChanges();
  }
  //
  // findByName(searchKey: string) {
  //   let key: string = searchKey.toUpperCase();
  //   return Promise.resolve(restaurants.filter((restaurant: any) =>
  //       (restaurant.title +  ' ' +restaurant.address +  ' ' + restaurant.city + ' ' + restaurant.description).toUpperCase().indexOf(key) > -1));
  // }
  //
  // getFavorites() {
  //   return Promise.resolve(this.favorites);
  // }
  //
  // favorite(restaurant) {
  //   this.favoriteCounter = this.favoriteCounter + 1;
  //   this.favorites.push({id: this.favoriteCounter, restaurant: restaurant});
  //   return Promise.resolve();
  // }
  //
  // unfavorite(favorite) {
  //   let index = this.favorites.indexOf(favorite);
  //   if (index > -1) {
  //     this.favorites.splice(index, 1);
  //   }
  //   return Promise.resolve();
  // }

}
