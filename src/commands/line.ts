import Command from "../core/command"
import Konva from "konva"

export class DrawLineCommand extends Command {
    constructor(private layer: Konva.Layer, private line: Konva.Line) {
        super()
    }

    protected execute(): void {
        this.layer.add(this.line).draw()
    }

    protected undo(): void {
        this.line.remove()
        this.layer.draw()
    }
}
