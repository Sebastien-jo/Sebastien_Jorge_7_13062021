import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Comments } from 'src/app/models/Comments';
import { Post } from 'src/app/models/Post';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';
import { MessagesService } from 'src/app/services/message.service';
import { PostService } from 'src/app/services/post.service';
import { HttpResponse } from '../../models/HttpResponse';



@Component({
  selector: 'app-comments-form',
  templateUrl: './comments-form.component.html',
  styleUrls: ['./comments-form.component.scss']
})
export class CommentsFormComponent implements OnInit {
  commentsForm!: FormGroup;
  loading!: boolean;
  comments!: Comments;
  post!: Post;
  @Input() currentPost: any;
  @Input() currentComment: any;
  @Output() commentDisplayOff = new EventEmitter<boolean>();
  preloadData!: string;
  id!: number;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private commentService: CommentService,
              private postService: PostService,
              private authService: AuthService,
               private messageService: MessagesService) { }

  ngOnInit(): void {
    if (this.currentComment) {
      this.commentsForm = this.formBuilder.group({
        comments: [this.currentComment.comments, Validators.required],
      });
      this.preloadData = this.currentComment.comments;
     
    } else {
      this.commentsForm = this.formBuilder.group({
        comments: ['', Validators.required],
      });
    }
  }
  onSubmit(): void {
    const comments = {
      comments: this.commentsForm.get('comments')!.value,
      PostId: this.currentPost.id
    };
    

    const formData = new FormData();
    formData.append('comments',JSON.stringify(comments));
      this.commentService.postComment(comments)
        .subscribe(() => {
          this.loading = false;
          this.postService.fetchAll();
        });
        this.commentsForm.reset();
    };

     reloadCurrentPage() {
    window.location.reload();
   }

    
  
}
