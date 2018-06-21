import { Component, ViewChild } from '@angular/core';
import { IonicPage, Slides, NavController, MenuController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { RestaurantFireService } from '../../providers/restaurant-fire-service';

@IonicPage({
	name: 'page-walkthrough',
	segment: 'walkthrough',
	priority: 'high'
})

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html',
})
export class WalkthroughPage {
	@ViewChild(Slides) slides: Slides;
  showSkip = true;
  dir: string = 'ltr';
  user: any;
  shouldShowLoginSlide: boolean;

  slideList: Array<any> = [
    {
      title: "What is <strong>Food</strong>Ionic?",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque maximus, dui accumsan cursus lacinia, nisl risus.",
      image: "assets/img/foodIonic-ico.png",
    },
    {
      title: "Why FoodIonic?",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque maximus, dui accumsan cursus lacinia, nisl risus.",
      image: "assets/img/foodIonic-ico.png",
    },
    {
      title: "Your delicious dish is coming!",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque maximus, dui accumsan cursus lacinia, nisl risus.",
      image: "assets/img/foodIonic-ico.png",
    }
  ];

  constructor(public navCtrl: NavController, public menu: MenuController, private afAuth: AngularFireAuth, private restaurantService: RestaurantFireService) {
    this.menu.swipeEnable(false);
    this.menu.enable(false);
    this.shouldShowLoginSlide = false;
    this.afAuth.authState.subscribe((user: any) => {
      if(user) {
        this.user = user;
        this.restaurantService.recoveryActive((_res) => {
          this.restaurantService.getGuestSubscriber().subscribe((guest: any) => {
            if (guest) {
              this.user.has_guest = true;
            } else {
              this.user.has_guest = false;
            }
          });
        });
      } else {
        this.shouldShowLoginSlide = true;
      }
    });
  }

  onSlideNext(slide) {
    if(slide == this.slideList[this.slideList.length - 1]) {
      if(this.user) {
        if(this.user.has_guest) {
          this.navCtrl.setRoot('page-restaurant-detail');
        } else {
          this.navCtrl.setRoot('page-home');
        }
      } else {
        this.slides.slideNext(300);
      }
    } else {
      this.slides.slideNext(300)
    }
  }

	onSlidePrev() {
    this.slides.slidePrev(300);
  }

  onLastSlide() {
    if(this.user) {
      console.log(this.user)
      if(this.user.has_guest) {
        this.navCtrl.setRoot('page-restaurant-detail');
      } else {
        this.navCtrl.setRoot('page-home');
      }
    } else {
      this.slides.slideTo(3, 300);
    }
  }

  openHomePage() {
  	this.navCtrl.setRoot('page-home');
  }

  openAuthPage() {
    this.navCtrl.setRoot('page-auth');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalkthroughPage');
  }
}
