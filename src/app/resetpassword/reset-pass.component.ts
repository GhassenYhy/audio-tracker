import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { AuthenticationService } from '../shared/services/authentication';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';

@Component({
    selector: 'reset-pass',
    templateUrl: "./reset-pass.component.html",
    styleUrls: ['./reset-pass.component.css']
})

export class ResetPassComponent implements OnInit {

    public rForm: FormGroup;
    @Input() public email: string = '';
    @Input() public password: string = '';
    @ViewChild('errorMessage') public errorMessage: ElementRef;
    @ViewChild('activationErrorMessage') public activationErrorMessage: ElementRef;
    @ViewChild('successMessage') public successMessage: ElementRef;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private authService: AuthService,
        private formBuilder: FormBuilder
    ) {
        this.rForm = formBuilder.group({
            'email': [null, Validators.required]
        });
    }

    public ngOnInit() { }

    public reset(formValues) {

        this.errorMessage.nativeElement.style.display = 'none';
        this.successMessage.nativeElement.style.display = 'none';
        this.activationErrorMessage.nativeElement.style.display = 'none';

        this.authService
            .resetPassword(formValues.email)
            .subscribe(
                // success
                () => {
                    // display success message
                    this.successMessage.nativeElement.style.display = 'flex';
                },

                // error
                (error) => {
                    if (error.error_message = "User unknown or account not yet activated"){
                        this.activationErrorMessage.nativeElement.style.display = 'flex';
                    }else
                    this.displayErrorMessage();
                });
    };

    private displayErrorMessage() {
        this.errorMessage.nativeElement.style.display = 'flex';
    }

}
