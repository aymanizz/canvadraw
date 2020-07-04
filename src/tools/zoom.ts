import Tool from '../core/tool'
import { NavigateCommand } from '../commands'
import { KonvaEventObject } from 'konva/types/Node'

export class ZoomTool extends Tool {
  private static scaleFactor = 1.2

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

  private zoom(delta: number): void {
    const factor = delta > 0 ? ZoomTool.scaleFactor : 1 / ZoomTool.scaleFactor
    this.context.executor.execute(
      NavigateCommand.relativeZoom(this.context.stage, factor, this.context.stage.getPointerPosition()!)
    )
  }

  private reset(): void {
    this.context.executor.execute(NavigateCommand.reset(this.context.stage))
  }
}
