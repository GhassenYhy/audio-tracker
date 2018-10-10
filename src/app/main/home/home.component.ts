import { DomSanitizer } from '@angular/platform-browser';
import { AccountService } from '../../shared/services/account';
import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    public host = HTTP_PROTOCOL + '://' + API_URL;
    public step1Input: string = `
{
    language: "NL"
}`.trim();


    public step1Output: string = `
{
    sessionId: "SESSIONID"
}`.trim();

    public step1curl: string = `
$ curl -X POST \\
-H "Content-Type: application/json" \\
-H "X-Zoom-S2T-Key: yourprivatekeyhere" \\
-d '{"language" : "NL"}' \\
${this.host}/speech-to-text/session
    `;

    public step2Input: string = `
upload: filepath
`.trim();

    public step2Output: string = `
{
    sessionId: "SESSIONID",
    done: false
}`.trim();


    public step2curl: string = `
$ curl -v \\
-H "X-Zoom-S2T-Key: yourprivatekeyhere" \\
-F upload=@localfilenamepath \\
${this.host}/speech-to-text/session/SESSIONID`;

    //     public step3Input: string = `
    // {
    //     token: xxxxxxxxxxxxxxxxxxxxxxxxxx
    // }`.trim();

    public step3Output: string = `
{
    sessionId: "SESSIONID",
    done: false
}`.trim();

    public step3OutputDone: string = `
{
    sessionId: "SESSIONID",
    done: true,
    results: [...]
}`.trim();

    public step3Output2: string = `
    {
        sessionId: "SESSIONID",
        done: false
    }`.trim();

    public step3curl: string = `
$ curl -X GET \\
-H "Content-Type: application/json" \\
-H "X-Zoom-S2T-Key: yourprivatekeyhere" \\
${this.host}/speech-to-text/session/SESSIONID
                `;


    constructor(
        private sanitizer: DomSanitizer
    ) {

        // let highlighted = rainbow.colorSync('var foo = true;', 'javascript');
    }

    ngOnInit() {
        // this.accountSerivce.getUsage().subscribe(
        //     (data) => {
        //         this.usageData = data;
        //     },
        //     (err) => {
        //         console.log(err);
        //     }
        // )
    }

}

@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(value) {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }

}
