import Konva from "konva"
import { CommandExecutor } from "./core/command"

export default abstract class DrawingContext {
    abstract readonly stage: Konva.Stage
    abstract readonly executor: CommandExecutor
    abstract readonly layers: Konva.Layer[]
    abstract readonly currentLayer: Konva.Layer

    readonly properties = {
        fill: '#000000',
        stroke: '#000000',
        strokeWidth: 2,
        hitStrokeWidth: 5,
        opacity: 1,
    }

    readonly overlayProperties = {
        ...this.properties,
        fill: "#24323A",
        stroke: '#4A8EC2',
        strokeWidth: 1,
        opacity: 0.4,
    }

    getRelativePointerPosition() {
        const position = this.stage.position()
        const pointer = this.stage.getPointerPosition()!
        const scale = this.stage.scaleX()
        const relativePosition = {
            x: (pointer.x - position.x) / scale,
            y: (pointer.y - position.y) / scale
        }
        return relativePosition
    }
}
