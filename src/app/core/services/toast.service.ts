import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(private toastrService: ToastrService) {}

    createSuccessToast(title: string = '', text: string = '') {
        this.toastrService.success(text, title);
    }

    createInfoToast(title: string = '', text: string = '') {
        this.toastrService.info(text, title);
    }

    createWarningToast(title: string = '', text: string = '') {
        this.toastrService.warning(text, title);
    }

    createErrorToast(title: string = '', text: string = '') {
        this.toastrService.error(text, title);
    }
}
