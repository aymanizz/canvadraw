import Tool from '../core/tool'
import { NavigateCommand } from '../commands'
import { KonvaEventObject } from 'konva/types/Node'
import { Vector2d } from 'konva/types/types'

export class NavigateTool extends Tool {
  private static scaleFactor = 1.2

  // pan tracking data
  private isPanning = false
  private panOrigin?: Vector2d
  private oldPos?: Vector2d

  constructor() {
    super()
  }

  onMouseClick(event: KonvaEventObject<MouseEvent>): boolean {
    if (event.evt.ctrlKey) {
      this.reset()
    } else {
      this.zoom(event.evt.shiftKey ? -1 : 1)
    }
    return true
  }

  onMouseMove(_: KonvaEventObject<MouseEvent>): boolean {
    if (!this.isPanning) return false

    const { x, y } = this.context.getRelativePointerPosition()
    const change = { x: x - this.panOrigin!.x, y: y - this.panOrigin!.y }

    this.context.stage.move(change)
    this.context.stage.batchDraw()

    return true
  }

  onKeyDown(event: KeyboardEvent): boolean {
    if (event.code === 'Space' && !this.isPanning) {
      this.isPanning = true
      this.panOrigin = this.context.getRelativePointerPosition()
      this.oldPos = this.context.stage.position()

      return true
    }

    return false
  }

  onKeyUp(event: KeyboardEvent): boolean {
    if (event.code === 'Space' && this.isPanning) {
      this.isPanning = false

      const oldPos = this.oldPos!
      const newPos = this.context.stage.position()

      this.context.executor.execute(NavigateCommand.pan(this.context.stage, oldPos, newPos), false)

      return true
    }

    return false
  }

  private zoom(delta: number): void {
    const factor = delta > 0 ? NavigateTool.scaleFactor : 1 / NavigateTool.scaleFactor
    this.context.executor.execute(
      NavigateCommand.relativeZoom(this.context.stage, factor, this.context.stage.getPointerPosition()!)
    )
  }

  private reset(): void {
    this.context.executor.execute(NavigateCommand.reset(this.context.stage))
  }
}
