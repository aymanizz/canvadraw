import { KonvaEventObject } from "konva/types/Node"
import DrawingContext from "../drawing_context"

export default abstract class Tool {
    protected context!: DrawingContext

    activate(context: DrawingContext) {
        this.context = context
    }

    deactivate() { }

    onMouseDown(_event: KonvaEventObject<MouseEvent>) { return false }

    onMouseUp(_event: KonvaEventObject<MouseEvent>) { return false }

    onMouseMove(_event: KonvaEventObject<MouseEvent>) { return false }

    onMouseWheel(_event: KonvaEventObject<MouseWheelEvent>) { return false }

    onKeyDown(_event: KeyboardEvent) { return false }

    onKeyUp(_event: KeyboardEvent) { return false }
}
