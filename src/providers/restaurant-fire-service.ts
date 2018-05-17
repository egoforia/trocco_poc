import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class RestaurantFireService {

  // favoriteCounter: number = 0;
  // favorites: Array<any> = [];
  restaurants: Observable<any>;
  active: any = {};

  constructor(private afDB: AngularFireDatabase, private afAuth: AngularFireAuth) {
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
	}

  setActive(restaurant) {
    this.active = restaurant;
    this.addGuest(restaurant);
  }

  recoveryActive(success) {
    if (this.afAuth.auth.currentUser) {
      const uid = this.afAuth.auth.currentUser.uid;
      this.afDB.object(`users/${uid}`).valueChanges().subscribe((user: any) => {
        if (user.guest_on) {
          this.afDB.object(`estabelecimentos/${user.guest_on}`).valueChanges().subscribe((restaurant: any) => {
            if (restaurant) {
              this.active = restaurant;

              if (success instanceof Function)
                success();
            }
          });
        }
      });
    }
  }

  addGuest(restaurant) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const today = new Date().toISOString().slice(0, 10);
        this.afDB.object(`guests/${today}/${restaurant.id}/${user.uid}`)
          .set({'status': 'waiting'});
        this.afDB.object(`users/${user.uid}`)
          .update({"guest_on": restaurant.id});
      }
    });
  }

  getGuestSubscriber() {
    if (this.active.id) {
      const today = new Date().toISOString().slice(0, 10);
      return this.afDB.object(`guests/${today}/${this.active.id}/${this.afAuth.auth.currentUser.uid}`).valueChanges();
    }

    return null;
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
