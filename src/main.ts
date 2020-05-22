import Konva from 'konva'
import DrawingController from './drawing_controller'
import { CommandExecutor } from './core/command'
import * as Tool from './tools'

export const stage = new Konva.Stage({
    container: 'canvas',
    width: window.innerWidth,
    height: window.innerHeight
})

const tools = {
    'pen': new Tool.PenTool(),
}

new DrawingController(stage, new CommandExecutor(), tools.pen)
