export type KeyboardEventHandler<T> = (event: KeyboardEvent) => T

export type Modifier = 'none' | 'ctrl' | 'shift' | 'alt' | 'ctrl+shift' | 'shift+alt' | 'ctrl+alt' | 'ctr+shift+alt'

const modifierOf = (event: KeyboardEvent): Modifier => {
  const modifiers = []
  if (event.ctrlKey) modifiers.push('ctrl')
  if (event.shiftKey) modifiers.push('shift')
  if (event.altKey) modifiers.push('alt')
  return (modifiers.join('+') as Modifier) || 'none'
}

export default class ShortcutsRegistry<T> {
  private shortcuts: Map<string, Map<Modifier, KeyboardEventHandler<T>>> = new Map()

  // for a list of valid codes see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values
  put(code: string, modifier: Modifier, handler: KeyboardEventHandler<T>): ShortcutsRegistry<T> {
    const map = this.shortcuts.get(code) || new Map()
    map.set(modifier, handler)
    this.shortcuts.set(code, map)
    return this
  }

  get(event: KeyboardEvent): KeyboardEventHandler<T> | null {
    const handlers = this.shortcuts.get(event.code)
    if (!handlers) return null
    const handler = handlers.get(modifierOf(event))
    if (!handler) return null
    return handler
  }
}
