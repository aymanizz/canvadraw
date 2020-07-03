import Command from '../core/command'
import { Vector2d } from 'konva/types/types'
import { Shape } from 'konva/types/Shape'

export type Transformation = {
    target: Shape,
    translation: Vector2d,
    scale: Vector2d,
    rotation: number,
}

export class TransformCommand extends Command {
    constructor(private transformations: Transformation[]) {
        super()
    }

    protected execute(): void {
        for (const { target, translation, scale, rotation } of this.transformations) {
            target.setAttrs({
                x: target.x() + translation.x,
                y: target.y() + translation.y,
                scaleX: target.scaleX() * scale.x,
                scaleY: target.scaleY() * scale.y,
                rotation: target.rotation() + rotation
            })
        }
    }

    protected undo(): void {
        for (const { target, translation, scale, rotation } of this.transformations) {
            target.setAttrs({
                x: target.x() - translation.x,
                y: target.y() - translation.y,
                scaleX: target.scaleX() / scale.x,
                scaleY: target.scaleY() / scale.y,
                rotation: target.rotation() - rotation
            })
        }
    }
}
