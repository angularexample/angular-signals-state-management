import { catchError, of } from 'rxjs';
import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { isPostsEqual } from "./xxx-post-utilities";
import { Router } from '@angular/router';
import { XxxAlert } from '../../core/xxx-alert/xxx-alert';
import { XxxLoadingService } from '../../core/xxx-loading/xxx-loading-service';
import { XxxPostData } from './xxx-post-data'
import { xxxPostInitialState, XxxPostState, XxxPostType } from './xxx-post-types';
import { XxxUserFacade } from '../xxx-user/xxx-user-facade';

/**
 * XxxPostStore is the feature state for the post page.
 * State management for Angular using only Signals and RxJS.
 * If you already know NgRx, then we have organized it using the same categories.
 */
@Injectable({
  providedIn: 'root'
})
export class XxxPostStore {
  private alertService: XxxAlert = inject(XxxAlert);
  private loadingService: XxxLoadingService = inject(XxxLoadingService);
  private postDataService: XxxPostData = inject(XxxPostData);
  private router: Router = inject(Router);
  private userFacade: XxxUserFacade = inject(XxxUserFacade);

  // State
  private postState: WritableSignal<XxxPostState> = signal<XxxPostState>(xxxPostInitialState);

  // Actions
  private getPosts(): void {
    this.getPostsReducer();
    this.getPostsEffect();
  }

  private getPostsError(userId: number): void {
    this.getPostsErrorReducer();
    this.getPostsErrorEffect(userId);
  }

  private getPostsSuccess(posts: XxxPostType[]): void {
    this.getPostsSuccessReducer(posts);
    this.getPostsSuccessEffect();
  }

  setPostForm(post: XxxPostType): void {
    this.setPostFormReducer(post);
  }

  setSelectedPostId(postId: number): void {
    this.setSelectedPostIdReducer(postId);
    this.setSelectedPostIdEffect();
  }

  setSelectedUserId(userId: number): void {
    this.setSelectedUserIdReducer(userId);
    this.setSelectedUserIdEffect();
  }

  showPosts(): void {
    this.showPostsEffect();
  }

  updatePost(): void {
    this.updatePostEffect();
  }

  private updatePostError(postId: number): void {
    this.updatePostErrorReducer();
    this.updatePostErrorEffect(postId);
  }

  private updatePostSuccess(post: XxxPostType): void {
    this.updatePostSuccessReducer(post);
    this.updatePostSuccessEffect();
  }

  // Selectors
  readonly isNoSelectedPost: Signal<boolean> = computed(() => this.postState().selectedPostId === undefined ||
    !this.postState().isPostsLoading && this.postState().posts.length === 0);

  readonly isNoSelectedUser: Signal<boolean> = computed(() => this.selectedUserId() === undefined);

  readonly isPostsEmpty: Signal<boolean> = computed(() => !this.postState().isPostsLoading && this.postState().posts.length === 0);

  readonly isPostsLoaded: Signal<boolean> = computed(() => !this.postState().isPostsLoading && this.postState().posts.length > 0);

  readonly isPostsLoading: Signal<boolean> = computed(() => this.postState().isPostsLoading);

  readonly isSaveButtonDisabled: Signal<boolean> = computed(() => {
    const postForm: XxxPostType | undefined = this.postForm();
    const selectedPost: XxxPostType | undefined = this.selectedPost();
    const isPostFormEqual: boolean = isPostsEqual(postForm, selectedPost);
    return (!this.isPostsLoaded()) || (this.selectedPost() === undefined) || (postForm === undefined) || isPostFormEqual;
  });

  private readonly postForm: Signal<XxxPostType | undefined> = computed(() => this.postState().postForm);

  readonly posts: Signal<XxxPostType[]> = computed(() => this.postState().posts);

  readonly selectedPost: Signal<XxxPostType | undefined> = computed(() => {
    let post: XxxPostType | undefined;
    const posts: XxxPostType[] = this.posts();
    const postId: number | undefined = this.selectedPostId();
    if (postId !== undefined && posts.length > 0) {
      post = posts.find(item => item.id === postId);
    }
    return post;
  });

  readonly selectedPostId: Signal<number | undefined> = computed(() => this.postState().selectedPostId);

  readonly selectedUserId: Signal<number | undefined> = computed(() => this.postState().selectedUserId);


// Reducers
  private getPostsReducer(): void {
    this.postState.update(state =>
      ({
        ...state,
        isUsersLoading: true,
        Posts: []
      })
    );
  }

  private getPostsErrorReducer(): void {
    this.postState.update(state =>
      ({
        ...state,
        isUsersLoading: false
      })
    );
  }

  private getPostsSuccessReducer(posts: XxxPostType[]): void {
    this.postState.update(state =>
      ({
        ...state,
        isUsersLoading: false,
        posts
      })
    );
  }

  private setSelectedPostIdReducer(postId: number): void {
    // make sure the post exists
    if (this.postState().posts.some(item => item.id === postId)) {
      this.postState.update(state =>
        ({
          ...state,
          postForm: undefined,
          selectedPostId: postId
        })
      );
    }
  }

  private setPostFormReducer(post: XxxPostType): void {
    // Create a new object for immutability
    const postForm: XxxPostType = <XxxPostType>JSON.parse(JSON.stringify(post));
    this.postState.update(state =>
      ({
        ...state,
        postForm
      })
    );
  }

  private setSelectedUserIdReducer(userId: number) {
    // Use signal set instead of update when setting and not updating the state.
    this.postState.set(
      ({
        ...xxxPostInitialState,
        selectedUserId: userId,
      })
    );
  }

  private updatePostErrorReducer(): void {
    this.postState.update(state =>
      ({
        ...state,
        isPostUpdating: false
      })
    );
  }

  private updatePostSuccessReducer(post: XxxPostType): void {
    this.postState.update(state => {
        // remove the old post, add the new one, sort by id
        let posts = state.posts.filter(item => item.id !== post.id);
        const updatedPost: XxxPostType = {...post};
        posts.push(updatedPost);
        posts.sort((a: XxxPostType, b: XxxPostType) => a.id - b.id);
        return {
          ...state,
          isPostUpdating: false,
          posts
        };
      }
    );
  }

  // Effects
  private getPostsEffect(): void {
    const userId: number | undefined = this.selectedUserId();
    if (userId === undefined) {
      return;
    }
    this.loadingService.loadingOn();
    let isError = false;
    this.postDataService.getPosts(userId).pipe(
      catchError(() => {
        isError = true;
        this.getPostsError(userId);
        return of([]);
      })
    ).subscribe((response: unknown) => {
      if (!isError) {
        const posts: XxxPostType[] = response as XxxPostType[];
        this.getPostsSuccess(posts);
      }
    })
  }

  private getPostsErrorEffect(userId: number): void {
    this.loadingService.loadingOff();
    this.alertService.showError('Error. Unable to get posts for user: ' + userId);
  }

  private getPostsSuccessEffect(): void {
    this.loadingService.loadingOff();
  }

  private setSelectedPostIdEffect(): void {
    void this.router.navigateByUrl('/post/edit');
  }

  private setSelectedUserIdEffect() {
    this.getPosts();
  }

  private showPostsEffect(): void {
    const selectedUserId: number | undefined = this.userFacade.selectedUserId();
    const postSelectedUserId: number | undefined = this.selectedUserId();
    if (selectedUserId !== undefined) {
      if (selectedUserId !== postSelectedUserId) {
        this.setSelectedUserId(selectedUserId);
      }
    }
  }

  private updatePostEffect(): void {
    this.loadingService.loadingOn();
    const post: XxxPostType | undefined = this.postForm();
    if (post === undefined) {
      //unexpected error, post should not be undefined
      this.updatePostError(0);
      return;
    } else {
      let isError: boolean = false;
      this.postDataService.updatePost(post).pipe(
        catchError(() => {
          isError = true;
          this.updatePostError(post.id);
          return of({});
        })
      ).subscribe((postResponse: XxxPostType | {}) => {
        if (!isError && Object.keys(postResponse).length > 0) {
          this.updatePostSuccess(postResponse as XxxPostType);
        }
      })
    }
  }

  private updatePostErrorEffect(postId: number): void {
    this.loadingService.loadingOff();
    this.alertService.showError('Error. Unable to update post: ' + postId);
  }

  private updatePostSuccessEffect(): void {
    this.loadingService.loadingOff();
    this.alertService.showInfo('Successfully updated post');
    void this.router.navigateByUrl('/post')
  }
}
