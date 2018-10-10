import { Subscription } from 'rxjs/Rx';
import { ComponentCommuncationService } from '../shared/services/component-communication.service';
import { AccountService } from '../shared/services/account/account.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { AuthenticationService } from '../shared/services/authentication';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { OrderModalComponent } from '../shared/components/order-modal/order-modal.component';
/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Main` component loaded asynchronously');

@Component({
    selector: 'main-c',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

    public subscription: Subscription;
    public showSidebar = false;
    @Input() public account;

    constructor(
        // private authService: AuthenticationService,
        private accountService: AccountService,
        private router: Router,
        private route: ActivatedRoute,
        private componentCoummicationService: ComponentCommuncationService,
        private modalService: NgbModal
    ) {

        if (!this.account) {
            this.account = this.route.snapshot.data['account'];
            this.componentCoummicationService.updateData(this.account);
        }


        this.subscription = this.componentCoummicationService.account$.subscribe((data) => {
            this.account = data;
        });


    }

    public ngOnInit() {

    };

    public logout() {
        this.router.navigateByUrl('/login');
    };

    public openOrderModal() {
        const modalRef = this.modalService.open(OrderModalComponent);
        modalRef.componentInstance.name = 'World';
    }

    public toggleSidebar() {
        this.showSidebar = !this.showSidebar;
    }

    public handleClick() {
        if (this.showSidebar) {
            this.showSidebar = false;
        }
    }
}
