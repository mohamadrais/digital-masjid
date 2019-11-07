import { MosqueEvent } from '../models/MosqueEvents'
import { MosqueEventsGroup } from '../models/MosqueEventsGroup'
import { AppConstants } from '../constants/app-constants'
import * as moment from 'moment';
import { Injectable } from '@angular/core';

@Injectable()
export class MosqueEventsUtil {

    active: MosqueEventsGroup;
    upcoming: MosqueEventsGroup;
    history: MosqueEventsGroup;
    mosqueEvent: MosqueEvent;

    groupMosqueEvents(mosqueEvents) {
        let currentDTM = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
        /**
         * 1. split to 3 array groups <upcoming | ongoing | history>
         * 2. pass each group in 1 to sort from latest to earliest
         * 3. concate 3 groups arrays after 2
         * 
         */

        let data = [];

        this.active = new MosqueEventsGroup();
        this.upcoming = new MosqueEventsGroup();
        this.history = new MosqueEventsGroup();

        this.active.groupName = AppConstants.EVENT_ACTIVE;
        this.upcoming.groupName = AppConstants.EVENT_UPCOMING;
        this.history.groupName = AppConstants.EVENT_HISTORY;

        mosqueEvents = this.sortByDates(mosqueEvents);

        for (let i = 0; i < mosqueEvents.length; i++) {
            let _mosqueEvent = new MosqueEvent();
            _mosqueEvent = mosqueEvents[i];

            if (currentDTM < mosqueEvents[i].event_start_date) {
                this.upcoming.mosqueEvents.push(_mosqueEvent);
            } else if ((mosqueEvents[i].event_start_date <= currentDTM) && (currentDTM< mosqueEvents[i].event_end_date)) {
                this.active.mosqueEvents.push(_mosqueEvent);
            } else if (mosqueEvents[i].event_end_date <= currentDTM) {
                this.history.mosqueEvents.push(_mosqueEvent);
            }

        }

        data.push(this.active, this.upcoming, this.history);

        return data;

    }

    sortByDates(_array) {
        return _array.sort((a: MosqueEvent, b: MosqueEvent) => (a.event_start_date < b.event_start_date || a.event_end_date < b.event_end_date) ? 1 : -1);
    }


}