import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, AlertController, ToastController, MenuController, Platform } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

@IonicPage({
	name: 'page-auth',
	segment: 'auth',
	priority: 'high'
})

@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html'
})
export class AuthPage implements OnInit {
  public onLoginForm: FormGroup;
  public onRegisterForm: FormGroup;
  auth: string = "login";

  constructor(
		private _fb: 				FormBuilder,
		public nav: 				NavController,
		public forgotCtrl: 	AlertController,
		public menu:				MenuController,
		public toastCtrl: 	ToastController,
		public afAuth: 			AngularFireAuth,
		private facebook: 	Facebook,
    private platform: 	Platform
	) {
		this.menu.swipeEnable(false);
		this.menu.enable(false);
  }

  ngOnInit() {
    this.onLoginForm = this._fb.group({
      email: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });

    this.onRegisterForm = this._fb.group({
      fullName: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  // go to register page
  // register() {
  //   this.nav.setRoot(RegisterPage);
  // }

	loginFacebook() {
		if (this.platform.is('cordova')) {
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return this.afAuth.auth
					.signInWithCredential(facebookCredential)
					.then(res => {
						console.log('Login por facebook ok');
						this.login();
					})
					.catch(error => {
						console.error('Erro no login pelo facebook');
					});
      })
    } else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
					console.log(res)
					this.login()
				})
				.catch(error => {
					console.error('Erro no login pelo facebook');
				});
    }
  }

  // login and go to home page
  login() {
		console.log(this.afAuth.auth);
    this.nav.setRoot('page-home');
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            let toast = this.toastCtrl.create({
              message: 'Email was sended successfully',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }

}
