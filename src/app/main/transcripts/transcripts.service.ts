// import { TokenStorage } from './token-storage.service';
import { TokenStorage } from '../authentication/token-storage.service';
import { URLSearchParams, RequestOptions } from '@angular/http';
// import { AuthenticationService } from '../authentication/authentication.service';
import { Injectable } from '@angular/core';
import {
    HttpClient, HttpErrorResponse, HttpParams, HttpRequest,
    HttpEvent,
    HttpEventType
} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// import { AuthService } from 'ngx-auth';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { HttpResponse } from '@angular/common/http';

// import 'rxjs/add/observable/throw';


@Injectable()
export class TranscriptsService {

    private authorizationHeader;
    private host = HTTP_PROTOCOL + '://' + API_URL;
    private error;

    private customerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWFkMGQyODIyZmFkZTBlMGUzZDIzZDNmIn0sImlhdCI6MTUyNDQ5MzA2MiwiZXhwIjoxNTI0NTc5NDYyfQ.BaxLNH0v5YqFBKNATbRdErTbIcnE_0Wiu96cX71YtEY"
    private editorToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWFkOWM3ODljMTVkOWE1YzgyZTBiZWFmIiwiYWNjZXNzIjoiZWRpdG9yIn0sImlhdCI6MTUyNDQ5NDg2MywiZXhwIjoxNTI0NTgxMjYzfQ.cIOuqBhPMhwfOuIOo5r7WAt9m-_xkGy2KNvvgUJQOBk"

    constructor(private http: HttpClient) {

    }

    public getFiles() {

        return this.http
            .get(`${this.host}/api/files`)
            .map((res: HttpResponse<{}>) => {
                return res;
            })
            .catch(error => {
                return Observable.throw(error);
            })

    }

    public getShareLink(id){
        return this.http
            .get(`${this.host}/api/files/${id}/share`).map((res)=>{
                return res})
            .catch((err) => {return Observable.throw('Error getting share link')})
    }

    public getTranscript(id) {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });


        return this.http
            .get(`${this.host}/api/files/${id}`, {
                headers
            })
            .map((res: HttpResponse<{}>) => {

                return res;

            })
            .catch(error => {
                return Observable.throw("Error processing your request!")
            })

    };

    public startTranscript(id) {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });


        // const req = new HttpRequest(
        //     'POST',
        //     );

        return this.http
            .post(`${this.host}/api/admin/transcript/start/${id}`, {}, {
                headers
            })
            .map((res: HttpResponse<{}>) => {
                return res;
            })
            .catch(error => {
                return Observable.throw(error)
            })

    };

    getPDF = (id, speakersCheck, timestampsCheck) => {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        let params = new HttpParams().set('speakers',speakersCheck).set('timestamps',timestampsCheck);

        const req = new HttpRequest(
            'GET',
            `${this.host}/api/files/${id}/format/pdf`, {
                params:params,
                responseType: "blob"
            });

        return this.http
            .request(req)
            .map((res: HttpResponse<{}>) => {

                if (res.type != 0) {
                    if (res.status >= 200 && res.status < 300) {
                        return res.body;
                    } else {
                        return {error: true};
                    }
                } else {
                    return false;
                }


            })
            .catch(error => {

                return Observable.throw("Error processing your request!")
            });
    }

    getDOC = (id, speakersCheck, timestampsCheck) => {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        let params = new HttpParams().set('speakers',speakersCheck).set('timestamps',timestampsCheck);

        const req = new HttpRequest(
            'GET',
            `${this.host}/api/files/${id}/format/doc`, {
                params:params,
                responseType: "blob"
            });

        return this.http
            .request(req)
            .map((res: HttpResponse<{}>) => {

                if (res.type != 0) {
                    if (res.status >= 200 && res.status < 300) {
                        return res.body;
                    } else {
                        return {error: true};
                    }
                } else {
                    return false;
                }


            })
            .catch(error => {

                return Observable.throw("Error processing your request!")
            });
    }

    getSBV = (id) => {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        // let params = new HttpParams().set('speakers',speakersCheck).set('timestamps',timestampsCheck);

        const req = new HttpRequest(
            'GET',
            `${this.host}/api/files/${id}/format/sbv`, {
                responseType: "blob"
            });

        return this.http
            .request(req)
            .map((res: HttpResponse<{}>) => {

                if (res.type != 0) {
                    if (res.status >= 200 && res.status < 300) {
                        return res.body;
                    } else {
                        return {error: true};
                    }
                } else {
                    return false;
                }


            })
            .catch(error => {

                return Observable.throw("Error processing your request!")
            });
    }


    public startEditing(id) {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });


        // const req = new HttpRequest(
        //     'POST',
        //     );

        return this.http
            .post(`${this.host}/api/admin/transcript/start/${id}`, {}, {
                headers
            })
            .map((res: HttpResponse<{}>) => {

                if (res.status >= 200 && res.status < 399) {
                    return res.body;
                } else {
                    return {error: true};
                }

            })
            .catch(error => {

                return Observable.throw("Error processing your request!")
            })

    };

    submitResults(id, results) {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http
            .post(`${this.host}/api/files/${id}`, {
                updatedResults: results
            }, {
                headers
            })
            .map((res: HttpResponse<{}>) => {
                return res.body;
            })
            .catch(error => {
                console.log(error);
                return Observable.throw(error)
            })
    }

    approveResults(id, results) {

        return this.http
            .post(`${this.host}/api/admin/transcript/approve/${id}`, {
                updatedResults: results
            })
            .map((res: HttpResponse<{}>) => {
                return res.body;
            })
            .catch(error => {
                return Observable.throw(error)
            })
    }

    public removeTranscript(transcriptId) {
        return this.http
            .delete(`${this.host}/api/files/${transcriptId}`)
            .map(response => {
                return response;
            }).catch(err => {
                return Observable.throw(err);
            });
    }


};
