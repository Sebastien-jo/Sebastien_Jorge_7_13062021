import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';

@Component({   selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"], })
export class LoginComponent implements OnInit { 
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl!: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) { 
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.authService.login(this.f.email.value, this.f.password.value)
            .subscribe(
                data => {
                    console.log(data)
                    this.router.navigate(["posts"]);
                },
                error => {
                    alert('mot de passe ou email incorrect')
                    this.error = error;
                    this.loading = false;
                });
    }
}