import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivityService } from './activity.service';
import { Subscription } from 'rxjs';
import { Activity } from './activity.model';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  activities: Activity[] = [];
  private activitySubscription: Subscription = new Subscription;

  constructor(private activityService: ActivityService) {

  }

  ngOnInit(): void {
    debugger;
    this.activitySubscription = this.activityService.availableActivities.subscribe(
      (activities: Activity[]) => {
        this.activities = activities;
      });
    this.fetchActivities();
  }

  fetchActivities() {
    this.activityService.fetchAvailableActivities();
  }

  ngOnDestroy(): void {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
  }
}
