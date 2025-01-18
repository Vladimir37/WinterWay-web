import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AnimationTwoStep } from '../../core/enums/animation-steps.enum';
import { NgOptimizedImage } from '@angular/common';
import { ElementSize, ElementType } from '../../shared/enums/element-types.enums';
import { WWButtonComponent } from '../../shared/components/button/button.component';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
import { AuthService } from '../../core/services/auth.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { LogoutModalComponent } from '../components/logout-modal/logout-modal.component';
import { UserModalComponent } from '../components/user-modal/user-modal.component';
import { NotificationsComponent } from '../components/notifications/notifications.component';

@Component({
    standalone: true,
    selector: 'main-layout',
    imports: [RouterOutlet, NgOptimizedImage, WWButtonComponent, CollapseDirective, RouterLink, RouterLinkActive, NotificationsComponent],
    animations: [
        trigger('windowBackgroundAnimation', [
            state(AnimationTwoStep.First, style({
                'pointer-events': 'none',
                'height': '0',
                'opacity': '0'
            })),
            state(AnimationTwoStep.Second, style({
                'pointer-events': 'auto',
                'height': '100%',
                'opacity': '1'
            })),
            transition(`${AnimationTwoStep.First} <=> ${AnimationTwoStep.Second}`, [
                animate('400ms ease-in-out')
            ])
        ]),
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
    bsModalRef?: BsModalRef;

    windowBackgroundState: AnimationTwoStep = AnimationTwoStep.Second;
    notificationBlockOpened: boolean = false;
    mobileNavbarIsCollapsed = true;

    protected readonly ElementType = ElementType;
    protected readonly ElementSize = ElementSize;

    constructor(
        private bsModalService: BsModalService,
        private authService: AuthService
    ) {}

    get username(): string {
        let formattedUsername = this.authService.userStatus!.username;
        if (formattedUsername.length > 18) {
            formattedUsername = formattedUsername.slice(0, 18) + '...';
        }
        return formattedUsername;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.windowBackgroundState = AnimationTwoStep.First;
        }, 200)
    }

    toggleMobileNavbar() {
        this.mobileNavbarIsCollapsed = !this.mobileNavbarIsCollapsed;
    }

    toggleNotificationBlock() {
        this.notificationBlockOpened = !this.notificationBlockOpened;
    }

    openLogoutModal() {
        const options: ModalOptions = {
            ignoreBackdropClick: true,
        };
        this.bsModalRef = this.bsModalService.show(LogoutModalComponent, options);
        this.bsModalRef.content.closeBtnName = 'close-btn';
    }

    openUserModal() {
        const options: ModalOptions = {
            ignoreBackdropClick: true
        };
        this.bsModalRef = this.bsModalService.show(UserModalComponent, options);
        this.bsModalRef.content.closeBtnName = 'close-btn';
    }
}
