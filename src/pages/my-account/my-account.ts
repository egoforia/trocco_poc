import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';
import { UsersFireService } from '../../providers/users-fire-service';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage({
	name: 'page-my-account',
	segment: 'my-account'
})

@Component({
    selector: 'page-my-account',
    templateUrl: 'my-account.html'
})
export class MyAccountPage {
  profiledata: Boolean = true;
  user: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public afAuth: AngularFireAuth, private usersService: UsersFireService) {
    this.user = {
      photoUrl: '',
      displayName: '',
      email: ''
    }

    const authSubscription = this.afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.usersService.getUser$(user.uid).subscribe((_user: any) => {
          this.user = JSON.parse(JSON.stringify(_user));
        });
      }

      authSubscription.unsubscribe();
    });
  }

  // process send button
  sendData() {
    // send booking info
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    // show message
    let toast = this.toastCtrl.create({
      showCloseButton: true,
      cssClass: 'profiles-bg',
      message: 'Your Data was Edited!',
      duration: 3000,
      position: 'bottom'
    });

    loader.present();

    setTimeout(() => {
      loader.dismiss();
      toast.present();
      // back to home page
      this.navCtrl.setRoot('page-home');
    }, 3000)
  }

}
