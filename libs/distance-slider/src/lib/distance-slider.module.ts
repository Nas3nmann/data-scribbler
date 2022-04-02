import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistanceSliderComponent } from './distance-slider/distance-slider.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DistanceSliderComponent],
  exports: [DistanceSliderComponent],
})
export class DistanceSliderModule {}
