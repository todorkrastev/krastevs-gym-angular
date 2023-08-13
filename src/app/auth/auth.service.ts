import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private uiService: UIService) { }

    initAuthListener() {
        this.afAuth.authState
            .subscribe(user => {
                if (user) {
                    this.isAuthenticated = true;
                    this.authChange.next(true);
                    this.router.navigate(['/training']);
                } else {
                    this.trainingService.cancelSubscriptions();
                    this.authChange.next(false);
                    this.router.navigate(['/']);
                    this.isAuthenticated = false;
                }
            });
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar(error.message, undefined, 7000);
            })
    }

    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth
            .signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar(error.message, undefined, 7000);
            });
    }

    logout() {
        this.afAuth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }
}