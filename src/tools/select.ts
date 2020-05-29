import Tool from '../core/tool'
import { KonvaEventObject } from 'konva/types/Node'
import { Shape } from 'konva/types/Shape'
import Konva from 'konva'
import DrawingContext from '../drawing_context'
import { TransformCommand, Transformation } from '../commands'

const snapAngles = Array.from({ length: 360 / 9 }, (_, index) => index * 9)

export class SelectTool extends Tool {
    private transformer = new Konva.Transformer()
    private isTransforming = false
    private targets = <Shape[]>[]
    private sources = <Shape[]>[]

    activate(context: DrawingContext) {
        super.activate(context)
        this.transformer.nodes([])
        this.transformer.draggable(true)
        this.context.currentLayer.add(this.transformer)
    }

    deactivate() {
        this.targets.forEach(t => t.destroy())
        this.targets = []
        this.sources = []
        this.transformer.remove()
        this.isTransforming = false
    }

    onMouseDown(event: KonvaEventObject<MouseEvent>) {
        this.isTransforming = Object.is(event.target.parent, this.transformer)
        if (this.isTransforming) {
            this.targets = this.sources.map(
                s => s.clone({
                    ...this.context.overlayProperties,
                    // keep the original stroke width
                    strokeWidth: this.context.properties.strokeWidth
                })
            )
            this.transformer.nodes(this.targets)
            this.context.currentLayer.add(...this.targets)
            this.context.currentLayer.draw()
        }
        return false
    }

    onMouseUp(event: KonvaEventObject<MouseEvent>) {
        if (Object.is(event.target, this.context.stage) && !this.isTransforming) {
            // user clicked on an empty space, remove selection if any.
            if (this.transformer.nodes() === [])
                return true
            this.transformer.nodes([])
            this.targets.forEach((t) => t.destroy())
            this.targets = []
            this.sources = []
            this.context.currentLayer.draw()
        } else if (this.isTransforming) {
            // transformation end, execute the recorded transformation.
            const transformations = this.sources.map((source, idx) => {
                const target = this.targets[idx]
                return computeTransformation(source, target)
            })
            this.context.executor.execute(new TransformCommand(transformations))

            this.targets.forEach((t) => t.destroy())
            this.targets = []
            this.transformer.nodes(this.sources)
            this.isTransforming = false

            this.context.stage.draw()
        } else {
            // user selected a shape
            const source = <Shape>event.target
            const index = this.sources.indexOf(source)
            if (index != -1 && !event.evt.ctrlKey)
                return true

            // remove from selection with ctrl
            // add to selection with shift
            if (index !== -1 && event.evt.ctrlKey) {
                this.sources.splice(index, 1)
            } else if (index === -1 && event.evt.shiftKey) {
                this.sources.push(source)
            } else {
                this.sources = [source]
            }

            this.transformer.nodes(this.sources)
            this.context.stage.draw()
        }
        return true
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.shiftKey) {
            this.transformer.rotationSnaps(snapAngles)
        }
        return false
    }

    onKeyUp(event: KeyboardEvent) {
        if (!event.shiftKey) {
            this.transformer.rotationSnaps([])
        }
        return false
    }
}

const computeTransformation = (source: Shape, target: Shape): Transformation => {
    return {
        target: source,
        translation: {
            x: target.x() - source.x(),
            y: target.y() - source.y(),
        },
        scale: {
            x: target.scaleX() / source.scaleX(),
            y: target.scaleY() / source.scaleY(),
        },
        rotation: target.rotation() - source.rotation()
    }
}
