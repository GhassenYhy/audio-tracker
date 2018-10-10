import { Component, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    UploadOutput,
    UploadInput,
    UploaderOptions,
    UploadFile,
    humanizeBytes
} from 'ngx-uploader';
import { OrderService } from '../../services/order/order.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentCommuncationService } from '../../services/component-communication.service';
import { AccountService } from '../../services/account';
import { ToastrService } from 'ngx-toastr';
import { el } from '@angular/platform-browser/testing/src/browser_util';


@Component({
    selector: 'bc-order-modal',
    templateUrl: './order-modal.component.html',
    styleUrls: ['./order-modal.component.css']
})
export class OrderModalComponent implements OnInit {

    options: UploaderOptions;
    formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    uploadDone = false;
    perfectTranscriptionSelection = false;

    subscription;
    account;
    billingDetailsDisplayed = false;
    public billingForm: FormGroup;

    orderPaymentArray: any[] = [];
    orderTotal: number = 0;
    orderPerfectTotal: number = 0;

    amountPerfect: number = 0;
    amountAutomatic: number = 0;

    @ViewChild('browseContent') browseContent: ElementRef;

    constructor(private orderService: OrderService,
        public activeModal: NgbActiveModal,
        public componentCommunicationService: ComponentCommuncationService,
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private toastr: ToastrService, ) {

        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;

    }

    ngOnInit() {

        this.orderService.newOrder().subscribe(
            () => {
            },
            (err) => console.log(err)
        );

        this.subscription = this.componentCommunicationService.account$.subscribe((data) => {
            this.account = data;

        });


    }

    public host = HTTP_PROTOCOL + '://' + API_URL;

    onUploadOutput(output: UploadOutput): void {
        this.uploadDone = false;
        if (output.type === 'allAddedToQueue') { // when all files added in queue
            // uncomment this if you want to auto upload files when added
            const event: UploadInput = {
                type: 'uploadAll',
                url: this.host + '/api/order/upload',
                method: 'POST',
                withCredentials: true
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
            this.files.push(output.file);
        } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
            // update current data in files array for uploading file
            const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
            this.files[index] = output.file;
        } else if (output.type === 'removed') {
            // remove file from array when removed
            this.files = this.files.filter((file: UploadFile) => file !== output.file);
        } else if (output.type === 'dragOver') {
            this.dragOver = true;
        } else if (output.type === 'dragOut') {
            this.dragOver = false;
        } else if (output.type === 'drop') {
            this.dragOver = false;
        } else if (output.type === 'done') {
            if (output.file.responseStatus > 399) { // Or whatever your return code status is
                output.file['error'] = "Error Processing File";
                console.log(output.file.response); // This is where you can find your returned object
            } else {
                this.uploadDone = false;
                output.file['metadata'] = output.file.response.file;
                output.file['metadata'].isPerfect = false;
                console.log(output.file['metadata']);
                this.orderPaymentArray.push({ unique: output.file['metadata'].unique, type: "raw" })
                console.log(this.orderPaymentArray);
                // this.calculateOrderTotal(output.file['metadata'].unique,output.file['metadata'].type);
                this.orderTotal += output.file['metadata'].amount;
                this.amountAutomatic += output.file['metadata'].amount;

                // service fee
                if (this.orderPaymentArray.length == 1) {
                    this.orderTotal += 1;
                }
                // if (this.orderPaymentArray.length == 1){
                //     this.orderTotal += 1;
                // }
                this.uploadDone = true;
            }
        } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
            console.log(output.file.name + ' rejected');
        }
    }


    cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id: id });
    }

    removeFile(item, fileId: string): void {
        this.uploadDone = false;
        this.browseContent.nativeElement.value = null;
        console.log(this.browseContent);
        this.uploadInput.emit({ type: 'remove', id: fileId });
        console.log("deleted");
        this.orderTotal -= item.hasOwnProperty('metadata') ? item['metadata'].amount : 0;
        this.uploadDone = true;

    }

    removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
        for (let item of this.files) {
            this.orderTotal += item.hasOwnProperty('metadata') ? item['metadata'].amount : 0
        }
    }

    startUpload(): void {
        const event: UploadInput = {
            type: 'uploadFile',
            url: this.host + '/api/order/upload',
            method: 'POST',
        };

        this.uploadInput.emit(event);
    }

    includePerfect() {
        this.perfectTranscriptionSelection = !this.perfectTranscriptionSelection;
    }


    calculateOrderTotal = (id, type) => {

        this.orderTotal = 0;
        let orderPaymentArray = [];
        for (let item of this.files) {
            if (item.id == id) {
                let isChecked = (<HTMLInputElement>document.getElementById(item.id + "-raw")).checked;
                if (isChecked) {
                    this.orderTotal += item.hasOwnProperty('metadata') ? item['metadata'].amount : 0
                } else {
                    this.orderTotal += item.hasOwnProperty('metadata') ? item['metadata'].amount_perfect : 0
                }
                console.log(type);
                console.log(item['metadata'].unique);
                orderPaymentArray.push({ 'unique': id, 'type': type })
                console.log(orderPaymentArray);

            }
        }
    }

    calculateOrderWithOptions(file, type) {
        // console.log(file);
        // let index = this.orderPaymentArray.map(item=> item.unique).indexOf(file['metadata'].unique);

        console.log(file);
        let index = this.orderPaymentArray.map(item => item.unique).indexOf(file['metadata'].unique);
        if (type == "perfect") {
            this.amountPerfect += file['metadata'].amount_perfect;
            this.amountAutomatic -= file['metadata'].amount;
            this.orderPaymentArray[index].type = "perfect";
            this.orderPerfectTotal += file['metadata'].amount_perfect - file['metadata'].amount;
            this.orderTotal = this.orderTotal - file['metadata'].amount + file['metadata'].amount_perfect;
        } else if (type == "raw") {
            this.amountAutomatic += file['metadata'].amount;
            this.amountPerfect -= file['metadata'].amount_perfect;
            this.orderPaymentArray[index].type = "raw";
            this.orderPerfectTotal -= file['metadata'].amount_perfect - file['metadata'].amount;
            this.orderTotal = this.orderTotal - file['metadata'].amount_perfect + file['metadata'].amount
        }
        file['metadata'].isPerfect = !file['metadata'].isPerfect;

        //
        // if (type == "raw"){
        //         this.orderPaymentArray[index].type = "perfect";
        //         this.orderPerfectTotal = this.orderPerfectTotal + ( file ['metadata'].amount_perfect - file ['metadata'].amount );
        //         this.orderTotal = this.orderTotal + file['metadata'].amount;
        // }
        // if (type == "perfect"){
        //     this.orderPaymentArray[index].type = "raw";
        //     this.orderPerfectTotal = this.orderPerfectTotal - file ['metadata'].amount_perfect;
        //     this.orderTotal = this.orderTotal + ( file ['metadata'].amount_perfect - file ['metadata'].amount );
        // }

        // if (!file['metadata'].isPerfect){
        //     this.orderPaymentArray[index].type = "perfect";
        //     this.orderPerfectTotal -= file['metadata'].amount_perfect + file['metadata'].amount;
        //     this.orderTotal = this.orderTotal + file['metadata'].amount;
        // } else if (file['metadata'].isPerfect){
        //     this.orderPaymentArray[index].type = "raw";
        //     this.orderPerfectTotal += file['metadata'].amount_perfect - file['metadata'].amount;
        //     this.orderTotal = this.orderTotal - file['metadata'].amount_perfect + file['metadata'].amount
        // }
        // file['metadata'].isPerfect = !file['metadata'].isPerfect;

        // console.log(file);
        // let index = this.orderPaymentArray.map(item=> item.unique).indexOf(file['metadata'].unique);
        // this.orderPaymentArray[index].type = type;
        // if (type == "perfect"){
        //     this.orderPerfectTotal += file['metadata'].amount_perfect - file['metadata'].amount;
        //     this.orderTotal = this.orderTotal - file['metadata'].amount + file['metadata'].amount_perfect
        // } else if (type == "raw"){
        //     this.orderPerfectTotal -= file['metadata'].amount_perfect - file['metadata'].amount;
        //     this.orderTotal = this.orderTotal - file['metadata'].amount_perfect + file['metadata'].amount
        // }

    }

    getPaymentLink = () => {

        this.orderService.getPaymentLink(this.orderPaymentArray).subscribe(
            (data) => {
                console.log(data);
                window.location.href = data["payment_url"];
            },
            (err) => console.log(err)
        );

    }

    proceedToBillingForm = () => {
        this.billingDetailsDisplayed = true;

        this.billingForm = this.formBuilder.group({
            'firstName': [null, Validators.required],
            'lastName': [null, Validators.required],
            'city': [null, Validators.required],
            'country': [null, Validators.required],
            'street': [null, Validators.required],
            'email': [null, Validators.required],
        });

    }

    removeFileFromList = (item, fileId) => {
        if (item.progress.status!=2){

            this.uploadInput.emit({ type: 'remove', id: fileId });
            this.uploadInput.emit({ type: 'cancel', id: fileId });
            return this.uploadDone = true;

            // console.log(item);
            // let index = this.orderPaymentArray.map(item => item.id).indexOf(fileId);
            // this.orderPaymentArray.splice(index,1);
            // this.files.splice(index,1);
        }
        let index = this.orderPaymentArray.map(item => item.unique).indexOf(item['metadata'].unique);
        if (item['metadata'].isPerfect) {
            console.log("perfect");
            this.orderTotal = this.orderTotal - (item['metadata'].amount_perfect - item['metadata'].amount) - item['metadata'].amount;
            this.orderPerfectTotal = this.orderPerfectTotal - (item['metadata'].amount_perfect - item['metadata'].amount);
            this.amountPerfect -= item['metadata'].amount_perfect;
        } else {
            console.log("raw")
            this.orderTotal -= item['metadata'].amount;
            this.amountAutomatic -= item['metadata'].amount;
        }
        this.orderPaymentArray.splice(index, 1);
        console.log(this.orderPaymentArray);
        let index2 = this.files.map(item => item.id).indexOf(fileId);
        this.files.splice(index2, 1);
        if (this.orderPaymentArray.length == 0) {
            this.orderTotal = 0;
            this.orderPerfectTotal = 0;
        }
        // this.orderService.removeFile(fileId).subscribe(
        //     (data) => {
        //         this.removeFile(item, fileId);
        //         return data;
        //     },
        //     (err) => console.log(err)
        //
        // );

    };

    saveBillingAndRedirectToMollie = (formValues) => {

        this.accountService.updateBillingDetails(formValues).subscribe(
            (data) => {


                if (data.hasOwnProperty("success")) {

                    this.accountService.getDetails().subscribe(
                        (data) => {
                            this.componentCommunicationService.updateData(data)
                            //get the payment link and redirect;

                            this.getPaymentLink();


                        }
                    )
                }


            },
            (err) => {
                console.log(err);
                this.toastr.error("err");
            }
        )

    };

}
