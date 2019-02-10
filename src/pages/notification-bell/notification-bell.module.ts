import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationBellPage } from './notification-bell';

@NgModule({
  declarations: [
    NotificationBellPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationBellPage),
  ],
})
export class NotificationBellPageModule {}
