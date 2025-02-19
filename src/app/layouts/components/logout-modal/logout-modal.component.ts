import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ElementSize, ElementType } from '../../../shared/enums/element-types.enums';
import { AuthService } from '../../../core/services/auth.service';
import { WWButtonComponent } from '../../../shared/components/button/button.component';
import { WWPreloaderComponent } from '../../../shared/components/preloader/preloader.component';
import { ToastService } from '../../../core/services/toast.service';
import { finalize } from 'rxjs';

@Component({
    standalone: true,
    selector: 'logout-modal',
    templateUrl: './logout-modal.component.html',
    imports: [
        WWButtonComponent,
        WWPreloaderComponent,
    ],
    styleUrl: './logout-modal.component.scss'
})
export class LogoutModalComponent {
    isLoading: boolean = false;

    protected readonly ElementType = ElementType;
    protected readonly ElementSize = ElementSize;

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private router: Router,
        public bsModalRef: BsModalRef
    ) {}

    logout(): void {
        this.isLoading = true;
        this.authService.logout().pipe(
            finalize(() => {
                this.isLoading = false;
            })
        ).subscribe({
            next: () => {
                this.bsModalRef.hide();
                this.router.navigate(['/auth']);
            },
            error: () => {
                this.toastService.createErrorToast('Server error', 'Please, try again later');
            }
        });
    }
}
