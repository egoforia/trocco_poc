import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class RestaurantFireService {
  restaurants: Observable<any>;
  active: any = {};

  constructor(private afDB: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.restaurants = this.afDB.list('estabelecimentos').valueChanges();
    try {
      this.getActive()
    } catch(e) {}
  }

  today() {
    return new Date().toISOString().slice(0, 10);
  }

  findAll() {
    return this.restaurants;
  }

	getItem(id) {
    return this.afDB.object(`estabelecimentos/${id}`).valueChanges();
	}

  setActive(restaurant) {
    this.active = restaurant;
    this.addGuest(restaurant);
  }

  recoveryActive(then, error) {
    if (this.afAuth.auth.currentUser) {
      const uid = this.afAuth.auth.currentUser.uid;
      this.afDB.object(`users/${uid}`).valueChanges().subscribe((user: any) => {
        if (user) {
          this.afDB.object(`estabelecimentos/${user.guest_on}`).valueChanges().subscribe((restaurant: any) => {
            if (restaurant) {
              this.active = restaurant;
              if (then instanceof Function)
                then();
            }
          });
        } else {
          if (error instanceof Function)
            error(new Error(`Couldn't find user ${uid}`));
        }
      });
    }
  }

  addGuest(restaurant) {
    this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.afDB.object(`guests/${this.today()}/${restaurant.id}/${user.uid}`)
          .set({'status': 'waiting', created_at: + new Date()});
        this.afDB.object(`users/${user.uid}`)
          .update({"guest_on": restaurant.id});
      }
    });
  }

  getGuestSubscriber() {
    if (this.active.id) {
      return this.afDB.object(`guests/${this.today()}/${this.active.id}/${this.afAuth.auth.currentUser.uid}`).valueChanges();
    }

    return null;
  }

  getActive() {
    return this.active;
  }

  getDish(dish_id) {
    return this.afDB.object(`estabelecimentos/${this.active.id}/dishes/${dish_id}`).valueChanges();
  }

  cancelPreOrder() {
    const preOrder = this.afDB.object(`guests/${this.today()}/${this.active.id}/${this.afAuth.auth.currentUser.uid}`);
    if(preOrder) {
      return preOrder.remove();
    }
  }
}
