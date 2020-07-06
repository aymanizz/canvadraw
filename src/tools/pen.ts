import Konva from 'konva'
import { KonvaEventObject } from 'konva/types/Node'
import Tool from '../core/tool'
import { DrawLineCommand } from '../commands'
import DrawingContext from '../drawing_context'
import Layering from '../core/layering'

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
      this.line = new Konva.Line({
        ...this.context.overlayProperties,
        globalCompositeOperation: 'source-over',
        points: [x, y, x, y],
      })
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
    this.line = new Konva.Line({
      ...this.context.overlayProperties,
      globalCompositeOperation: 'source-over',
      points: [x, y],
    })
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

  private endLine(): void {
    const line = this.line!
    if (this.mode === 'line') {
      line.points().splice(-2, 2)
    }

    line.remove()
    this.layering.overlay.draw()

    if (line.points().length > 2) {
      line.setAttrs({ ...this.context.properties })
      const command = new DrawLineCommand(this.layering.currentLayer, line)
      this.context.executor.execute(command)
    }

    this.line = undefined
    this.mode = 'none'
  }

  onKeyDown(event: KeyboardEvent): boolean {
    if (event.key === 'Escape' && this.mode === 'line') {
      this.endLine()
      return true
    }
    return false
  }
}
