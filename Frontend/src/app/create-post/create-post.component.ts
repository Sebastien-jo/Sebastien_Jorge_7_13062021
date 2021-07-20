import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators, NgForm, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { first } from "rxjs/operators";

import { Post } from "src/app/models/Post";

import { AuthService } from "src/app/services/auth.service";
import { PostService } from "src/app/services/post.service";

@Component({
  selector: "app-create-post",
  templateUrl: "./create-post.component.html",
  styleUrls: ["./create-post.component.scss"],
})
export class CreatePostComponent implements OnInit {
  form!: FormGroup;
  mode!: string;
  loading!: boolean;
  post!: Post;
  errorMsg!: string;
  imagePreview!: string;
  isOpen = false;
  
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private postService: PostService,
              private authService: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe(
      (params) => {
        if (!params.id) {
          this.mode = 'new';
          this.initEmptyForm();
          this.loading = false;
        } else {
          this.mode = 'edit';
          this.postService.getPostById(params.id).then(
            () => {
              this.loading = false;
            }
          ).catch(
            (error) => {
              this.errorMsg = JSON.stringify(error);
            }
          );
        }
      }
    );
  }
//formulaire du post
  initEmptyForm() {
    this.form = this.formBuilder.group({
      title: [null, Validators.required],
      content: [null, Validators.required],
      attachment: null,
    });
  }
//projet d'amelioration du formulaire pour modification du post
  initModifyForm(post: Post) {
    this.form = this.formBuilder.group({
      title: [this.post.title, Validators.required],
      content: [this.post.content, Validators.required],
      attachment: [this.post.attachment, Validators.required],
    });
    this.imagePreview = this.post.attachment;
  }

// envoie des informations récupéré dans le formulaire
  onSubmit() {
    this.loading = true;
    const newPost = new Post();
    newPost.title = this.form.get('title')!.value;
    newPost.content = this.form.get('content')!.value;
    if (this.mode === 'new') {
      this.postService.createPost(newPost, this.form.get('attachment')!.value).then(
        (response) => {
          console.log(response);
          this.loading = false;
          this.router.navigate(['/posts']);
        }
      ).catch(
        (error) => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
        }
      );
    } else if (this.mode === 'edit') {
      this.postService.modifyPost(this.post.id, newPost, this.form.get('attachment')!.value).then(
        (response) => {
          console.log(response);
          this.loading = false;
          this.router.navigate(['/posts']);
        }
      ).catch(
        (error) => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
        }
      );
    }
    this.form.reset();
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.get('attachment')!.setValue(file);
    this.form.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

   reloadCurrentPage() {
    window.location.reload();
   }


}