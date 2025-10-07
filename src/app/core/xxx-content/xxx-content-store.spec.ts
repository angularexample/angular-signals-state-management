import { mockContentApiEmpty, mockContentApiHome, mockContentHome } from './xxx-content.mocks';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { XxxAlert } from '../xxx-alert/xxx-alert';
import { XxxContentData } from './xxx-content-data';
import { XxxContentStore } from './xxx-content-store';
import { XxxContentType } from './xxx-content-types';

describe('XxxContentStore', () => {
  let service: XxxContentStore;
  let contentKey: string;

  const mockXxxContentData = {
    getContent: jest.fn()
  }

  const mockXxxAlert = {
    showError: jest.fn(),
    showInfo: jest.fn(),
    showWarning: jest.fn(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {provide: XxxAlert, useValue: mockXxxAlert},
        {provide: XxxContentData, useValue: mockXxxContentData},
        XxxContentStore
      ],
    });
    service = TestBed.inject(XxxContentStore);
    contentKey = 'home';
    mockXxxContentData.getContent.mockReturnValue(of(mockContentApiHome));
  });

  afterEach(() => {
    mockXxxAlert.showError.mockClear();
    mockXxxContentData.getContent.mockClear();
  })

  describe('constructor phase', () => {
    it('should be created', () => {
      expect(service).toBeDefined();
    });

    it('should have showContentAction', () => {
      expect(service.showContentAction).toBeDefined();
    });

    it('should have selectContentByKey', () => {
      expect(service.selectContentByKey).toBeDefined();
    });

    it('should have selectIsContentEmpty', () => {
      expect(service.selectIsContentEmpty).toBeDefined();
    });

    it('should have selectIsContentError', () => {
      expect(service.selectIsContentError).toBeDefined();
    });
  })

  describe('selectContentByKey', () => {
    it('should return expected content by key', () => {
      service.showContentAction(contentKey);
      const result: Signal<XxxContentType | undefined> = service.selectContentByKey(contentKey);
      expect(result()).toEqual(mockContentHome);
    });
  });

  describe('selectIsContentEmpty', () => {
    it('should return true when content is empty', () => {
      contentKey = 'empty';
      mockXxxContentData.getContent.mockReturnValue(of(mockContentApiEmpty));
      service.showContentAction(contentKey);
      const result: Signal<boolean> = service.selectIsContentEmpty(contentKey);
      expect(result()).toBe(true);
    });

    it('should return false when content is not empty', () => {
      service.showContentAction(contentKey);
      const result: Signal<boolean> = service.selectIsContentEmpty(contentKey);
      expect(result()).toBe(false);
    });

    it('should return false when content is not found', () => {
      service.showContentAction(contentKey);
      contentKey = 'none';
      const result: Signal<boolean> = service.selectIsContentEmpty(contentKey);
      expect(result()).toBe(false);
    });
  });

  describe('selectIsContentError', () => {
    it('should return true when content has error', () => {
      mockXxxContentData.getContent.mockReturnValue(throwError(() => new Error('some error')));
      service.showContentAction(contentKey);
      const result: Signal<boolean> = service.selectIsContentError(contentKey);
      expect(result()).toBe(true);
    });

    it('should return false when content does not have error', () => {
      service.showContentAction(contentKey);
      const result: Signal<boolean> = service.selectIsContentError(contentKey);
      expect(result()).toBe(false);
    });

    it('should return false when content is not found', () => {
      service.showContentAction(contentKey);
      contentKey = 'none';
      const result: Signal<boolean> = service.selectIsContentError(contentKey);
      expect(result()).toBe(false);
    });
  });

  describe('showContentAction', () => {
    it('should handle success', () => {
      service.showContentAction(contentKey);
      expect(mockXxxContentData.getContent).toHaveBeenCalledWith(contentKey);
    });

    it('should handle error', () => {
      const errorMessage: string = `Error. Unable to get content for ${contentKey}`;
      mockXxxContentData.getContent.mockReturnValue(throwError(() => new Error('some error')));
      service.showContentAction(contentKey);
      expect(mockXxxAlert.showError).toHaveBeenCalledWith(errorMessage);
    });

    it('should handle case where content is loaded', () => {
      service.showContentAction(contentKey);
      mockXxxContentData.getContent.mockClear();
      service.showContentAction(contentKey);
      expect(mockXxxContentData.getContent).not.toHaveBeenCalled();
    });
  })
});
