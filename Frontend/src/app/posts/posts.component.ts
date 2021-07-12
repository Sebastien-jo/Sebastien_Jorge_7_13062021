import { Component, OnInit } from "@angular/core";

import { Observable } from "rxjs";

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
  userId!: string;
  admin!: boolean;
  form!: FormGroup;
  comments!:Comments;
  mode!: string;
  isOpen =  false;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    public authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.posts$ = this.fetchAll();
    this.userId = this.authService.getUserById();
    console.log(this.userId)
    console.log(this.posts$)
    this.posts$.forEach(post => console.log(post));
    this.initEmptyForm();
        this.route.params.subscribe(
      (params) => {
        if (!params.id) {
          this.mode = 'new';
          this.initEmptyForm();
        } else {
          this.mode = 'edit';
         
          
        }
      }
    );
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

  initEmptyForm(){
  this.form = this.formBuilder.group({
    comments: [null, Validators.required]
  });
  }

  onSubmit(){
  const newComment = new Comments();
  newComment.comments = this.form.get('comments')!.value;
      if (this.mode === 'new') {
      this.postService.addComment(newComment).then(
        (response) => {
          console.log(response);         
        }
      ).catch(
        (error) => {
          console.error(error);
        }
      );
    }
  }


}




