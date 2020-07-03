import Konva from 'konva'
import DrawingController from './drawing_controller'
import { CommandExecutor } from './core/command'
import * as Tool from './tools'
import ShortcutsRegistry from './core/shortcut'

export const stage = new Konva.Stage({
  container: 'canvas',
  width: window.innerWidth,
  height: window.innerHeight,
})

const tools = [
    new Tool.PenTool(),
    new Tool.SelectTool(),
    new Tool.ZoomTool(),
]

let currentTool = 0

const controller = new DrawingController(stage, new CommandExecutor(), tools[currentTool])

// temporary solution for switching between tools
const globalShortcuts = new ShortcutsRegistry().put('KeyT', 'none', () => {
  currentTool = (currentTool + 1) % tools.length
  const tool = tools[currentTool]
  controller.useTool(tool)
  console.log(`using tool: ${Object.getPrototypeOf(tool).constructor.name}`)
})

window.addEventListener('keyup', (ev) => globalShortcuts.get(ev)?.call(undefined, ev))

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.controller = controller
