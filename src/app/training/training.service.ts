import { Subject, Subscription, map } from "rxjs";
import { Exercise } from "./exercise.model";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { UIService } from "../shared/ui.service";

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise | null>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise | any;
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService) {

    }

    fetchAvailableExercises() {
        this.uiService.loadingStateChanged.next(true);
        debugger;
        this.fbSubs
            .push(this.db
                .collection("availableExercises")
                .snapshotChanges()
                .pipe(
                    map(docArray => {
                        return docArray.map(doc => {
                            let data = doc.payload.doc.data() as Exercise;
                            return {
                                id: doc.payload.doc.id,
                                name: data.name,
                                duration: data.duration,
                                calories: data.calories,
                                //date: data.date,
                                //state: data.state
                            };
                        });
                    }))
                .subscribe(/*(exercises: Exercise[]) =>*/ {
                    next: (exercises) => {
                        debugger;
                        this.uiService.loadingStateChanged.next(false);
                        this.availableExercises = exercises;
                        this.exercisesChanged.next([...this.availableExercises]);
                    },
                    error: (error) => {
                        debugger;
                        this.uiService.loadingStateChanged.next(false);
                        this.uiService.showSnackbar('Fetching exercises failed, please try again later', undefined, 7000);
                        this.exerciseChanged.next(null);
                    }
                }));
    }

    startExercise(selectedId: string) {
        debugger;
        // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
        // this.db.doc('availableExercises/' + selectedId).delete();

        this.runningExercise = this.availableExercises.find(
            ex => ex.id === selectedId
        );
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        debugger;
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    };

    cancelExercise(progress: number) {
        debugger;
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    };

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs
            .push(this.db
                .collection('finishedExercises')
                .valueChanges()
                // todo: you need to fix this "any" somehow
                .subscribe((exercises: Exercise[] | any) => {
                    this.finishedExercisesChanged.next(exercises);
                }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}