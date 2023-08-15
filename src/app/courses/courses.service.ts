import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subject } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { Course } from './course.model';

@Injectable()
export class CoursesService {
  //coursesChanged = new Subject<Course[]>;
  //private availableCourses: Course[] = [];
  availableCourses = new Subject<Course[]>;

  constructor(private db: AngularFirestore, private uiService: UIService) {

  }

  fetchAvailableCourses() {
    this.uiService.loadingStateChanged.next(true);
    this.db
      .collection('availableCourses')
      .valueChanges()
      .subscribe({
        next: (courses: Course[] | any) => {
          this.uiService.loadingStateChanged.next(false);
          this.availableCourses.next(courses);
        },
        error: (error) => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar('Fetching exercises failed, please try again later', undefined, 7000);
        }
      })
  }
}