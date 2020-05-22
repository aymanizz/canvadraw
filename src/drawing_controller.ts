import Konva from 'konva'
import Tool from './core/tool'
import { CommandExecutor } from './core/command'
import DrawingContext from './drawing_context'

export default class DrawingController extends DrawingContext {
    readonly layers = [new Konva.Layer()]
    readonly currentLayerIndex = 0

    constructor(stage: Konva.Stage, executor: CommandExecutor, private tool: Tool) {
        super(stage, executor)
        this.stage.add(this.currentLayer)
        this.hookMouseEventsListeners()
        this.hookKeyEventsListeners()
    }

    private hookMouseEventsListeners() {
        this.stage.on('wheel', (ev) => this.tool.onMouseWheel(ev))
        this.stage.on('mouseup touchstart', (ev) => this.tool.onMouseUp(ev))
        this.stage.on('mousedown touchend ', (ev) => this.tool.onMouseDown(ev))
        this.stage.on('mousemove touchmove', (ev) => this.tool.onMouseMove(ev))
    }

    private hookKeyEventsListeners() {
        window.addEventListener('keydown', (ev) => this.tool.onKeyDown(ev))
        window.addEventListener('keyup', (ev) => this.tool.onKeyUp(ev))
    }

    useTool(tool: Tool) {
        this.tool.deactivate()
        this.tool = tool
        this.tool.activate(this)
    }
}
