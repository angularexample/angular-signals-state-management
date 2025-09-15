import { ChangeDetectionStrategy, Component, inject, Input, OnInit, Signal } from '@angular/core';
import { XxxContentFacade } from './xxx-content-facade';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'xxx-content',
  templateUrl: './xxx-content.html',
})
export class XxxContent implements OnInit {
  @Input({required: true}) contentKey!: string;
  private contentFacade: XxxContentFacade = inject(XxxContentFacade);
  protected readonly $isContentEmpty: Signal<boolean> = this.contentFacade.$isContentEmpty(this.contentKey);
  protected readonly $isContentLoading: Signal<boolean> = this.contentFacade.$isContentLoading(this.contentKey);

  ngOnInit(): void {
    this.contentFacade.showContent(this.contentKey);
  }
}
