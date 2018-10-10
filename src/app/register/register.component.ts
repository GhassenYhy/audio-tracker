import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { AuthenticationService } from '../shared/services/authentication';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { PasswordValidation } from './password-validations';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';

@Component({
    selector: 'app-register',
    styleUrls: ['./register.component.css'],
    templateUrl: "./register.component.html"
})

export class RegisterComponent implements OnInit {

    public rForm: FormGroup;
    @Input() public email: string = '';
    @Input() public password: string = '';
    @ViewChild('errorMessage') public errorMessage: ElementRef;
    @ViewChild('successMessage') public successMessage: ElementRef;
    @ViewChild('usedEmail') public usedEmail: ElementRef;
    private sub: any;
    public passwordStrengthMessage;
    public submitted: boolean;
    public success: boolean;



    constructor(
        public route: ActivatedRoute,
        public router: Router,
        private authService: AuthService,
        private formBuilder: FormBuilder
    ) { }

    public ngOnInit() {
        this.success = false;
        this.submitted = false;
        this.sub = this.route.params.subscribe(params => {

            this.rForm = this.formBuilder.group({
                'firstName': [null, Validators.compose([Validators.required,this.validateFirstNameLastName,Validators.minLength(2), Validators.maxLength(50)])],
                'lastName': [null, Validators.compose([Validators.required,this.validateFirstNameLastName, Validators.minLength(2), Validators.maxLength(50)])],
                'email': [null, Validators.compose([Validators.required,this.validateEmail])],
                'password': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(50),this.validatePassword])],
                'verifPassword': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(50)])],
            }, {validator: PasswordValidation.MatchPassword});

        });

    }



    public registerAccount(credentials) {
        this.submitted = true;
        console.log(credentials);

        this.authService
            .register(credentials)
            .subscribe(
                //success
                () => {
                    this.success = true;
                    //
                    // this.router.navigateByUrl('/login');
                    this.displaySuccessMessage();
                    this.disableForm();
                    return;
                },

                //error
                (err) => {
                    if (err['error'] = 'User already registered'){
                        this.displayUsedErrorMessage();
                    }
                    this.displayErrorMessage();
                });
    };

    lengthPassword(controls){
        let length = '';
        if (controls.length<10 || controls.length>50){
            length = '20%';
            this.passwordStrengthMessage = 'weak'
        }
        if (controls.length>=10 && controls.length<=20){
            length = '50%';
            this.passwordStrengthMessage = 'medium';
        }
        if (controls.length>=20 && controls.length<=50){
            length = '100%';
            this.passwordStrengthMessage = 'strong'
        }
        return length;
    }

    disableForm(){
        this.rForm.controls["firstName"].disable();
        this.rForm.controls["lastName"].disable();
        this.rForm.controls["email"].disable();
        this.rForm.controls["password"].disable();
        this.rForm.controls["verifPassword"].disable();
    }


    colorPassword(controls){
        let color = '';
        if (controls.length<10 || controls.length>50){
            color = '#a94442';
        }
        if (controls.length>=10 && controls.length<=20){
            color = '#e6a611';
        }
        if (controls.length>=20 && controls.length<=50){
            color = '#42A948';
        }
        return color;

        // if(controls.length<11){
        //     console.log(controls.length);
        //     return 'red'
        //
        // }
        // if (controls.length>10 && controls.password<20){
        //     console.log(controls.length);
        //     return 'orange'
        // }
        // if (controls.length>19 && controls.length<50){
        //     console.log(controls.length);
        //     return 'green'
        // }
        // if (controls.length>50){
        //     console.log(controls.length);
        //     return 'red'
        // }
    }

    validateEmail(controls) {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:?!$*&'\s@"]+(\.[^<>()\[\]\\.,;:?!$*&'\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (regExp.test(controls.value)) {
            return null;
        } else {
            return {'validateEmail': true}
        }
    }

    validateFirstNameLastName(controls) {
        const regExp = new RegExp(/^(?!\s*$)[a-zA-Z' ']+$/);
        if (regExp.test(controls.value)) {
            return null;
        }
        else {
            return {'validateFirstNameLastName': true}
        }
    }

    validatePassword(controls) {
        const regExp = new RegExp(/^(?!\s*$).+/);
        if (regExp.test(controls.value)) {
            return null;
        }
        else {
            return {'validatePassword': true}
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private displayErrorMessage() {
        this.errorMessage.nativeElement.style.display = 'flex';
    }
    private displaySuccessMessage() {
        this.successMessage.nativeElement.style.display = 'flex';
    }

    private displayUsedErrorMessage(){
        this.usedEmail.nativeElement.style.display = 'flex';
    }

}
