import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchMosquePage } from './search-mosque';

@NgModule({
  declarations: [
    SearchMosquePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchMosquePage),
  ],
})
export class SearchMosquePageModule {}
