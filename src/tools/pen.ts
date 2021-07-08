import Konva from 'konva'
import { KonvaEventObject } from 'konva/types/Node'
import Tool from '../core/tool'
import { DrawLineCommand } from '../commands'
import DrawingContext from '../drawing_context'
import Layering from '../core/layering'

const TENSION_TO_SMOOTHNESS_RATION = 1 / 100
const THRESHOLD_TO_SMOOTHNESS_RATIO = 10 / 1

export class PenTool extends Tool {
  private line?: Konva.Line
  private layering!: Layering

  // drawing mode flag.
  //
  // in free drawing mode, points are added to the line as the user moves the mouse across the screen.
  //
  // in line drawing mode, clicks determine the start and end the line, making straight lines.
  // in this mode, the line contains an extra point. onMouseMove replaces this point to display the
  // line following the user's mouse movement.
  private mode: 'free' | 'line' | 'none' = 'none'

  private smoothness = 0

  activate(context: DrawingContext): void {
    super.activate(context)
    this.layering = context.layering
  }

  deactivate(): void {
    if (this.line) this.endLine()
    super.deactivate()
  }

  onMouseClick(_: KonvaEventObject<MouseEvent>): boolean {
    if (this.mode === 'none') {
      const { x, y } = this.context.getRelativePointerPosition()
      this.line = this.startLine(x, y, x, y)
      this.layering.overlay.add(this.line).draw()

      this.mode = 'line'
    } else if (this.mode === 'line') {
      const points = this.line!.points()
      points.push(...points.slice(-2))
      this.layering.overlay.batchDraw()
    }

    return true
  }

  onMouseDown(_: KonvaEventObject<MouseEvent>): boolean {
    if (this.line || this.mode === 'line') return false

    const { x, y } = this.context.getRelativePointerPosition()
    this.line = this.startLine(x, y)
    this.layering.overlay.add(this.line).draw()

    this.mode = 'free'

    return true
  }

  onMouseMove(_: KonvaEventObject<MouseEvent>): boolean {
    if (!this.line) return false

    const { x, y } = this.context.getRelativePointerPosition()
    const points = this.line.points()

    if (this.mode === 'free') {
      points.push(x, y)
    } else {
      points.splice(-2, 2, x, y)
    }
    this.layering.overlay.batchDraw()

    return true
  }

  onMouseUp(_: KonvaEventObject<MouseEvent>): boolean {
    if (!this.line || this.mode != 'free') return false

    this.endLine()

    return true
  }

  onKeyDown(event: KeyboardEvent): boolean {
    if (event.code === 'Escape' && this.mode === 'line') {
      this.endLine()
      return true
    } else if (event.code === 'KeyS') {
      this.smoothness = this.smoothness === 0 ? 50 : 0
      return true
    }
    return false
  }

  private startLine(...points: number[]): Konva.Line {
    return new Konva.Line({
      ...this.context.overlayProperties,
      globalCompositeOperation: 'source-over',
      points: points,
    })
  }

  private endLine(): void {
    const line = this.line!

    if (this.mode === 'line') {
      line.points().splice(-2, 2)
    }
    line.remove()
    this.layering.overlay.draw()

    this.executeCommand()

    this.line = undefined
    this.mode = 'none'
  }

  private executeCommand(): void {
    const line = this.line!
    if (line.points().length <= 2) return

    const extra: { [key: string]: unknown } = {}

    if (this.smoothness !== 0) {
      // smoothing using tension works nicely with line mode, but in free mode using high values of tension
      // gives unwanted results.
      if (this.mode === 'free') {
        const threshold = this.smoothness * THRESHOLD_TO_SMOOTHNESS_RATIO
        line.points(collapsePoints(line.points(), threshold))
        extra['bezier'] = true

        if (line.points().length < 8) {
          // bezier lines need at least 4 points, otherwise its an empty line
          return
        }
      } else {
        extra['tension'] = this.smoothness * TENSION_TO_SMOOTHNESS_RATION
      }
    }

    line.setAttrs({ ...this.context.properties, ...extra })
    const command = new DrawLineCommand(this.layering.currentLayer, line)
    this.context.executor.execute(command)
  }
}

const collapsePoints = (points: number[], threshold: number): number[] => {
  if (points.length <= 4) {
    return points
  }

  const ret = points.slice(0, 4)
  let [lastX, lastY] = [points[0], points[1]]

  for (let i = 2; i < points.length - 2; i += 2) {
    const [x, y] = [points[i], points[i + 1]]
    const distance = (x - lastX) ** 2 + (y - lastY) ** 2

    if (distance > threshold) {
      ret.push(x, y)
      lastX = x
      lastY = y
    }
  }

  ret.push(...points.slice(-2))
  return ret
}
