  
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators, PatternValidator } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage!: string;
  submitted = false;
  constructor(private authService: AuthService,
     private router: Router,) {}

  ngOnInit(): void {
    this.signupForm = this.createFormGroup();
  }
//initialisation du formulaire d'inscription
  createFormGroup(): FormGroup {
    return new FormGroup({
      firstName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
      ]),
    });
  }

  signup(): void {
    this.authService.signup(this.signupForm.value).subscribe((msg) => {
      console.log(msg);
    });
    if("error"){
      alert("une erreur s'est produite, veuillez ressayer !")
    }else{
      this.router.navigate(['login'])
    }
  }
}

