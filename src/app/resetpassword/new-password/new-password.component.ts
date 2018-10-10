import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
// import { AuthenticationService } from '../../shared/services/authentication/authentication.service';
import { FormBuilder, Validators } from '@angular/forms';
// import { PasswordValidation } from '../../register/password-validations';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
    selector: 'app-new-password',
    templateUrl: './new-password.component.html',
    styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {

    public rForm: FormGroup;
    public token: string = '';
    @Input() public password: string = '';
    @Input() public repassword: string = '';
    @ViewChild('errorMessage') public errorMessage: ElementRef;
    @ViewChild('successMessage') public successMessage: ElementRef;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private formBuilder: FormBuilder
    ) {

        this.activatedRoute.params.subscribe(params => {

            this.rForm = formBuilder.group({
                'password': [null, Validators.compose([Validators.required, Validators.minLength(8)])],
                'confirmPassword': [null, Validators.compose([Validators.required, Validators.minLength(8)])],
                'token': [null, Validators.compose([Validators.required])]
            }, {
                    validator: this.MatchPassword
                });

            this.rForm.controls['token'].setValue(params['token']);
        });

    }

    ngOnInit() { }

    public setNewPassword(formValues) {

        this.errorMessage.nativeElement.style.display = 'none';
        this.successMessage.nativeElement.style.display = 'none';

        this.authService
            .setNewPassword(formValues)
            .subscribe(
                // success
                () => {
                    // display success message
                    this.successMessage.nativeElement.style.display = 'flex';
                },

                // error
                (error) => {
                    this.displayErrorMessage();
                });
    }

    private displayErrorMessage() {
        this.errorMessage.nativeElement.style.display = 'flex';
    }

    private MatchPassword(AC: AbstractControl) {
        let password = AC.get('password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if (password != confirmPassword) {
            AC.get('confirmPassword').setErrors({ MatchPassword: true })
        } else {
            return null
        }
    }
}
