import { NgModule } from "@angular/core";
import { CoursesComponent } from "./courses.component";
import { CourseRoutingModel } from "./courses-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        CoursesComponent
    ],
    imports: [
        SharedModule,
        CourseRoutingModel
    ]
})
export class CoursesModule {

}