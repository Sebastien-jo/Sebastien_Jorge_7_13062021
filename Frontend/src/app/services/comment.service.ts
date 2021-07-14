import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError, first } from "rxjs/operators";

import { Post } from "../models/Post";

import { ErrorHandlerService } from "./error-handler.service";
import { AuthService } from "./auth.service";
import { Comments } from '../models/Comments';
import { MessagesService } from './message.service';
import { HttpResponse } from '../models/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private url = "http://localhost:3000/";

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };
  constructor(
    private http: HttpClient,
    private authService : AuthService,
    private errorHandlerService: ErrorHandlerService,
    private messageService: MessagesService
  ) {}



      updateComment(comments: any): Observable<Comments> {
    return this.http.put<Comments>(`${this.url}api/posts/comment`, comments)
      .pipe(
        catchError(this.errorHandlerService.handleError('updateComment', comments))
      );
  }

  postComment(comments: any): Observable<Comments> {
    return this.http.post<Comments>(`${this.url}api/posts/comment`, comments)
      .pipe(
        catchError(this.errorHandlerService.handleError('addPost', comments))
      );
  }


  deleteComment(idComment: object): Observable<object> {
    return this.http.request('DELETE', `${this.url}api/posts/comment/${idComment}`, { body: idComment })
      .pipe(
        catchError(this.errorHandlerService.handleError('deleteComment', idComment))
      );
  }

}
