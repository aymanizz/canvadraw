import Konva from 'konva'
import DrawingController from './drawing_controller'
import * as Tool from './tools'
import ShortcutsRegistry from './core/shortcut'

export const stage = new Konva.Stage({
  container: 'canvas',
  width: window.innerWidth,
  height: window.innerHeight,
})

let currentTool = 0
const tools = [new Tool.PenTool(), new Tool.NavigateTool()]

const controller = new DrawingController(stage)
controller.useTool(tools[currentTool])

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
