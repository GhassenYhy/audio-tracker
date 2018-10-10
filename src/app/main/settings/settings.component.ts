import { AccountService } from '../../shared/services/account';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';
import { ComponentCommuncationService } from '../../shared/services/component-communication.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnDestroy, OnInit {

    public subscription: Subscription;
    public rForm: FormGroup;
    public billingForm: FormGroup;
    @Input() public account: string;
    @Input() public tokens: string;
    @ViewChild('errorMessage') public errorMessage: ElementRef;

    constructor(
        private componentCommuncationService: ComponentCommuncationService,
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private toastr: ToastrService,
    ) {

        this.rForm = formBuilder.group({
            'firstName': [null, Validators.required],
            'lastName': [null, Validators.required],
        });


        this.billingForm = formBuilder.group({
            'firstName': [null, Validators.required],
            'lastName': [null, Validators.required],
            'city': [null, Validators.required],
            'country': [null, Validators.required],
            'street': [null, Validators.required],
            'email': [null, Validators.required],
        });


        this.subscription = this.componentCommuncationService.account$
            .subscribe((data) => {
                this.account = data;


                this.rForm.controls['firstName'].setValue(this.account['firstName']);
                this.rForm.controls['lastName'].setValue(this.account['lastName']);


                if (this.account.hasOwnProperty("billing")) {
                    this.billingForm.controls['firstName'].setValue(this.account['billing'].firstName);
                    this.billingForm.controls['lastName'].setValue(this.account['billing'].lastName);
                    this.billingForm.controls['country'].setValue(this.account['billing'].country);
                    this.billingForm.controls['city'].setValue(this.account['billing'].city);
                    this.billingForm.controls['email'].setValue(this.account['billing'].email);
                    this.billingForm.controls['street'].setValue(this.account['billing'].street);

                }

            });


    };

    public ngOnInit() {

    };


    public updateContactDetails(formValues) {
        this.accountService.updateContactDetails(formValues).subscribe(
            (data) => {
                this.componentCommuncationService.updateData(data)
            },
            (err) => {
                console.log(err);
            }
        )
    };

    public updateBillingDetails(formValues) {
        this.accountService.updateBillingDetails(formValues).subscribe(
            (data) => {
                this.accountService.getDetails().subscribe(
                    (data) => {
                        this.componentCommuncationService.updateData(data);

                        this.toastr.success("Settings updated succesfully")
                    }
                )

            },
            (err) => {
                console.log(err);
            }
        )
    };

    public ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    }

}
