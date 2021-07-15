import { Component, OnInit } from "@angular/core";

import { Observable, Subscription } from "rxjs";

import { PostService } from "src/app/services/post.service";
import { AuthService } from "src/app/services/auth.service";
import { Comments } from "src/app/models/Comments"
import { Post } from "src/app/models/Post";
import { User } from "src/app/models/User";
import { FormGroup, FormBuilder, Validators} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.scss"],
})
export class PostsComponent implements OnInit {
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
  data: any;

  
  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    public authService: AuthService,
    private route: ActivatedRoute,
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


}




