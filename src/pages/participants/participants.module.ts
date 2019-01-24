import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParticipantsPage } from './participants';

@NgModule({
  declarations: [
    ParticipantsPage,
  ],
  imports: [
    IonicPageModule.forChild(ParticipantsPage),
  ],
})
export class ParticipantsPageModule {}
