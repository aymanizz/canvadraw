import Konva from 'konva'
import Tool from './core/tool'
import { CommandExecutor } from './core/command'
import DrawingContext from './drawing_context'
import ShortcutsRegistry from './core/shortcut'

export default class DrawingController extends DrawingContext {
    readonly layers = [new Konva.Layer()]
    protected currentLayerIndex = 0
    private shortcuts = new ShortcutsRegistry()

    constructor(readonly stage: Konva.Stage, readonly executor: CommandExecutor, private tool: Tool) {
        super()
        this.stage.add(this.currentLayer)
        this.tool.activate(this)
        this.hookMouseEventsListeners()
        this.hookKeyEventsListeners()
        this.defineShortcuts()
    }

    private hookMouseEventsListeners() {
        this.stage.on('wheel', (ev) => this.tool.onMouseWheel(ev))
        this.stage.on('mouseup touchstart', (ev) => this.tool.onMouseUp(ev))
        this.stage.on('mousedown touchend', (ev) => this.tool.onMouseDown(ev))
        this.stage.on('mousemove touchmove', (ev) => this.tool.onMouseMove(ev))
    }

    private hookKeyEventsListeners() {
        window.addEventListener('keydown', (ev) => this.tool.onKeyDown(ev))
        window.addEventListener('keyup', (ev) => {
            if (this.shortcuts.get(ev)?.call(this, ev) === true)
                return true
            return this.tool.onKeyUp(ev)
        })
    }

    private defineShortcuts() {
        this.shortcuts.put('KeyZ', 'ctrl', () => {
            this.executor.undo()
            this.stage.draw()
            return true
        })
        this.shortcuts.put('KeyZ', 'ctrl+shift', () => {
            this.executor.redo()
            this.stage.draw()
            return true
        })
    }

    get currentLayer() { return this.layers[this.currentLayerIndex] }

    useTool(tool: Tool) {
        this.tool.deactivate()
        this.tool = tool
        this.tool.activate(this)
    }
}
