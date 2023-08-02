import { Subject } from "rxjs";
import { Exercise } from "./exercise.model";

export class TrainingService {
    exerciseChanged = new Subject<Exercise | null>();
    private availableExercises: Exercise[] = [
        { id: 'squats', name: 'Squats', duration: 30, calories: 8 },
        { id: 'bulgarians', name: 'Bulgarians', duration: 180, calories: 15 },
        { id: 'leg-press', name: 'Leg Press', duration: 5, calories: 2 },
    ];

    private runningExercise: Exercise | any;
    private exercises: Exercise[] = [];

    getAvailableExercises() {
        return this.availableExercises.slice();
    }

    startExercise(selectedId: string) {
        debugger;
        this.runningExercise = this.availableExercises.find(
            ex => ex.id === selectedId
        );
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        debugger;
        this.exercises.push({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    };

    cancelExercise(progress: number) {
        debugger;
        this.exercises.push({
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

    getCompletedOrCancelledExercises() {
        return this.exercises.slice();
    }
}