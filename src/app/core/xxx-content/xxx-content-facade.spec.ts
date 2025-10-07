import { TestBed } from '@angular/core/testing';
import { XxxContentFacade } from './xxx-content-facade';
import { XxxContentStore } from './xxx-content-store';

describe('XxxContentFacade', () => {
  const mockXxxContentStore = {
    selectContentByKey: jest.fn(),
    selectIsContentEmpty: jest.fn(),
    selectIsContentError: jest.fn(),
    showContentAction: jest.fn(),
  };
  let service: XxxContentFacade;
  const contentKey: string = 'content-key';

  TestBed.configureTestingModule({
    providers: [
      XxxContentFacade,
      {provide: XxxContentStore, useValue: mockXxxContentStore},
    ],
  });

  service = TestBed.inject(XxxContentFacade);
  describe('constructor phase', () => {
    it('should be created', () => {
      expect(service).toBeDefined();
    });

    it('should have contentByKey', () => {
      expect(service.contentByKey).toBeDefined();
    });

    it('should have isContentEmpty', () => {
      expect(service.isContentEmpty).toBeDefined();
    });

    it('should have isContentError', () => {
      expect(service.isContentError).toBeDefined();
    });
  })

  describe('methods', () => {
    it('should run contentStore.contentByKey', () => {
      service.contentByKey(contentKey);
      expect(mockXxxContentStore.selectContentByKey).toHaveBeenCalledWith(contentKey);
    });

    it('should run contentStore.isContentEmpty', () => {
      service.isContentEmpty(contentKey);
      expect(mockXxxContentStore.selectIsContentEmpty).toHaveBeenCalledWith(contentKey);
    });

    it('should run contentStore.isContentError', () => {
      service.isContentError(contentKey);
      expect(mockXxxContentStore.selectIsContentError).toHaveBeenCalledWith(contentKey);
    });

    it('should run contentStore.showContent', () => {
      service.showContent(contentKey);
      expect(mockXxxContentStore.showContentAction).toHaveBeenCalledWith(contentKey);
    });
  });
});
