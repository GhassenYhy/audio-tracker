import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { AuthenticationService } from '../shared/services/authentication';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';

@Component({
    selector: 'login',
    styleUrls: ['./login.component.css'],
    templateUrl: "./login.component.html"
})

export class LoginComponent implements OnInit {

    public rForm: FormGroup;
    @Input() public email: string = '';
    @Input() public password: string = '';
    @ViewChild('errorMessage') public errorMessage: ElementRef;
    public error = null;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private authService: AuthService,
        private formBuilder: FormBuilder
    ) {

        this.rForm = formBuilder.group({
            'email': [null, Validators.required],
            'password': [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])]
        });
    }

    public ngOnInit() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }

    public login(credentials: LoginCredentials) {

        this.error = null;

        this.authService
            .login(credentials)
            .subscribe(
                //success
                () => this.router.navigateByUrl('/'),

                //error
                (error) => {
                    console.log(error);
                    this.error = error.error;
                });
    };

    private displayErrorMessage() {
        this.errorMessage.nativeElement.style.display = 'flex';
    }

}
