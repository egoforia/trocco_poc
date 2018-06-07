import {Component} from '@angular/core';
import {IonicPage, ActionSheetController, ActionSheet, NavController, NavParams, ToastController} from 'ionic-angular';

import {RestaurantFireService} from '../../providers/restaurant-fire-service';
import {DishService} from '../../providers/dish-service-mock';
import {CartService} from '../../providers/cart-service-mock';

import { Observable } from 'rxjs/Observable';

import leaflet from 'leaflet';

@IonicPage({
	name: 'page-restaurant-detail',
	segment: 'restaurant'
})

@Component({
    selector: 'page-restaurant-detail',
    templateUrl: 'restaurant-detail.html'
})
export class RestaurantDetailPage {
	param: number;

    map;
    markersGroup;
    restaurant: any;
    restaurantopts: String = 'menu';
    dishes: Array<any>;
    public guest: Observable<any>;
    verifyPage: Observable<any>;

    constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public cartService: CartService, public restaurantService: RestaurantFireService, public dishService: DishService, public toastCtrl: ToastController) {
        try {
            this.restaurant = this.restaurantService.getActive();
            this.dishes = this.restaurant.dishes;
            this.redirectToCorrectPage();
        } catch(e) {
            this.navCtrl.setRoot('page-home');
        }
    }

    openDishDetail(dish, restaurant) {
        this.navCtrl.push('page-dish-detail', {
            'id': dish.id
        });
    }

    redirectToCorrectPage() {
        this.verifyPage = this.restaurantService.getGuestSubscriber().subscribe(guest => {
            this.guest = guest;

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
                        this.verifyPage.unsubscribe()
                        this.navCtrl.setRoot('page-home');
                        break;
                    default:
                        this.verifyPage.unsubscribe();
                        this.navCtrl.setRoot('page-home');
                        break;
                }
            } else {
                this.verifyPage.unsubscribe();
            }
        });
    }

    favorite(restaurant) {
      // this.restaurantService.favorite(restaurant)
      //     .then(restaurant => {
      //         let toast = this.toastCtrl.create({
      //             message: 'Restaurant added to your favorites',
      //             cssClass: 'mytoast',
      //             duration: 2000
      //         });
      //         toast.present(toast);
      //     });
    }

    share(restaurant) {
        let actionSheet: ActionSheet = this.actionSheetCtrl.create({
            title: 'Share via',
            buttons: [
                {
                    text: 'Twitter',
                    handler: () => console.log('share via twitter')
                },
                {
                    text: 'Facebook',
                    handler: () => console.log('share via facebook')
                },
                {
                    text: 'Email',
                    handler: () => console.log('share via email')
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => console.log('cancel share')
                }
            ]
        });

        actionSheet.present();
    }

    openCart() {
        this.navCtrl.push('page-cart');
    }

    openCheck() {
        this.navCtrl.push('page-cart');
    }

    openOrder() {
        this.navCtrl.push('page-orders');
    }

    showMarkers() {
        if (this.markersGroup) {
            this.map.removeLayer(this.markersGroup);
        }
        this.markersGroup = leaflet.layerGroup([]);

        let marker: any = leaflet.marker([this.restaurant.lat, this.restaurant.long]);
        marker.data = this.restaurant;
        this.markersGroup.addLayer(marker);

        this.map.addLayer(this.markersGroup);
    }

    showMap() {
      setTimeout(() => {
          this.map = leaflet.map("map-detail").setView([this.restaurant.lat, this.restaurant.long], 16);
          leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
              attribution: 'Tiles &copy; Esri'
          }).addTo(this.map);
          this.showMarkers();
      }, 200)
    }

    cancelOrderAndBackToHome() {
        if(this.verifyPage) {
            this.verifyPage.unsubscribe();
            this.restaurantService.cancelPreOrder();
        }
    }

}
