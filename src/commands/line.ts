import Command from "../core/command"
import Konva from "konva"

export class DrawLineCommand extends Command {
    line?: Konva.Line

    constructor(private layer: Konva.Layer, private lineConfig: Konva.LineConfig) {
        super()
    }

    protected execute(): void {
        const line = new Konva.Line(this.lineConfig)
        this.layer.add(line).draw()
        this.line = line
    }

    protected undo(): void {
        this.line?.destroy()
        this.layer.draw()
    }
}
