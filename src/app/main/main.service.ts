// import { BehaviorSubject, Observable } from 'rxjs/Rx';
// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs/Subject';
// import { AccountService } from '../shared/services/account';

// @Injectable()
// export class ComponentCommuncationService {

//     private account: BehaviorSubject<any> = new BehaviorSubject<any>('');

//     // Observable string streams
//     public account$ = this.account.asObservable();

//     constructor() {
//         //init to see number of instances running
//     }

//     public getData(): Observable<any> {
//         return this.account;
//     };

//     public updateData(data: any) {
//         this.account.next(data);
//     }

// };