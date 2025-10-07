import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XxxContentFacade } from '../../core/xxx-content/xxx-content-facade';
import { XxxHome } from './xxx-home';
import { XxxSanitizePipe } from '../../core/xxx-sanitize/xxx-sanitize-pipe';

describe('XxxHome', () => {
  let component: XxxHome;
  let fixture: ComponentFixture<XxxHome>;

  const mockXxxContentFacade = {
    contentByKey: jest.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XxxHome, XxxSanitizePipe],
      providers: [
        {provide: XxxContentFacade, useValue: mockXxxContentFacade},
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(XxxHome);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });
});
