import Konva from "konva"
import { KonvaEventObject } from "konva/types/Node"
import Tool from "../core/tool"
import { DrawLineCommand } from "../commands"

export class PenTool extends Tool {
    private line?: Konva.Line

    deactivate() {
        this.endLine()
        super.deactivate()
    }

    onMouseDown(_: KonvaEventObject<MouseEvent>) {
        if (this.line)
            return false
        const { x, y } = this.context.getRelativePointerPosition()
        this.line = new Konva.Line({
            ...this.context.overlayProperties,
            globalCompositeOperation: 'source-over',
            points: [x, y],
        })
        this.context.currentLayer.add(this.line).draw()
        return true
    }

    onMouseMove(_: KonvaEventObject<MouseEvent>) {
        if (!this.line)
            return false
        const { x, y } = this.context.getRelativePointerPosition()
        this.line!.points().push(x, y)
        this.line!.draw()
        return true
    }

    onMouseUp(_: KonvaEventObject<MouseEvent>) {
        return this.endLine()
    }

    private endLine() {
        if (!this.line)
            return false
        const command = new DrawLineCommand(this.context.currentLayer, {
            ...this.line!.getAttrs(),
            ...this.context.properties,
        })
        this.line!.destroy()
        this.context.executor.execute(command)
        this.line = undefined
        return true
    }
}
