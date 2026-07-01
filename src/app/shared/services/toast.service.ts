import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'info' | 'success' | 'error' | 'warn';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  show(text: string, type: ToastMessage['type'] = 'info', ttl = 4000) {
    const msg: ToastMessage = { id: Date.now().toString(), text, type };
    const cur = this.messagesSubject.value.slice();
    cur.push(msg);
    this.messagesSubject.next(cur);
    setTimeout(() => this.dismiss(msg.id), ttl);
  }

  dismiss(id: string) {
    const cur = this.messagesSubject.value.filter(m => m.id !== id);
    this.messagesSubject.next(cur);
  }
}
