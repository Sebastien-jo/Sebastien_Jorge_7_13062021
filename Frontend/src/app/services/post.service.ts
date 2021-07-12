import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, Subject } from "rxjs";
import { catchError, first } from "rxjs/operators";

import { Post } from "../models/Post";
import { User } from "../models/User";
import { ErrorHandlerService } from "./error-handler.service";
import { AuthService } from "./auth.service";
import { Comments } from "../models/Comments";


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
    private errorHandlerService: ErrorHandlerService
  ) {}

  fetchAll(): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.url}api/posts/getPosts`, { responseType: "json" })
      .pipe(
        catchError(this.errorHandlerService.handleError<Post[]>("fetchAll", []))
      );
  }

    getPostById(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:3000/api/posts/' + id).subscribe(
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


 
  modifyPost(id: string, post: Post, image: string | File) {
    return new Promise((resolve, reject) => {
      if (typeof image === 'string') {
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
        formData.append('image', image);
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

  deleteComment(id: string): Observable<{}> {
    return this.http
      .delete(`${this.url}api/posts/comment/${id}`, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<Post>("deleteComment"))
      );
  }

 addComment(newComment: Comments){
     return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('post', JSON.stringify(newComment));
        
        return this.http.post<any>(`${this.url}api/posts/comment`,  formData).subscribe(
        (response: { message: string }) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
    }

 getComments(){
   return this.http.get<any>(`${this.url}api/posts/comments`, this.httpOptions)
 }

 

}
function newSubject<T>(): any {
  throw new Error("Function not implemented.");
}

