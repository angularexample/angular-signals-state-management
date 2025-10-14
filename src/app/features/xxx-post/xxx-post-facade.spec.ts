import { mockPost } from './xxx-post.mocks';
import { TestBed } from '@angular/core/testing';
import { XxxPostFacade } from './xxx-post-facade';
import { XxxPostStore } from './xxx-post-store';

describe('XxxPostFacade', () => {
  const mockXxxPostStore = {
    isNoSelectedPost: jest.fn(),
    isNoSelectedUser: jest.fn(),
    isPostsEmpty: jest.fn(),
    isPostsLoaded: jest.fn(),
    isPostsLoading: jest.fn(),
    isSaveButtonDisabled: jest.fn(),
    posts: jest.fn(),
    selectedPost: jest.fn(),
    selectedPostId: jest.fn(),
    selectedUserId: jest.fn(),
    setPostForm: jest.fn(),
    setSelectedPostId: jest.fn(),
    showPosts: jest.fn(),
    updatePost: jest.fn(),
  };

  TestBed.configureTestingModule({
    providers: [
      XxxPostFacade,
      {provide: XxxPostStore, useValue: mockXxxPostStore},
    ],
  });

  const service: XxxPostFacade = TestBed.inject(XxxPostFacade);
  describe('constructor phase', () => {
    it('should be created', () => {
      expect(service).toBeDefined();
    });

    it('should have isNoSelectedPost', () => {
      expect(service.isNoSelectedPost).toBeDefined();
    });

    it('should have isNoSelectedUser', () => {
      expect(service.isNoSelectedUser).toBeDefined();
    });

    it('should have isPostsEmpty', () => {
      expect(service.isPostsEmpty).toBeDefined();
    });

    it('should have isPostsLoaded', () => {
      expect(service.isPostsLoaded).toBeDefined();
    });

    it('should have isPostsLoading', () => {
      expect(service.isPostsLoading).toBeDefined();
    });

    it('should have isSaveButtonDisabled', () => {
      expect(service.isSaveButtonDisabled).toBeDefined();
    });

    it('should have posts', () => {
      expect(service.posts).toBeDefined();
    });

    it('should have selectedPost', () => {
      expect(service.selectedPost).toBeDefined();
    });

    it('should have selectedPostId', () => {
      expect(service.selectedPostId).toBeDefined();
    });

    it('should have selectedUserId', () => {
      expect(service.selectedUserId).toBeDefined();
    });
  })

  describe('setSelectedPostId', () => {
    it('should call postStore.setSelectedPostId', () => {
      service.setSelectedPostId(mockPost.id);
      expect(mockXxxPostStore.setSelectedPostId).toHaveBeenCalledWith(mockPost.id);
    });
  });

  describe('setPostForm', () => {
    it('should call postStore.setPostForm', () => {
      service.setPostForm(mockPost);
      expect(mockXxxPostStore.setPostForm).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('showPosts', () => {
    it('should call postStores.showPosts', () => {
      service.showPosts();
      expect(mockXxxPostStore.showPosts).toHaveBeenCalled();
    });
  });

  describe('updatePost', () => {
    it('should call postStores.updatePost', () => {
      service.updatePost();
      expect(mockXxxPostStore.updatePost).toHaveBeenCalled();
    });
  });
});
