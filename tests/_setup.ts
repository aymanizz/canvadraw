import { JSDOM } from 'jsdom'

const { window } = new JSDOM(`
  <div id="container"></div>
`)

global.window = (window as unknown) as Window & typeof globalThis
global.document = window.document
