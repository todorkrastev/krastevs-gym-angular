import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subject } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { Activity } from './activity.model';

@Injectable()
export class ActivityService {
    availableActivities = new Subject<Activity[]>;

    constructor(private db: AngularFirestore, private uiService: UIService) {

    }

    fetchAvailableActivities() {
        this.uiService.loadingStateChanged.next(true);
        this.db
          .collection('activities')
          .valueChanges()
          .subscribe({
            next: (activities: Activity[] | any) => {
              this.uiService.loadingStateChanged.next(false);
              this.availableActivities.next(activities);
            },
            error: (error) => {
              this.uiService.loadingStateChanged.next(false);
              this.uiService.showSnackbar('Fetching exercises failed, please try again later', undefined, 7000);
            }
          })
      }

}
