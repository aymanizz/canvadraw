/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { KonvaEventObject } from 'konva/types/Node'
import DrawingContext from '../drawing_context'

export default abstract class Tool {
  protected context!: DrawingContext

  activate(context: DrawingContext): void {
    this.context = context
  }

  deactivate(): void {}

  onMouseDown(event: KonvaEventObject<MouseEvent>): boolean {
    return false
  }

  onMouseUp(event: KonvaEventObject<MouseEvent>): boolean {
    return false
  }

  onMouseMove(event: KonvaEventObject<MouseEvent>): boolean {
    return false
  }

  onMouseWheel(event: KonvaEventObject<MouseWheelEvent>): boolean {
    return false
  }

  onKeyDown(event: KeyboardEvent): boolean {
    return false
  }

  onKeyUp(event: KeyboardEvent): boolean {
    return false
  }
}
