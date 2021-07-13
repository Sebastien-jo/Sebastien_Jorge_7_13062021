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
  isOpen = false;
  post!: Post;
  @Input() currentPost: any;
  @Input() currentComment: any;
  @Output() commentDisplayOff = new EventEmitter<boolean>();
  preloadData!: string;
  postId!: number;
  

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private commentService: CommentService,
              private postService: PostService,
              private authService: AuthService,
               private messageService: MessagesService) { }

  ngOnInit(): void {
   this.postId = +this.route.snapshot.paramMap.get('id')!;
   
  }

 onSubmit(event: { target: { value: string; }[]; }): void{
   const content: string = event.target[0].value;
    const postId: number = parseInt(event.target[1].value, 10);
    this.commentService.postComment(postId, content)
      .subscribe((response: HttpResponse) => {
        if (response.status === 201) {
          this.getPostById();
        } else {
          this.messageService.add(`Erreur: impossible d'ajouter ce commentaire`);
        }
      });
 }
 

}
