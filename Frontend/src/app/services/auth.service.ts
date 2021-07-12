import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, BehaviorSubject, of } from "rxjs";
import { first, catchError, map, share } from "rxjs/operators";

import { User } from "../models/User";
import { ErrorHandlerService } from "./error-handler.service";




@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "http://localhost:3000/";
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId!: string;
  

  httpOptions: { headers: HttpHeaders } = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')|| '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
        
       
  }
 
  public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http
      .post<User>(`${this.url}api/auth/signup`, user, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("signup"))
      );
  }
  
  getUserById() {
    return this.currentUserSubject.value.user.id;
  }


  getToken(){
    return this.currentUser;
  }

     login(email: string, password: string) {
        return this.http.post<any>(`${this.url}api/auth/login`, { email, password })
            .pipe(map(user => {
              if (user && user.token){
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                this.userId = user.user.id;
                console.log(user)
                this.isUserLoggedIn$.next(true);
              }
                return user;                
            }));
    }



 

    logoutUser() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.isUserLoggedIn$.next(false);
        this.router.navigate(['login']);
    }


}

  