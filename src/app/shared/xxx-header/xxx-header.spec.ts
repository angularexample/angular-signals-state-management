import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { XxxContentFacade } from '../../core/xxx-content/xxx-content-facade';
import { XxxHeader } from './xxx-header';

describe('XxxHeader', () => {
  let component: XxxHeader;
  let fixture: ComponentFixture<XxxHeader>;
  const mockXxxContentFacade = {
    contentByKey: jest.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XxxHeader],
      providers: [
        {provide: XxxContentFacade, useValue: mockXxxContentFacade},
        provideRouter([])
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(XxxHeader);
    component = fixture.componentInstance;
  });

  describe('construction', () => {
    it('should create the component', () => {
      expect(component).toBeDefined();
    });
  });
});
