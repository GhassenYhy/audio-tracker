/// <reference path="../../azuremediaplayer.d.ts" />

import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
import { TranscriptsService } from '../main/transcripts/transcripts.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpEvent } from '@angular/common/http';
// import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs/Observable';
import { saveAs } from 'file-saver/FileSaver';
import { ContentEditableDirective } from '../shared/directives/contenteditable.directive';
import { FormatPlayerTimePipe } from '../shared/pipes/format-player-time.pipe';
import { FormatNamePipePipe } from '../shared/pipes/format-name-pipe.pipe';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../shared/services/order/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

var FileSaver = require('file-saver');


/**
 * CTRL + CLICK => jumps to that word
 */
export enum KEY_CODE {
    RIGHT_ARROW = 39,
    LEFT_ARROW = 37,
    TAB_KEY = 9,
    CTRL_KEY = 17,
    BACKSPACE = 8,
    ENTER = 13
}

@Component({
    selector: 'app-transcript',
    templateUrl: './transcript-read.component.html',
    styleUrls: ['./transcript-read.component.css'],
})
export class TranscriptReadComponent implements OnInit, OnDestroy {


    public URL = HTTP_PROTOCOL + "://" + API_URL;

    public showError: boolean = false;
    public data$: Observable<any>;

    id: number;
    private sub: any;
    private data: any;

    public player: any;

    public results: any;
    public fileData: any;
    playerCurrentTime: any;

    ctrlIsPressed = false;
    tabIsPressed = false;
    playerResumed = false;
    playerTimeCheckInterval = null;

    shareLink: any;

    speakersCheck: boolean;
    timestampsCheck: boolean;

    constructor(private transcriptsService: TranscriptsService,
        private orderService: OrderService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private modalService: NgbModal) {
    }

    ngOnInit() {

        this.speakersCheck = false;
        this.timestampsCheck = false;


        this.sub = this.route.params.subscribe(params => {
            let id = params['id']; // (+) converts string 'id' to a number
            this.id = id;

            this.data$ = this.transcriptsService.getTranscript(id);

            this.data$.subscribe(
                (data) => {


                    this.fileData = data;
                    console.log(data);
                    this.results = this.fileData.transcript.results;
                    console.log(this.results);

                    let url = this.fileData.files.metadata.urlPath;

                    this.player.src([{
                        src: url,
                        type: this.fileData.files.metadata.mimetype
                    }]);
                })


        });

        this.player = amp('audio-player', {
            /* Options */
            controls: true,
            autoplay: true,
            "logo": { "enabled": false },
        }, () => {
            //callback

            this.enablePlayerTimer();
            return;
        });


    }


    jumpToPlayer(seconds) {
        return this.player.currentTime(seconds / 1000 - 1);
    };


    getStartTime = (item) => {

        if (item.result instanceof Array)
            for (let i = 0; i < item.result.length; i++) {

                if (item.result[i][1]) {
                    console.log(this.formatDate(item.result[i][1]));
                    return this.formatDate(item.result[i][1]);
                }


            }
    }

    formatDate(totalSeconds) {
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {

        this.ctrlIsPressed = false;


        if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
            if (this.tabIsPressed) {
                const currentWordIndex = this.getCurrentWordIndex();
                if (currentWordIndex >= 0 && currentWordIndex < this.results[0].result.length - 1) {
                    console.log(currentWordIndex);
                    const word = this.results[0].result[currentWordIndex + 1]
                    this.player.currentTime((word.start + 1) / 1000);
                    this.playerCurrentTime = word.start + 1;
                    console.log('current1: ' + this.playerCurrentTime);
                }
                else if (currentWordIndex == -1) {
                    const word = this.results[0].result[0]
                    this.player.currentTime((word.start + 1) / 1000);
                    this.playerCurrentTime = word.start + 1;
                    console.log('current1: ' + this.playerCurrentTime);
                }
            }

        }

        if (event.keyCode === KEY_CODE.LEFT_ARROW) {
            if (this.tabIsPressed) {
                const currentWordIndex = this.getCurrentWordIndex();
                if (currentWordIndex > 0) {
                    console.log(currentWordIndex);
                    const word = this.results[0].result[currentWordIndex - 1]
                    this.player.currentTime((word.start + 1) / 1000);
                    this.playerCurrentTime = word.start + 1;
                    console.log('current1: ' + this.playerCurrentTime);
                }

                else if (currentWordIndex == -2) {
                    const word = this.results[0].result[this.results[0].result.length - 1]
                    this.player.currentTime((word.start + 1) / 1000);
                    this.playerCurrentTime = word.start + 1;
                    console.log('current1: ' + this.playerCurrentTime);
                }
            }
            // this.decrement();

        }

        if (event.keyCode === KEY_CODE.TAB_KEY) {
            if (!this.playerResumed) {
                console.log("tab pressed");
                this.player.pause();
            }
            this.tabIsPressed = false;
            this.playerResumed = false;
        }
        if (event.keyCode === KEY_CODE.ENTER) {
            if (this.tabIsPressed) {
                this.player.play();
                this.playerResumed = true;
            }
        }
        if (event.keyCode === KEY_CODE.BACKSPACE) {
            event.preventDefault();
        }


    }

    @HostListener('window:keydown', ['$event'])
    keyPressEvent(event: KeyboardEvent) {

        this.ctrlIsPressed = false;

        if (event.ctrlKey || event.metaKey) {
            console.log("ctrll pressed");
            this.ctrlIsPressed = true;
        }
        if (event.keyCode === KEY_CODE.ENTER) {
            event.preventDefault();
        }
        if (event.keyCode == KEY_CODE.TAB_KEY) {
            event.preventDefault();
            this.tabIsPressed = true;
        }


    }

    increment() {
        console.log("incremenent");
        // this.value++;
    }

    decrement() {
        console.log("decreement");
        // this.value--;
    }

    saveEdited(id) {

        if (!id) console.log("No id provided");

        for (let i = 0; i < this.results.length; i++) {

            this.results[i].text = this.results[i].result.map(item => item.word).join(" ").trim();

        }


        this.transcriptsService.submitResults(id, this.results)
            .subscribe(
                data => {
                    this.toastr.success("Transcript has been saved");
                },

                error => {

                    // console.log(error);
                    this.toastr.error(error.error);

                }
            )
    }


    enablePlayerTimer = () => {
        this.playerTimeCheckInterval = setInterval(() => {

            if ((this.player) && !this.player.paused()) {
                this.playerCurrentTime = this.player.currentTime() * 1000;
            }
            ;

        }, 300)

    };

    trackByIndex(index, item) {
        return index; // or item.id
    }

    onWordClick(word?) {

        if (this.ctrlIsPressed) {
            this.player.play();
            return this.player.currentTime((word.start - 200) / 1000);
        }

        if ((this.player) && !this.player.paused()) {
            this.player.pause();
        }
        ;


    }

    getCurrentWordIndex() {
        const words = this.results[0].result;
        if (this.playerCurrentTime <= words[0].start) {
            return -1;
        }
        if (this.playerCurrentTime >= words[words.length - 1].end) {
            return -2;
        }
        for (let i = 0; i < words.length; i++) {
            let word = words[i];

            console.log('player current time : ' + this.playerCurrentTime);
            if (this.playerCurrentTime >= word.start) {
                if (this.playerCurrentTime <= word.end)
                    return i;
                else {
                    if (i < words.length) {
                        let nextWord = words[i + 1];
                        if (this.playerCurrentTime < nextWord.start)
                            return i;
                    }

                }
            }
        }
        return null;
    }

    downloadPDF() {

        this.transcriptsService.getPDF(this.id, this.speakersCheck, this.timestampsCheck).subscribe(
            (data) => {

                if (data) {
                    let ieEDGE = navigator.userAgent.match(/Edge/g);
                    let ie = navigator.userAgent.match(/.NET/g); // IE 11+
                    let oldIE = navigator.userAgent.match(/MSIE/g);

                    let blob = new Blob([data], { type: "application/pdf" });
                    let fileName: string = this.id + ".pdf";

                    FileSaver.saveAs(blob, fileName);

                    // if (ie || oldIE || ieEDGE) {
                    //     window.navigator.msSaveBlob(blob, fileName);
                    // }
                    // else {
                    //     let link = document.createElement('a');
                    //     link.href = window.URL.createObjectURL(blob);
                    //     link.download = fileName;
                    //     link.click();

                    //     setTimeout(function () {
                    //         window.URL.revokeObjectURL(link.href);
                    //     }, 0);
                    // }
                }
            },
            (error) => {

            },
            () => {

                console.log("once");
            }
        )
    }


    ngOnDestroy() {
        this.player.dispose();
        clearInterval(this.playerTimeCheckInterval);
        this.sub.unsubscribe();
    }

    copyToClipboard(element) {
        element.select();
        document.execCommand('copy');
        this.copiedSuccessClipboardToastr();
    }

    openVerticallyCentered(id, content) {
        this.transcriptsService.getShareLink(id).subscribe(
            (data) => {
                this.shareLink = data.link;
                this.modalService.open(content);
            }, (err) => {
                console.log(err);
            }
        );

    }

    modalDownloadPDF(id, content) {
        this.transcriptsService.getShareLink(id).subscribe(
            (data) => {
                this.modalService.open(content);
            }, (err) => {
                console.log(err);
            }
        );

    }

    copiedSuccessClipboardToastr() {
        this.toastr.success('The link has been copied to your clipboard !', 'Copied');
    }


}
