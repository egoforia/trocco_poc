import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompleteUserInformationPage } from './complete-user-information';

@NgModule({
  declarations: [
    CompleteUserInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(CompleteUserInformationPage),
  ],
})
export class CompleteUserInformationPageModule {}
