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

    const controlPointsX = this.computeControlPoints(
      this.dataPoints.map((p) => p.x)
    );
    const controlPointsY = this.computeControlPoints(
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

  private computeControlPoints(coordinates: number[]): {
    p1: number[];
    p2: number[];
  } {
    if (coordinates.length === 2) {
      return {
        p1: [coordinates[0]],
        p2: [coordinates[1]],
      };
    }

    const p1 = [];
    const p2 = [];
    const numberOfCoordinates = coordinates.length - 1;

    const a = [];
    const b = [];
    const c = [];
    const r = [];

    /*left most segment*/
    a[0] = 0;
    b[0] = 2;
    c[0] = 1;
    r[0] = coordinates[0] + 2 * coordinates[1];

    /*internal segments*/
    for (let i = 1; i < numberOfCoordinates - 1; i++) {
      a[i] = 1;
      b[i] = 4;
      c[i] = 1;
      r[i] = 4 * coordinates[i] + 2 * coordinates[i + 1];
    }

    /*right segment*/
    a[numberOfCoordinates - 1] = 2;
    b[numberOfCoordinates - 1] = 7;
    c[numberOfCoordinates - 1] = 0;
    r[numberOfCoordinates - 1] =
      8 * coordinates[numberOfCoordinates - 1] +
      coordinates[numberOfCoordinates];

    /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
    for (let i = 1; i < numberOfCoordinates; i++) {
      const m: number = a[i] / b[i - 1];
      b[i] = b[i] - m * c[i - 1];
      r[i] = r[i] - m * r[i - 1];
    }

    p1[numberOfCoordinates - 1] =
      r[numberOfCoordinates - 1] / b[numberOfCoordinates - 1];
    for (let i = numberOfCoordinates - 2; i >= 0; --i) {
      p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];
    }

    /*we have p1, now compute p2*/
    for (let i = 0; i < numberOfCoordinates - 1; i++) {
      p2[i] = 2 * coordinates[i + 1] - p1[i + 1];
    }

    p2[numberOfCoordinates - 1] =
      0.5 * (coordinates[numberOfCoordinates] + p1[numberOfCoordinates - 1]);

    return { p1, p2 };
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
