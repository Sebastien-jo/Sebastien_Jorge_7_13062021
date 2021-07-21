import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of, Subject } from "rxjs";
import { catchError, first } from "rxjs/operators";

import { Post } from "../models/Post";

import { ErrorHandlerService } from "./error-handler.service";
import { AuthService } from "./auth.service";
import { HttpResponse } from '../models/HttpResponse';
import { MessagesService } from "./message.service";


@Injectable({
  providedIn: "root",
})
export class PostService {
  private url = "http://localhost:3000/";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  posts$ = new Subject<any>();

  constructor(
    private http: HttpClient,
    private authService : AuthService,
    private messageService: MessagesService,
    private errorHandlerService: ErrorHandlerService
  ) {}

    private log(message: string): void {
    this.messageService.add(message);
  }

  fetchAll(): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.url}api/posts/getPosts`, { responseType: "json" })
      .pipe(
        catchError(this.errorHandlerService.handleError<Post[]>("fetchAll", []))
      );
  }

    getPostById(id: number) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.url}api/posts/one/${id}`).subscribe(
        () => {
          resolve;
        },
        (error) => {
          reject(error);
        }
      );
    });
  }



  createPost(newPost: Post, attachment : File){
     return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('post', JSON.stringify(newPost));
        formData.append('attachment', attachment);
        return this.http.post<any>(`${this.url}api/posts/`,  formData).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
    }


// projet d'amélioration
modifyPost(id: string, post: Post, attachment: string | File) {
    return new Promise((resolve, reject) => {
      if (typeof attachment === 'string') {
        this.http.put('http://localhost:3000/api/posts/' + id, post).subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        const formData = new FormData();
        formData.append('post', JSON.stringify(post));
        formData.append('attachment', attachment);
        this.http.put('http://localhost:3000/api/posts/' + id, formData).subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }
  deletePost(postId: string): Observable<{}> {
    return this.http
      .delete<Post>(`${this.url}api/posts/${postId}`, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<Post>("deletePost"))
      );
  }


 

}

