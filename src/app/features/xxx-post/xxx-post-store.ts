import { catchError, of } from "rxjs";
import { computed, inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { XxxAlert } from "../../core/xxx-alert/xxx-alert";
import { XxxHttpUtilities } from "../../core/xxx-utilities/xxx-http-utilities";
import { XxxLoadingService } from "../../core/xxx-loading/xxx-loading-service";
import { XxxPostType, xxxPostInitialState, XxxPostState } from "./xxx-post-types";
import { XxxPostData } from "./xxx-post-data"
import { XxxUserStore } from "../xxx-user/xxx-user-store";

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
  private userStore: XxxUserStore = inject(XxxUserStore);

  // State
  // Where we store all the properties needed to support the view
  private $postState: WritableSignal<XxxPostState> = signal<XxxPostState>(xxxPostInitialState);

  // Actions
  // In this design actions are methods that trigger reducers and effects
  private getPostsAction(): void {
    this.getPostsReducer();
    this.getPostsEffect();
  }

  private getPostsErrorAction(err: HttpErrorResponse): void {
    this.getPostsErrorReducer();
    this.getPostsErrorEffect(err);
  }

  private getPostsSuccessAction(posts: XxxPostType[]): void {
    this.getPostsSuccessReducer(posts);
    this.getPostsSuccessEffect();
  }

  selectPostAction(postId: number): void {
    this.selectPostReducer(postId);
    this.selectPostEffect();
  }

  setPostFormAction(post: XxxPostType): void {
    this.setPostFormReducer(post);
  }

  showPostsAction(): void {
    this.showPostsEffect();
  }

  updatePostAction(): void {
    this.updatePostReducer();
    this.updatePostEffect();
  }

  private updatePostErrorAction(err: HttpErrorResponse | undefined): void {
    this.updatePostErrorReducer();
    this.updatePostErrorEffect(err);
  }

  private updatePostSuccessAction(): void {
    this.updatePostSuccessReducer();
    this.updatePostSuccessEffect();
  }


  // Selectors
  readonly $selectIsNoSelectedPost: Signal<boolean> = computed(() => this.$postState().selectedPostId === undefined);

  readonly $selectIsNoSelectedUser: Signal<boolean> = this.userStore.$selectIsNoSelectedUser;

  readonly $selectIsPostsEmpty: Signal<boolean> = computed(() => !this.$postState().isPostsLoading && this.$postState().posts.length === 0);

  readonly $selectIsPostsLoaded: Signal<boolean> = computed(() => this.$postState().posts.length > 0);

  readonly $selectIsPostsLoading: Signal<boolean> = computed(() => this.$postState().isPostsLoading);

  readonly $selectIsPostUpdating: Signal<boolean> = computed(() => this.$postState().isPostUpdating);

  readonly $selectSelectedPostId: Signal<number | undefined> = computed(() => this.$postState().selectedPostId);

  private readonly $selectPostForm: Signal<XxxPostType | undefined> = computed(() => this.$postState().postForm);

  readonly $selectPosts: Signal<XxxPostType[]> = computed(() => this.$postState().posts);

  readonly $selectSelectedPost: Signal<XxxPostType | undefined> = computed(() => {
    let post: XxxPostType | undefined;
    const posts: XxxPostType[] = this.$selectPosts();
    const postId: number | undefined = this.$selectSelectedPostId();
    if (postId !== undefined && posts.length > 0) {
      post = posts.find(item => item.id === postId);
    }
    return post;
  });

  readonly $selectIsSaveButtonDisabled: Signal<boolean> = computed(() => {
    const postForm: XxxPostType | undefined = this.$selectPostForm();
    const selectedPost: XxxPostType | undefined = this.$selectSelectedPost();
    const isPostFormEqual: boolean = JSON.stringify(selectedPost) === JSON.stringify(postForm);
    return this.$selectIsPostUpdating() || (!this.$selectIsPostsLoaded()) || (this.$selectSelectedPost() === undefined) || (postForm === undefined) || isPostFormEqual;
  });

// Reducers
  private getPostsReducer(): void {
    this.$postState.update(state =>
      ({
        ...state,
        isLoading: true,
        Posts: []
      })
    )
  }

  private getPostsErrorReducer(): void {
    this.$postState.update(state =>
      ({
        ...state,
        isLoading: false
      })
    )
  }

  private getPostsSuccessReducer(posts: XxxPostType[]): void {
    this.$postState.update(state =>
      ({
        ...state,
        isLoading: false,
        posts
      })
    )
  }

  private selectPostReducer(postId: number): void {
    // make sure the post exists
    if (this.$postState().posts.some(item => item.id === postId)) {
      this.$postState.update(state =>
        ({
          ...state,
          selectedPostId: postId
        })
      )
    }
  }

  private setPostFormReducer(post: XxxPostType): void {
    // Create a new object for immutability
    const postForm: XxxPostType = <XxxPostType>JSON.parse(JSON.stringify(post));
    this.$postState.update(state =>
      ({
        ...state,
        postForm
      })
    )
  }

  private updatePostReducer(): void {
    this.$postState.update(state =>
      ({
        ...state,
        isPostUpdating: true
      })
    )
  }

  private updatePostErrorReducer(): void {
    this.$postState.update(state =>
      ({
        ...state,
        isPostUpdating: false
      })
    )
  }

  private updatePostSuccessReducer(): void {
    this.$postState.update(state =>
      ({
        ...state,
        isPostUpdating: false
      })
    )
  }

  // Effects
  private getPostsEffect(): void {
    const userId: number | undefined = this.userStore.$selectSelectedUserId();
    if (userId === undefined) {
      return;
    }
    this.loadingService.loadingOn();
    this.postDataService.getPosts(userId).pipe(
      catchError((err: HttpErrorResponse) => {
        this.getPostsErrorAction(err);
        return of([]);
      })
    ).subscribe((response: unknown) => {
      const posts: XxxPostType[] = response as XxxPostType[];
      this.getPostsSuccessAction(posts);
    })
  }

  private getPostsErrorEffect(err: HttpErrorResponse): void {
    this.loadingService.loadingOff();
    const errorMessage: string = XxxHttpUtilities.setErrorMessage(err);
    this.alertService.showError(errorMessage);
  }

  private getPostsSuccessEffect(): void {
    this.loadingService.loadingOff();
  }

  private selectPostEffect(): void {
    void this.router.navigateByUrl('/post/edit')
  }

  private showPostsEffect(): void {
    if (!this.$selectIsPostsLoaded()) {
      this.getPostsAction();
    }
  }

  private updatePostEffect(): void {
    this.loadingService.loadingOn();
    const post: XxxPostType | undefined = this.$selectPostForm();
    if (post === undefined) {
      this.updatePostErrorAction(undefined);
      return;
    } else {
      let isError: boolean = false;
      this.postDataService.updatePost(post).pipe(
        catchError((err: HttpErrorResponse) => {
          isError = true;
          this.updatePostErrorAction(err);
          return of({});
        })
      ).subscribe(() => {
        if (!isError) {
          this.updatePostSuccessAction()
        }
      })
    }
  }

  private updatePostErrorEffect(err: HttpErrorResponse | undefined): void {
    this.loadingService.loadingOff();
    let errorMessage: string = 'Error occurred. Unable to update post.';
    if (err) {
      errorMessage = `${errorMessage} ${XxxHttpUtilities.setErrorMessage(err)}`;
    }
    this.alertService.showError(errorMessage);
  }

  private updatePostSuccessEffect(): void {
    this.loadingService.loadingOff();
    this.alertService.showInfo('Successfully updated post');
    void this.router.navigateByUrl('/post')
  }
}
