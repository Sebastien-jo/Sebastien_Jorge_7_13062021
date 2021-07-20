import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuth!: boolean;
  authSubscription!: Subscription;
  currentUser!: User;

  constructor(private auth: AuthService,
              private router: Router) { 
                //checks isAuth event emitter in login to see if it's true.  If it is, subscribe the result to our local isAuth variable
    this.auth.isUserLoggedIn$
      .subscribe((isAuth: boolean) => this.isAuth = isAuth );

    //if token exists, authenticated
    if (this.auth.currentUser) {
      this.isAuth = true;
      localStorage.getItem('currentUser');
      
    //if not, not authenticated
    } else {
      this.isAuth = false;
    }

              }
//récupération des infos utilisateur dans le local storage
  ngOnInit() {
localStorage.getItem('currentUser');
  
  }
// à la déconnexion de l'utilisateur suppression des infos utilisateur dans le local storage
  onLogout() {
    this.auth.logoutUser();
    this.isAuth = false;
    this.router.navigate(['login'])    
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}

