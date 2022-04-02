import { Component, HostBinding } from '@angular/core';
import { DataPoint } from '@jdrks/shared';

@Component({
  selector: 'jdrks-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('class.dark')
  darkModeEnabled = false;

  minDataPointDistance = 0.1;
  dataPoints: DataPoint[] = [];
}
