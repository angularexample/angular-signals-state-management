import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockContentHome } from './xxx-content.mocks';
import { XxxContent } from './xxx-content';
import { XxxContentFacade } from './xxx-content-facade';

const mockContentKey: string = 'content-key';

// To test the input, use a mock host component.
@Component({
  imports: [XxxContent],
  template: '<xxx-content [contentKey]="contentKey"></xxx-content>'
})
class HostComponent {
  contentKey: string = mockContentKey;
}

describe('XxxContent', () => {
  let hostFixture: ComponentFixture<HostComponent>;
  let contentComponent: XxxContent;

  const mockXxxContentFacade = {
    contentByKey: jest.fn().mockReturnValue(signal(mockContentHome)),
    isContentEmpty: jest.fn().mockReturnValue(signal(false)),
    isContentError: jest.fn().mockReturnValue(signal(false)),
    showContent: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        {provide: XxxContentFacade, useValue: mockXxxContentFacade},
      ]
    }).compileComponents();
    hostFixture = TestBed.createComponent(HostComponent);
    // Get the instance of the component under test as a child of the host component.
    contentComponent = hostFixture.debugElement.children[0].componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('constructor phase', () => {
    it('should be created', () => {
      expect(contentComponent).toBeDefined();
    });
  })

  describe('OnInit', () => {
    it('should have input value', async () => {
      // To test a zoneless component that has inputs, use whenStable()
      await hostFixture.whenStable();
      expect(contentComponent.contentKey()).toBe(mockContentKey);
    });

    it('should run contentFacade.isContentEmpty', async () => {
      await hostFixture.whenStable();
      expect(mockXxxContentFacade.isContentEmpty).toHaveBeenCalledWith(mockContentKey);
    });

    it('should run contentFacade.isContentError', async () => {
      await hostFixture.whenStable();
      expect(mockXxxContentFacade.isContentError).toHaveBeenCalledWith(mockContentKey);
    });

    it('should run contentFacade.showContent', async () => {
      await hostFixture.whenStable();
      expect(mockXxxContentFacade.showContent).toHaveBeenCalledWith(mockContentKey);
    });
  });
});
