import { inject, Injectable, Signal } from '@angular/core';
import { XxxUserStore } from './xxx-user-store';
import { XxxUserType } from './xxx-user-types';

@Injectable({
  providedIn: 'root'
})
export class XxxUserFacade {
  private userStore: XxxUserStore = inject(XxxUserStore);
  readonly isUsersEmpty: Signal<boolean> = this.userStore.isUsersEmpty;
  readonly isUsersLoaded: Signal<boolean> = this.userStore.isUsersLoaded;
  readonly isUsersLoading: Signal<boolean> = this.userStore.isUsersLoading;
  readonly selectedUserId: Signal<number | undefined> = this.userStore.selectedUserId;
  readonly users: Signal<XxxUserType[]> = this.userStore.users;

  showUsers(): void {
    this.userStore.showUsers();
  }

  setSelectedUserId(userId: number): void {
    this.userStore.setSelectedUserId(userId);
  }
}
