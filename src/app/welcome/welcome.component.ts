import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { ActivityService } from './activity.service';
import { Subscription } from 'rxjs';
import { Activity } from './activity.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy, DoCheck {
  activities: Activity[] = [];
  isAuth: boolean | undefined;
  private activitySubscription: Subscription = new Subscription;

  constructor(private activityService: ActivityService, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.isAuth = this.authService.isAuth();
    this.activitySubscription = this.activityService.availableActivities.subscribe(
      (activities: Activity[]) => {
        this.activities = activities;
      });
    this.fetchActivities();
  }

  ngDoCheck(): void {
    this.isAuth = this.authService.isAuth();
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
