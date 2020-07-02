export default abstract class Command {
  protected abstract execute(): void
  protected abstract undo(): void
}

export class CommandExecutor {
  undo(): boolean {
    if (this.length === 0 || this.top === 0) return false
    const command = this.commands[--this.top]
    command['undo']()
    return true
  }

  redo(): boolean {
    if (this.length === 0 || this.top === this.length) return false
    const command = this.commands[this.top++]
    command['execute']()
    return true
  }

  execute(command: Command, executed = false): void {
    if (this.length === this.commands.length) throw new Error('history overflow!')
    if (!executed) command['execute']()
    this.commands[this.top++] = command
    ++this.length
  }

  private readonly commands: Command[] = Array(100)
  private length = 0
  private top = 0
}
