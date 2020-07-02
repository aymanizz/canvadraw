import Command from '../core/command'
import { Stage } from 'konva/types/Stage'
import { Vector2d } from 'konva/types/types'

export class ZoomCommand extends Command {
  private oldScale = this.stage.scaleX()
  private oldOrigin = this.stage.getPosition()

  private constructor(private stage: Stage, private scale: number, private origin: Vector2d) {
    super()
  }

  static relative(stage: Stage, factor: number, position: Vector2d): ZoomCommand {
    const oldScale = stage.scaleX()
    const scale = oldScale * factor
    const oldPosition = stage.getPosition()
    const mousePointTo = {
      x: (position.x - oldPosition.x) / oldScale,
      y: (position.y - oldPosition.y) / oldScale,
    }
    const origin = {
      x: position.x - mousePointTo.x * scale,
      y: position.y - mousePointTo.y * scale,
    }

    return new ZoomCommand(stage, scale, origin)
  }

  static absolute(stage: Stage, scale: number, origin: Vector2d): ZoomCommand {
    return new ZoomCommand(stage, scale, origin)
  }

  static reset(stage: Stage): ZoomCommand {
    return ZoomCommand.absolute(stage, 1, { x: 0, y: 0 })
  }

  protected execute(): void {
    this.stage.scale({ x: this.scale, y: this.scale })
    this.stage.position(this.origin)
    this.stage.draw()
  }

  protected undo(): void {
    this.stage.scale({ x: this.oldScale, y: this.oldScale })
    this.stage.position(this.oldOrigin)
    this.stage.draw()
  }
}
