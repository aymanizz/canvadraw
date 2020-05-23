import Tool from "../core/tool"
import { ZoomCommand } from "../commands"
import { KonvaEventObject } from "konva/types/Node"

export class ZoomTool extends Tool {
    private static scaleFactor = 1.2

    constructor() {
        super()
    }

    onMouseUp(event: KonvaEventObject<MouseEvent>) {
        if (event.evt.ctrlKey) {
            this.resetZoom()
        } else {
            this.zoom(event.evt.shiftKey ? -1 : 1)
        }
        return true
    }

    private zoom(delta: number) {
        const factor = delta > 0 ? ZoomTool.scaleFactor : 1 / ZoomTool.scaleFactor
        const command = ZoomCommand.relative(
            this.context.stage, factor,
            this.context.stage.getPointerPosition()!
        )
        this.context.executor.execute(command)
    }

    resetZoom() {
        this.context.executor.execute(ZoomCommand.reset(this.context.stage))
    }
}
