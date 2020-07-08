import Konva from 'konva'

export default class Layering {
  private _currentIndex = 0
  private container = new Konva.Layer()
  readonly overlay = new Konva.Layer()

  constructor(stage: Konva.Stage) {
    stage.add(this.container)
    stage.add(this.overlay)
    this.container.add(new Konva.Group())
  }

  get length(): number {
    return this.layers.length
  }

  get currentIndex(): number {
    return this._currentIndex
  }

  private get layers(): Konva.Collection<Konva.Group> {
    return (this.container.getChildren() as unknown) as Konva.Collection<Konva.Group>
  }

  get currentLayer(): Konva.Group {
    return this.layers[this._currentIndex] as Konva.Group
  }

  setCurrentLayer(index: number): Konva.Group {
    if (index < 0 || index >= this.container.children.length) {
      throw Error('index out of bound')
    }
    this._currentIndex = index
    return this.currentLayer
  }

  addLayer(): Konva.Group {
    const targetIndex = this._currentIndex + 1
    const layer = new Konva.Group()
    this.container.add(layer)

    while (layer.index > targetIndex) {
      layer.moveDown()
    }

    this.setCurrentLayer(targetIndex)

    return layer
  }

  removeLayer(): void {
    if (this.length <= 1) {
      throw Error('cannot remove the last layer')
    }

    this.layers[this._currentIndex].remove()
    this._currentIndex = Math.max(0, this._currentIndex - 1)
  }

  moveLayerUp(): void {
    if (this._currentIndex === this.length - 1) {
      throw Error('cannot move the top layer up')
    }

    this.currentLayer.moveUp()
    this._currentIndex += 1
  }

  moveLayerDown(): void {
    if (this._currentIndex === 0) {
      throw Error('cannot move the bottom layer down')
    }

    this.currentLayer.moveDown()
    this._currentIndex -= 1
  }

  clearOverlay(): void {
    this.overlay.removeChildren()
    this.overlay.clear()
  }
}
