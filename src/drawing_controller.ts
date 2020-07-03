import Konva from 'konva'
import Tool from './core/tool'
import { CommandExecutor } from './core/command'
import DrawingContext from './drawing_context'
import ShortcutsRegistry from './core/shortcut'
import { KonvaEventObject } from 'konva/types/Node'

export default class DrawingController extends DrawingContext {
  readonly layers = [new Konva.Layer()]
  protected currentLayerIndex = 0

  private shortcuts = new ShortcutsRegistry()

  private mouseDownEvent?: KonvaEventObject<MouseEvent>
  private mouseHasMoved = false

  constructor(readonly stage: Konva.Stage, readonly executor: CommandExecutor, private tool: Tool) {
    super()
    this.stage.add(this.currentLayer)
    this.hookMouseEventsListeners()
    this.hookKeyEventsListeners()
    this.defineShortcuts()
    this.tool.activate(this)
  }

  private hookMouseEventsListeners(): void {
    this.stage.on('wheel', (ev) => this.tool.onMouseWheel(ev))
    this.stage.on('mousedown touchstart', (ev) => this.onMouseDown(ev))
    this.stage.on('mousemove touchmove', (ev) => this.onMouseMove(ev))
    this.stage.on('mouseup touchend', (ev) => this.onMouseUp(ev))
    this.stage.on('click tap', (ev) => this.onMouseClick(ev))
  }

  private hookKeyEventsListeners(): void {
    window.addEventListener('keydown', (ev) => this.tool.onKeyDown(ev))
    window.addEventListener('keyup', (ev) => {
      if (this.shortcuts.get(ev)?.call(this, ev) === true) return true
      return this.tool.onKeyUp(ev)
    })
  }

  private defineShortcuts(): void {
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

  get currentLayer(): Konva.Layer {
    return this.layers[this.currentLayerIndex]
  }

  useTool(tool: Tool): void {
    this.tool.deactivate()
    this.tool = tool
    this.tool.activate(this)
  }

  private onMouseDown(event: KonvaEventObject<MouseEvent>): void {
    this.mouseDownEvent = event
    this.mouseHasMoved = false
  }

  private onMouseMove(event: KonvaEventObject<MouseEvent>): void {
    if (this.mouseDownEvent !== undefined && !this.mouseHasMoved) {
      this.mouseHasMoved = true
      this.tool.onMouseDown(this.mouseDownEvent!)
    }
    this.tool.onMouseMove(event)
  }

  private onMouseUp(event: KonvaEventObject<MouseEvent>): void {
    if (this.mouseHasMoved) {
      this.tool.onMouseUp(event)
    }
  }

  private onMouseClick(event: KonvaEventObject<MouseEvent>): void {
    if (!this.mouseHasMoved) {
      this.tool.onMouseClick(event)
    }
    this.mouseHasMoved = false
    this.mouseDownEvent = undefined
  }
}
