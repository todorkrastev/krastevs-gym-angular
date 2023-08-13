import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CoursesService } from './courses.service';
import { Course } from './course.model';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'time', 'activity', 'duration', 'trainer', 'room'];
  dataSource = new MatTableDataSource<Course>();
  private exChangedSubscription: Subscription = new Subscription;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private courseService: CoursesService) {

  }

  ngOnInit(): void {
    //this.dataSource.data = this.courseService.fetchAvailableCourses();
    //this.courseService.fetchAvailableCourses();
    this.courseService.availableCourses.subscribe(
      (courses: Course[]) => {
        this.dataSource.data = courses;
      });
    this.courseService.fetchAvailableCourses();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.dataSource.filter = target.value.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.exChangedSubscription) {
      this.exChangedSubscription.unsubscribe();
    }
  }
}
