import { Observable, Subscription } from 'rxjs/Rx';
import { AccountService } from '../../shared/services/account';
import {
    Component,
    OnInit,
    Input,
    ElementRef,
    ViewChild,
    EventEmitter,
    ViewEncapsulation
} from '@angular/core';
import { Http, RequestOptionsArgs, Headers, RequestOptions } from '@angular/http';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
    UploadOutput,
    UploadInput,
    UploaderOptions,
    UploadFile,
    humanizeBytes
} from 'ngx-uploader';
import { timer } from 'rxjs/observable/timer';
import { take, map } from 'rxjs/operators';


import {
    HttpClient,
    HttpRequest,
    HttpEvent,
    HttpEventType
} from '@angular/common/http';


import { ProgressHttp } from 'angular-progress-http';
import { Route, Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { TranscriptsService } from './transcripts.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../shared/services/order/order.service';
import { ComponentCommuncationService } from '../../shared/services/component-communication.service';

@Component({
    selector: 'app-usage',
    templateUrl: './transcripts.component.html',
    styleUrls: ['./transcripts.component.css']
})
export class TranscriptsComponent implements OnInit {

    private loading: boolean = false;
    account: any;
    subscription: any;
    private showErrorMessage = false;
    private showSuccessMessage = false;
    closeResult: string;

    public transcriptsSubscription: Subscription;
    public transcripts: Array<any> = null;
    public billingForm: FormGroup;


    orderPaymentArray: any[] = [];


    orders: any = [];

    currentJustify = 'fill';
    stepOne;
    stepTwo;
    stepThree;

    options: UploaderOptions;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    uploadDone = false;

    orderTotal: number = 0;
    orderPerfectTotal: number = 0;
    p: number = 1;
    @Input() public subscribeEventDone: boolean = false;

    countDown;
    count = 10;
    @ViewChild('browseContent') browseContent: ElementRef;

    constructor(private accountService: AccountService,
        private transcriptsService: TranscriptsService,
        private http: Http,
        private router: Router,
        private fb: FormBuilder,
        private http2: ProgressHttp,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private orderService: OrderService,
        private componentCommuncationService: ComponentCommuncationService, ) {


        this.files = []; // local uploading files array
        this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
        this.humanizeBytes = humanizeBytes;

    }


    public ngOnInit() {

        this.stepOne = false;
        this.stepTwo = true;
        this.stepThree = true;
        this.orderService.getOrders().subscribe(
            (data) => this.orders = data,
            (error) => console.log(error)
        )

        this.subscription = this.componentCommuncationService.account$
            .subscribe((data) => {
                this.account = data;

            });

        // this.transcripts$ = Observable.interval(1000).switchMap((data) => this.transcriptsService.getTranscriptsAdmin());
        this.transcriptsSubscription = this.transcriptsService.getFiles()
            .subscribe(
                (data) => {
                    this.subscribeEventDone = true;
                    this.transcripts = data;
                },
                (error) => {
                    this.subscribeEventDone = true;
                    console.log(error);
                }
            );

        this.billingForm = this.formBuilder.group({
            'firstName': [null, Validators.required],
            'lastName': [null, Validators.required],
            'city': [null, Validators.required],
            'country': [null, Validators.required],
            'street': [null, Validators.required],
            'email': [null, Validators.required],
        });


    }

    public host = HTTP_PROTOCOL + '://' + API_URL;

    removeTranscript = (transcriptId) => {

        this.transcriptsService.removeTranscript(transcriptId).subscribe(
            (data) => {
                this.deleteSuccessToastr();
                this.transcriptsService.getFiles().subscribe((data) => this.transcripts = data);
                return data;
            },
            (err) => {
                console.log(err);
                this.deleteFailToastr();
            }
        );

    }


    public ngOnDestroy() {
        this.transcriptsSubscription.unsubscribe();
    }


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

    removeFile(item, fileId: string): void {
        this.uploadDone = false;
        this.browseContent.nativeElement.value = null;
        console.log(this.browseContent);
        this.uploadInput.emit({ type: 'remove', id: fileId });
        this.orderTotal -= item.hasOwnProperty('metadata') ? item['metadata'].amount : 0;
        this.uploadDone = true;

    }

    calculateOrderTotal = () => {
        this.orderTotal = 0;
        for (let item of this.files) {
            this.orderTotal += item.hasOwnProperty('metadata') ? item['metadata'].amount : 0
        }
    }

    // removeFileFromList = (item, fileId) => {
    //
    //     this.orderService.removeFile(fileId).subscribe(
    //         (data) => {
    //             this.removeFile(item, fileId);
    //             return data;
    //         },
    //         (err) => console.log(err)
    //     );
    //
    // }
    removeFileFromList = (item, fileId) => {
        let index = this.orderPaymentArray.map(item => item.unique).indexOf(item['metadata'].unique);
        if (item['metadata'].isPerfect) {
            console.log("perfecto");
            this.orderTotal = this.orderTotal - (item['metadata'].amount_perfect - item['metadata'].amount) - item['metadata'].amount;
            this.orderPerfectTotal = this.orderPerfectTotal - (item['metadata'].amount_perfect - item['metadata'].amount);
        } else {
            console.log("non perfecto")
            this.orderTotal -= item['metadata'].amount;
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

    // getPaymentLink = () => {
    //
    //     this.orderService.getPaymentLink().subscribe(
    //         (data) => {
    //             window.location.href = data["payment_url"];
    //         },
    //         (err) => console.log(err)
    //     );
    //
    // }

    getPaymentLink = () => {

        this.orderService.getPaymentLink(this.orderPaymentArray).subscribe(
            (data) => {
                console.log(data);
                window.location.href = data["payment_url"];
            },
            (err) => console.log(err)
        );

    }


    goToStepTwo(t) {
        this.stepOne = true;
        this.stepTwo = false;
        this.stepThree = true;
    }

    goToStepThree() {
        this.stepOne = true;
        this.stepTwo = true;
        this.stepThree = false;
    }


    stepTwoValid(t, event) {
        this.goToStepTwo(t);
        setTimeout(() => {
            t.select('tab-selectbyid2');
        }, 10);

    }

    stepThreeValid(t, event) {
        this.goToStepThree();
        setTimeout(() => {
            t.select('tab-selectbyid3');
        }, 10);
        this.countDownStart();
        setTimeout(() => {
            // this.getPaymentLink();
        }, 10000);

    }

    countDownStart() {
        this.countDown = timer(0, 1000).pipe(
            take(this.count),
            map(() => --this.count)
        );
    }

    removeOrder = (id) => {

        this.orderService.removeOrder(id).subscribe(
            (data) => {
                this.orderService.getOrders().subscribe((data) => this.orders = data);
                return data;
            },
            (err) => console.log(err)
        );

    }

    getPage(page: number) {

        this.transcriptsSubscription = this.transcriptsService.getFiles()
            .subscribe(
                (data) => {
                    this.subscribeEventDone = true;
                    this.transcripts = data;
                    this.p = page;
                },
                (error) => {
                    this.subscribeEventDone = true;
                    console.log(error)
                },

                () => {
                    this.loading = false;
                });

    }


    deleteSuccessToastr() {
        this.toastr.success('File successfully deleted !', 'Deleted');
    }

    deleteFailToastr() {
        this.toastr.error('An error occurred while deleting your file !', 'Error');
    }

    SecondsTohhmmss(totalSeconds) {
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        // round seconds
        seconds = Math.round(seconds * 100) / 100

        var result = (hours < 10 ? "0" + hours : hours);
        result += "-" + (minutes < 10 ? "0" + minutes : minutes);
        result += "-" + (seconds < 10 ? "0" + seconds : seconds);
        return result;
    }

    calculateOrderWithOptions(file, type) {
        // console.log(file);
        // let index = this.orderPaymentArray.map(item=> item.unique).indexOf(file['metadata'].unique);

        console.log(file);
        let index = this.orderPaymentArray.map(item => item.unique).indexOf(file['metadata'].unique);
        if (type == "perfect") {
            console.log("perfect");
            this.orderPaymentArray[index].type = "perfect";
            this.orderPerfectTotal += file['metadata'].amount_perfect - file['metadata'].amount;
            this.orderTotal = this.orderTotal - file['metadata'].amount + file['metadata'].amount_perfect;
        } else if (type == "raw") {
            console.log("raw");
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

    public submitBillingAndProceedToPayment = (formValues) => {

        this.accountService.updateBillingDetails(formValues).subscribe(
            (data) => {


                if (data.hasOwnProperty("success")) {

                    this.accountService.getDetails().subscribe(
                        (data) => {
                            this.componentCommuncationService.updateData(data)
                            //get the payment link and redirect;

                            this.getPaymentLink();


                        }
                    )
                } else {
                    throw new Error(data.hasOwnProperty("error") ? data['error'] : "An error ocurred when saving your billing details")
                }


            },
            (err) => {
                console.log(err);
                this.toastr.error("err");
            }
        )


    };


}
