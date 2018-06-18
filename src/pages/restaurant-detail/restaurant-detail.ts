import {Component} from '@angular/core';
import {IonicPage, ActionSheetController, ActionSheet, NavController, NavParams, ToastController} from 'ionic-angular';

import {RestaurantFireService} from '../../providers/restaurant-fire-service';
import {DishService} from '../../providers/dish-service-mock';
import {CartService} from '../../providers/cart-service-mock';
import {DishCategoriesService} from '../../providers/dish-categories-service';

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
    categories: Array<any>;
    guest: Observable<any>;
    verifyPage: any;
    selectedCategory: String = '';

    constructor(
        public actionSheetCtrl: ActionSheetController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public cartService: CartService,
        public restaurantService: RestaurantFireService,
        public dishService: DishService,
        public toastCtrl: ToastController,
        private dishCategoriesService: DishCategoriesService
        ) {
        try {
            this.restaurant = this.restaurantService.getActive();
            this.dishes = this.restaurant.dishes;
            this.categories = this.dishCategoriesService.findAll(this.dishes);
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

    selectCategoryToView(category) {
        this.selectedCategory = category;
    }

    resetSelectedCategory() {
        this.selectedCategory = '';
    }

    redirectToCorrectPage() {
        this.verifyPage = this.restaurantService.getGuestSubscriber().subscribe((guest: any) => {
            this.guest = guest;

            if(guest) {
                switch (guest["status"]) {
                    case 'ok':
                        this.navCtrl.setRoot('page-home');
                        break;
                    }
            }
        });
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

    showMenu() {
        if(!this.guest) {
            return false;
        } else {
            if(this.guest.status == 'waiting') {
                return false;
            } else {
                return true;
            }
        }
    }

    filterDishesByCategory(category) {
        return this.dishes.filter((dish) => dish.category == category);
    }
}
