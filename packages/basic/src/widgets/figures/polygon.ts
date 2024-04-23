import type { Canvas, CanvasKit, Path } from 'canvaskit-wasm'
import type { Vector2 } from '../../utils/vector2'
import { str2StrokeCap, str2StrokeJoin } from '../../utils/trans'
import type { FigureOptions, FigureStyle } from './figure'
import { Figure } from './figure'

export interface PolygonOptions extends FigureOptions {
  style?: FigureStyle
}

export interface PolygonStyle extends FigureStyle {}

export class Polygon extends Figure {
  path: Path

  constructor(public points: Vector2[], options?: PolygonOptions) {
    options ??= {}
    super(options)
  }

  init(ck: CanvasKit): void {
    this.path = new ck.Path()
    for (const [index, point] of this.points.entries()) {
      if (index === 0)
        this.path.moveTo(...point)
      else
        this.path.lineTo(...point)
    }
    this.path.close()
    // Stroke
    this.strokePaint = new ck.Paint()
    this.strokePaint.setStyle(ck.PaintStyle.Stroke)
    this.strokePaint.setColor(this.style.borderColor.toFloat4())
    this.strokePaint.setStrokeWidth(this.style.borderWidth)
    this.strokePaint.setStrokeJoin(str2StrokeJoin(ck, this.style.join))
    this.strokePaint.setStrokeCap(str2StrokeCap(ck, this.style.cap))
    try {
      const dash = ck.PathEffect.MakeDash(
        this.style.interval,
        this.style.offset,
      )
      this.strokePaint.setPathEffect(dash)
    }
    catch {}

    // Fill
    this.fillPaint = new ck.Paint()
    this.fillPaint.setStyle(ck.PaintStyle.Fill)
    this.fillPaint.setColor(this.style.fillColor.toFloat4())

    // Alpha
    this.strokePaint.setAlphaf(this.style.transparency)
    this.fillPaint.setAlphaf(this.style.transparency)
  }

  predraw(ck: CanvasKit, propertyChanged: string): void {
    switch (propertyChanged) {
      case 'points': {
        this.path.moveTo(0, 0)
        for (const [index, point] of this.points.entries()) {
          if (index === 0)
            this.path.moveTo(...point)
          else
            this.path.lineTo(...point)
        }
        this.path.close()
        break
      }
      case 'style.borderColor': {
        this.strokePaint.setColor(this.style.borderColor.toFloat4())
        break
      }
      case 'style.borderWidth': {
        this.strokePaint.setStrokeWidth(this.style.borderWidth)
        break
      }
      case 'style.fillColor': {
        this.fillPaint.setColor(this.style.fillColor.toFloat4())
        break
      }
      case 'style.join': {
        this.strokePaint.setStrokeJoin(str2StrokeJoin(ck, this.style.join))
        break
      }
      case 'style.cap': {
        this.strokePaint.setStrokeCap(str2StrokeCap(ck, this.style.cap))
        break
      }
      case 'style.offset':
      case 'style.interval': {
        this.strokePaint.setPathEffect(
          ck.PathEffect.MakeDash(this.style.interval, this.style.offset),
        )
      }
    }
    this.strokePaint.setAlphaf(this.style.transparency)
    this.fillPaint.setAlphaf(this.style.transparency)
  }

  draw(canvas: Canvas): void {
    if (this.style.border)
      canvas.drawPath(this.path, this.strokePaint)

    if (this.style.fill)
      canvas.drawPath(this.path, this.fillPaint)
  }

  isIn(x: number, y: number): boolean {
    let inside = false
    const n = this.points.length

    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = this.points[i][0]
      const yi = this.points[i][1]
      const xj = this.points[j][0]
      const yj = this.points[j][1]

      const intersect
      = ((yi > y) !== (yj > y))
      && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)

      if (intersect)
        inside = !inside
    }
    console.log(inside);
    

    return inside
  }
}
