import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { CartFireService } from './cart-fire-service';
import { RestaurantFireService } from './restaurant-fire-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class OrdersFireService {
  ordersRef: AngularFireList<{}>;
  ordersSubject: BehaviorSubject<any>;
  constructor(private afDB: AngularFireDatabase, private cartService: CartFireService, private restaurantService: RestaurantFireService, private afAuth: AngularFireAuth) {
    this.ordersSubject = new BehaviorSubject<any>({
      dishes: []
    });

    try {
      const authSubscription = this.afAuth.authState.subscribe((user: any) => {
        authSubscription.unsubscribe();
        const uid = this.afAuth.auth.currentUser.uid;
        const today = new Date().toISOString().slice(0, 10);
        const restaurant_id = this.restaurantService.getActive().id;
        console.log(`orders/${restaurant_id}/${today}/${uid}`);

        this.ordersRef = this.afDB.list(`orders/${restaurant_id}/${today}`, ref => {
          // return ref.orderByKey().limitToLast(1);
          return ref.orderByChild('user_id').equalTo(uid).limitToLast(1);
        });

        this.ordersRef.valueChanges()
          .map(orders => {
            console.log('mapped orders: ', orders);

            return orders.map((order: any) => {
              return this.getDishesObservables(order);
            });
          })
          .subscribe(orders => {
            console.log('subscribed orders: ', orders);

            if (orders[0])
              this.ordersSubject.next(orders[0]);
          });

          console.log('this.ordersRef: ', this.ordersRef);
        });
    } catch (e) {
      console.error(e);
    }
  }

  addDish(dish, quantity) {
    let order = this.ordersSubject.getValue();
    // reset order if it has been delivered or canceled
    if (order.status == 'delivered' || order.status == 'canceled')
      order = {dishes: []};

    order.dishes.push({dish: new BehaviorSubject<any>(dish), quantity: quantity, dish_id: dish.id});
    this.ordersSubject.next(order);
    // debugger;
  }

  addToCart() {
    let order = this.ordersSubject.getValue();
    return this.cartService.addToCart(order.dishes);
  }

  getDishesObservables(order) {
    for (let i in order.dishes) {
      order.dishes[i].dish = this.restaurantService.getDish(order.dishes[i].dish_id);
    }

    return order;
  }

  getLastOrder() {
    let order = this.ordersSubject.getValue();
    order = this.getDishesObservables(order);
    this.ordersSubject.next(order);

    return this.ordersSubject;
  }

}
