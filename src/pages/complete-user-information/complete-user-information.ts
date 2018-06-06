import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { IonicPage, NavController, AlertController, ToastController, MenuController, Platform } from 'ionic-angular';

import * as firebase from 'firebase/app';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsersFireService } from '../../providers/users-fire-service';


@IonicPage({
    name: 'page-complete-user-information',
    segment: 'complete-user-information',
    priority: 'high'
})
@Component({
    selector: 'page-complete-user-information',
    templateUrl: 'complete-user-information.html',
})
export class CompleteUserInformationPage {
    public onCompleteUserInformationForm: FormGroup;
    public user: any;

    constructor(
        private _fb: FormBuilder,
        public nav: NavController,
        public forgotCtrl: AlertController,
        public menu: MenuController,
        public toastCtrl: ToastController,
        public afAuth: AngularFireAuth,
        private platform: Platform,
        private usersService: UsersFireService,
        public firebase: Firebase,
        public afDB: AngularFireDatabase
    ) {
        this.initializeFirebase();
        this.menu.swipeEnable(false);
        this.menu.enable(false);
    }

    initializeFirebase() {
        const authSubscription = this.afAuth.authState.subscribe(user => {
            console.log('authState subscribed user: ', JSON.stringify(user, null, 2));
            this.user = user;
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad CompleteUserInformationPage');
    }

    ngOnInit() {
        this.onCompleteUserInformationForm = this._fb.group({
            'cpf': ['', [
                Validators.required,
                Validators.minLength(11)
            ]],
            'phoneNumber': ['', [
                Validators.required,
                Validators.minLength(9),
                Validators.maxLength(11)
            ]]
        });
    }

    goToHome() {
        this.nav.setRoot('page-home');
    }

    completeSignUp() {
        const form = this.onCompleteUserInformationForm;
        const user = JSON.parse(JSON.stringify(this.user));

        if(form.valid) {
            user.cpf = form.value.cpf;
            user.phoneNumber = form.value.phoneNumber;

            this.usersService.saveUser(user).then(res => {
                this.goToHome();
            });
        } else {
            this.toast('Dados incorretos');
        }
    }
}
