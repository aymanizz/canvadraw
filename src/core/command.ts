export default abstract class Command {
  protected abstract execute(): void
  protected abstract undo(): void
}

export class CommandExecutor {
  private _commands: Command[] = []
  private top = 0

  get history(): readonly Command[] {
    return this._commands
  }

  execute(command: Command, executed = false): void {
    if (!executed) {
      command['execute']()
    }
    this._commands[this.top++] = command
    this._commands.length = this.top
  }

  undo(): boolean {
    if (this.top === 0) {
      return false
    }
    const command = this._commands[--this.top]
    command['undo']()
    return true
  }

  redo(): boolean {
    if (this.top === this._commands.length) {
      return false
    }
    const command = this._commands[this.top++]
    command['execute']()
    return true
  }
}
