import { Component } from '@angular/core';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  messages$ = this.toast.messages$;
  constructor(private toast: ToastService) {}

  dismiss(id: string) {
    this.toast.dismiss(id);
  }
}
