import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'jdrks-distance-slider',
  templateUrl: './distance-slider.component.html',
  styleUrls: ['./distance-slider.component.scss'],
})
export class DistanceSliderComponent {
  private _distance = 0;

  @Input()
  minValue = 0;

  @Input()
  maxValue = 1;

  @Input()
  step = 0.1;

  @Input()
  get distance() {
    return this._distance;
  }

  set distance(value) {
    this._distance = value;
    this.distanceChange.emit(value);
  }

  @Output()
  distanceChange: EventEmitter<number> = new EventEmitter();
}
