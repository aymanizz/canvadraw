import Konva from "konva"
import { KonvaEventObject } from "konva/types/Node"
import Tool from "../core/tool"
import { DrawLineCommand } from "../commands"

export class PenTool extends Tool {
    private line?: Konva.Line

    // drawing mode flag.
    // in free drawing mode, points are added to the line as the user moves the mouse across the screen.
    // in line drawing mode, clicks determine the start and end the line, making straight lines.
    //     in this mode, the line contains an extra point. onMouseMove replaces this point to display the
    //     line following the user's mouse movement.
    private mode: 'free' | 'line' | 'none' = 'none'

    // whether the user has moved the mouse since last onMouseDown call.
    private get mouseHasMoved() {
        return this.mode !== 'free' && this.line && this.line.points().length !== 2
    }

    deactivate() {
        if (this.line)
            this.endLine()
        super.deactivate()
    }

    onMouseDown(_: KonvaEventObject<MouseEvent>) {
        if (this.line && this.mode !== 'line')
            return false

        if (this.mode === 'none') {
            const { x, y } = this.context.getRelativePointerPosition()
            this.line = new Konva.Line({
                ...this.context.overlayProperties,
                globalCompositeOperation: 'source-over',
                points: [x, y],
            })
            this.context.currentLayer.add(this.line).draw()

            this.mode = 'free'
        }

        return true
    }

    onMouseMove(_: KonvaEventObject<MouseEvent>) {
        if (!this.line)
            return false

        const { x, y } = this.context.getRelativePointerPosition()
        const points = this.line.points()

        if (this.mode === 'free') {
            points.push(x, y)
        } else {
            points.splice(-2, 2, x, y)
        }
        this.context.currentLayer.batchDraw()

        return true
    }

    onMouseUp(_: KonvaEventObject<MouseEvent>) {
        if (!this.line)
            return false

        const points = this.line.points()

        if (!this.mouseHasMoved) {
            this.mode = 'line'
        }

        if (this.mode === 'line') {
            points.push(...points.slice(-2))
        } else if (this.mode === 'free') {
            this.endLine()
        }

        return true
    }

    private endLine() {
        if (this.mode === 'line') {
            this.line!.points().splice(-2, 2)
        }
        const command = new DrawLineCommand(
            this.context.currentLayer,
            this.line!.setAttrs({ ...this.context.properties })
        )
        this.context.executor.execute(command)

        this.line = undefined
        this.mode = 'none'
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.mode === 'line') {
            this.endLine()
            return true
        }
        return false
    }
}
