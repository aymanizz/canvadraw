import Konva from "konva"
import { CommandExecutor } from "./core/command"

export default abstract class DrawingContext {
    readonly layers: Konva.Layer[]
    readonly currentLayerIndex = 0

    readonly properties = {
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: 2,
        hitStrokeWidth: 5,
    }

    constructor(readonly stage: Konva.Stage, readonly executor: CommandExecutor) {
        const layers = stage.getLayers().toArray() as Konva.Layer[]
        if (layers.length !== 0)
            this.layers = layers
        else
            this.layers = [new Konva.Layer()]
    }

    get currentLayer() { return this.layers[this.currentLayerIndex] }

    pushLayer(layer: Konva.Layer) {
        this.layers.push(layer)
    }

    popLayer(index: number) {
        return this.layers.splice(index, 1)
    }

    get pointerPosition() {
        const position = this.stage.position()
        const pointer = this.stage.getPointerPosition()!
        const scale = this.stage.scaleX()
        const mousePointTo = {
            x: (pointer.x - position.x) / scale,
            y: (pointer.y - position.y) / scale
        }
        return mousePointTo
    }
}
