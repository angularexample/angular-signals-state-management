import { inject, Injectable, Signal } from '@angular/core';
import { XxxPostStore } from './xxx-post-store';
import { XxxPostType } from './xxx-post-types';

@Injectable({
  providedIn: 'root'
})
export class XxxPostFacade {
  private postStore: XxxPostStore = inject(XxxPostStore);
  readonly isNoSelectedPost: Signal<boolean> = this.postStore.isNoSelectedPost;
  readonly isNoSelectedUser: Signal<boolean> = this.postStore.isNoSelectedUser;
  readonly isPostsEmpty: Signal<boolean> = this.postStore.isPostsEmpty;
  readonly isPostsLoaded: Signal<boolean> = this.postStore.isPostsLoaded;
  readonly isPostsLoading: Signal<boolean> = this.postStore.isPostsLoading;
  readonly isSaveButtonDisabled: Signal<boolean> = this.postStore.isSaveButtonDisabled;
  readonly posts: Signal<XxxPostType[]> = this.postStore.posts;
  readonly selectedPost: Signal<XxxPostType | undefined> = this.postStore.selectedPost;
  readonly selectedPostId: Signal<number | undefined> = this.postStore.selectedPostId;
  readonly selectedUserId: Signal<number | undefined> = this.postStore.selectedUserId;

  setSelectedPostId(postId: number): void {
    this.postStore.setSelectedPostId(postId);
  }

  setPostForm(post: XxxPostType): void {
    this.postStore.setPostForm(post)
  }

  showPosts(): void {
    this.postStore.showPosts();
  }

  updatePost(): void {
    this.postStore.updatePost()
  }
}
