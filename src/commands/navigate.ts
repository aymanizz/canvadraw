import Command from '../core/command'
import { Stage } from 'konva/types/Stage'
import { Vector2d } from 'konva/types/types'

export class NavigateCommand extends Command {
  private constructor(
    private stage: Stage,
    private newScale: number,
    private newOrigin: Vector2d,
    private oldScale: number = stage.scaleX(),
    private oldOrigin: Vector2d = stage.getPosition()
  ) {
    super()
  }

  static pan(stage: Stage, oldOrigin: Vector2d, newOrigin: Vector2d): NavigateCommand {
    return new NavigateCommand(stage, stage.scaleX(), newOrigin, stage.scaleX(), oldOrigin)
  }

  static relativeZoom(stage: Stage, factor: number, position: Vector2d): NavigateCommand {
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

    return new NavigateCommand(stage, scale, origin)
  }

  static absoluteZoom(stage: Stage, scale: number, origin: Vector2d): NavigateCommand {
    return new NavigateCommand(stage, scale, origin)
  }

  static reset(stage: Stage): NavigateCommand {
    return NavigateCommand.absoluteZoom(stage, 1, { x: 0, y: 0 })
  }

  protected execute(): void {
    this.stage.scale({ x: this.newScale, y: this.newScale })
    this.stage.position(this.newOrigin)
    this.stage.draw()
  }

  protected undo(): void {
    this.stage.scale({ x: this.oldScale, y: this.oldScale })
    this.stage.position(this.oldOrigin)
    this.stage.draw()
  }
}
