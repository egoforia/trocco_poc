import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, AlertController, MenuController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { UsersFireService } from '../../providers/users-fire-service';
import User from '../../interfaces/User';

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
    public user: User;

    constructor(
        private _fb: FormBuilder,
        public nav: NavController,
        public forgotCtrl: AlertController,
        public menu: MenuController,
        public afAuth: AngularFireAuth,
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
            this.user = JSON.parse(JSON.stringify(user));

            this.usersService.getUser$(user.uid).subscribe(_user => {
                if(_user) {
                    this.user = JSON.parse(JSON.stringify(_user));

                    if (this.user.phoneNumber) {
                        this.goToHome();
                    }
                }

                authSubscription.unsubscribe();
            });
        });
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
        }
    }
}
