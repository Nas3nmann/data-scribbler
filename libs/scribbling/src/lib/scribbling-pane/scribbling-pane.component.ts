import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Colors, DataPoint } from '@jdrks/shared';
import { computeControlPoints } from '../spline-calculation/control-point-computation';

@Component({
  selector: 'jdrks-scribbling-pane',
  templateUrl: './scribbling-pane.component.html',
  styleUrls: ['./scribbling-pane.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScribblingPaneComponent implements AfterViewInit {
  @Input()
  dataPoints: DataPoint[] = [];

  @Output()
  dataPointsChange: EventEmitter<DataPoint[]> = new EventEmitter();

  @Input()
  minDataPointDistance = 0.1;

  @ViewChild('svg', { static: false })
  private svg: ElementRef<SVGElement> | null = null;

  private isDrawing = false;

  private width = 0;
  private height = 0;

  @HostListener('mousedown', ['$event'])
  private startDrawing(event: MouseEvent): void {
    if (!this.isDrawing) {
      this.dataPoints = [this.normalizedDataPointFromMouseEvent(event)];
      this.dataPointsChange.emit(this.dataPoints);
      this.isDrawing = true;
    }
  }

  @HostListener('mouseup')
  private stopDrawing(): void {
    this.isDrawing = false;
  }

  @HostListener('mousemove', ['$event'])
  private addDataPoints(event: MouseEvent): void {
    if (this.dataPoints.length < 1 || !this.isDrawing) {
      return;
    }

    const lastPointNormalized = this.dataPoints[this.dataPoints.length - 1];
    const currentPointNormalized =
      this.normalizedDataPointFromMouseEvent(event);

    const distanceLastToCurrent = this.calculateDistance(
      lastPointNormalized,
      currentPointNormalized
    );

    if (distanceLastToCurrent >= this.minDataPointDistance) {
      this.dataPoints.push(currentPointNormalized);
      this.dataPointsChange.emit(this.dataPoints);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateWithAndHeightOfSvg();
  }

  ngAfterViewInit(): void {
    this.updateWithAndHeightOfSvg();
    this.redraw();
  }

  private redraw(): void {
    this.removeAllSvgChildNodes();

    const controlPointsX = computeControlPoints(
      this.dataPoints.map((p) => p.x)
    );
    const controlPointsY = computeControlPoints(
      this.dataPoints.map((p) => p.y)
    );

    for (let i = 0; i < this.dataPoints.length - 1; i++) {
      this.draw(
        this.denormalizeDataPoint(this.dataPoints[i]),
        this.denormalizeDataPoint({
          x: controlPointsX.p1[i],
          y: controlPointsY.p1[i],
        }),
        this.denormalizeDataPoint({
          x: controlPointsX.p2[i],
          y: controlPointsY.p2[i],
        }),
        this.denormalizeDataPoint(this.dataPoints[i + 1])
      );
    }

    requestAnimationFrame(this.redraw.bind(this));
  }

  private removeAllSvgChildNodes(): void {
    if (!this.svg) {
      return;
    }

    this.svg.nativeElement.childNodes.forEach((node) => node.remove());
  }

  private draw(
    startPoint: DataPoint,
    controlPoint1: DataPoint,
    controlPoint2: DataPoint,
    endPoint: DataPoint
  ): void {
    if (!this.svg) {
      return;
    }

    const data =
      `M${startPoint.x} ${startPoint.y} ` +
      `C ${controlPoint1.x} ${controlPoint1.y} ` +
      `${controlPoint2.x} ${controlPoint2.y} ` +
      `${endPoint.x} ${endPoint.y}`;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'stroke', Colors.PRIMARY);
    path.setAttributeNS(null, 'stroke-width', '4');
    path.setAttributeNS(null, 'fill', 'transparent');
    path.setAttributeNS(null, 'd', data);
    this.svg.nativeElement.appendChild(path);
  }

  private updateWithAndHeightOfSvg(): void {
    if (!this.svg) {
      return;
    }

    const clientRect = this.svg.nativeElement.getBoundingClientRect();
    this.width = clientRect.width;
    this.height = clientRect.height;
  }

  private normalizedDataPointFromMouseEvent(event: MouseEvent): DataPoint {
    const xInPixels = event.offsetX;
    const yInPixels = event.offsetY;
    const xNormalized = xInPixels / this.width;
    const yNormalized = 1 - 2 * (yInPixels / this.height);

    return { x: xNormalized, y: yNormalized };
  }

  private denormalizeDataPoint(normalizedPoint: DataPoint): DataPoint {
    return {
      x: normalizedPoint.x * this.width,
      y: (-normalizedPoint.y / 2 + 0.5) * this.height,
    };
  }

  private calculateDistance(point1: DataPoint, point2: DataPoint): number {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }
}
