import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Comments } from '../models/Comments';
import { Post } from '../models/Post';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';
import { CommentService } from '../services/comment.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  posts$!: Observable<Post[]>;
  comments!: Comments[];
  userId!: string;
  isAdmin!: boolean;
  form!: FormGroup;
  mode!: string;
  isOpen =  false;
  errorMsg!: string;
  loading!: boolean;
  postSub!: Subscription;
  currentPost!: number;
  currentComment!: number;
  commentDisplay = false;
  user!: User;
  data: any;
  updateForm!: FormGroup;
  
  constructor(
    private commentService: CommentService,
    private postService: PostService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.commentDisplay = true;
    this.posts$ = this.fetchAll()
    this.fetchAll().subscribe(response =>{
      this.data = response;
      console.log(this.data)
    });
    console.log(this.posts$)
    this.userId = this.authService.getUserById();
    this.isAdmin = this.authService.isAdmin();
    console.log(this.userId)
    this.posts$.forEach(post => console.log(post));
    this.user = this.authService.currentUserValue.user;
    console.log(this.user)
    this.updateForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup{
    return new FormGroup({
      firstName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
    })
  }

  updateUser(): void{
    this.authService.updateUser(this.updateForm.value).subscribe((msg) => {
      console.log(msg);
    });
  }


  fetchAll(): Observable<Post[]> {
    return this.postService.fetchAll();
    
  }

  createPost(): void {
    this.posts$ = this.fetchAll();
  }

  delete(postId: string): void {
    this.postService
      .deletePost(postId)
      .subscribe(() => (this.posts$ = this.fetchAll()));
  }

  deleteUser(userId: string): void{
    this.authService.deleteUser(userId)
   .subscribe(() => (this.authService.logoutUser()));
   
  }

  modifyPost(): void {
  
  }
 

  deleteComment(commentId: string): void {
    this.commentService
    .deleteComment(commentId)
    .subscribe(() => (this.posts$ = this.fetchAll()));
  }
    reloadCurrentPage() {
    window.location.reload();
   }


}
