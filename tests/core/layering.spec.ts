import Konva from 'konva'
import Layering from '../../src/core/layering'
import { expect } from 'chai'

describe('layering system', () => {
  let stage: Konva.Stage
  let subject: Layering

  beforeEach(() => {
    stage = new Konva.Stage({ container: 'container' })
    subject = new Layering(stage)
  })

  afterEach(() => stage.destroy())

  it('has one layer and an overlay layer when initialized', () => {
    expect(subject.length).to.be.equal(1)
    expect(stage.children.length).to.be.equal(2)
    expect(subject.overlay).to.be.equal(stage.children[1])
    expect(subject.currentLayer).to.be.instanceOf(Konva.Group)
  })

  it('adds and removes layers correctly', () => {
    const oldLayer = subject.currentLayer
    subject.addLayer()
    const newLayer = subject.currentLayer

    expect(subject.length).to.be.equal(2)
    expect(oldLayer.zIndex()).to.be.equal(0)
    expect(newLayer.zIndex()).to.be.equal(1)

    subject.removeLayer()

    expect(subject.length).to.be.equal(1)
    expect(oldLayer.zIndex()).to.be.equal(0)
  })

  it('adds layers on top of current layer', () => {
    const bottomLayer = subject.currentLayer
    subject.addLayer()
    const topLayer = subject.currentLayer
    subject.setCurrentLayer(0)
    subject.addLayer()
    const middleLayer = subject.currentLayer

    expect(bottomLayer.zIndex()).to.equal(0)
    expect(middleLayer.zIndex()).to.equal(1)
    expect(topLayer.zIndex()).to.equal(2)
  })

  it('selects the layer below if possible on removing the current layer', () => {
    const layer = subject.addLayer()
    subject.addLayer()
    subject.removeLayer()

    expect(subject.currentLayer.id()).to.be.equal(layer.id())
    expect(subject.currentIndex).to.be.equal(1)
  })

  it('selects the layer above on removing the bottom layer', () => {
    const layer = subject.addLayer()
    subject.setCurrentLayer(0)
    subject.removeLayer()

    expect(subject.currentLayer.id()).to.be.equal(layer.id())
    expect(subject.currentIndex).to.be.equal(0)
  })

  it('throws on removing the last layer', () => {
    expect(subject.removeLayer.bind(subject)).to.throw()
  })

  it('moves the current layer up correctly', () => {
    subject.addLayer()
    subject.addLayer()
    subject.setCurrentLayer(0)

    const currentLayer = subject.currentLayer
    expect(currentLayer.zIndex()).to.be.equal(0)

    subject.moveLayerUp()
    expect(subject.currentLayer.id()).to.be.equal(currentLayer.id())
    expect(subject.currentLayer.zIndex()).to.be.equal(1)

    subject.moveLayerUp()
    expect(subject.currentLayer.id()).to.be.equal(currentLayer.id())
    expect(subject.currentLayer.zIndex()).to.be.equal(2)

    expect(subject.moveLayerUp.bind(subject)).to.throw()
  })

  it('moves the current layer down correctly', () => {
    subject.addLayer()
    subject.addLayer()
    subject.setCurrentLayer(2)

    const currentLayer = subject.currentLayer
    expect(currentLayer.zIndex()).to.be.equal(2)

    subject.moveLayerDown()
    expect(subject.currentLayer.id()).to.be.equal(currentLayer.id())
    expect(subject.currentLayer.zIndex()).to.be.equal(1)

    subject.moveLayerDown()
    expect(subject.currentLayer.id()).to.be.equal(currentLayer.id())
    expect(subject.currentLayer.zIndex()).to.be.equal(0)

    expect(subject.moveLayerDown.bind(subject)).to.throw()
  })
})
