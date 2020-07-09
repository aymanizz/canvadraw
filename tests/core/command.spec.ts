import Command, { CommandExecutor } from '../../src/core/command'
import { expect } from 'chai'

type CommandCall = 'execute' | 'undo'

class StubCommand extends Command {
  calls: CommandCall[] = []

  protected execute(): void {
    this.calls.push('execute')
  }

  protected undo(): void {
    this.calls.push('undo')
  }
}

const expectCallSequence = (command: StubCommand, sequence: CommandCall[]) => {
  expect(command.calls).to.have.ordered.members(sequence)
}

describe('command executor', () => {
  let subject: CommandExecutor
  let command: StubCommand

  beforeEach(() => {
    subject = new CommandExecutor()
    command = new StubCommand()
  })

  it('executes command', () => {
    subject.execute(command)
    expectCallSequence(command, ['execute'])
  })

  it('does not execute an executed command', () => {
    subject.execute(command, true)
    expectCallSequence(command, [])
  })

  it('undoes and redoes single command', () => {
    subject.execute(command)
    subject.undo()
    subject.redo()

    expectCallSequence(command, ['execute', 'undo', 'execute'])
  })

  it('undoes and redoes multiple commands', () => {
    const anotherCommand = new StubCommand()
    subject.execute(command)
    subject.execute(anotherCommand)

    subject.undo()
    subject.redo()
    expectCallSequence(anotherCommand, ['execute', 'undo', 'execute'])

    subject.undo()
    subject.undo()
    expectCallSequence(anotherCommand, ['execute', 'undo', 'execute', 'undo'])
    expectCallSequence(command, ['execute', 'undo'])
  })

  it('ignores undo/redo if there is no command to undo/redo', () => {
    subject.execute(command)
    subject.redo()
    expectCallSequence(command, ['execute'])

    subject.undo()
    subject.undo()
    expectCallSequence(command, ['execute', 'undo'])
  })

  it('forgets previous commands when a command is executed after undoing a command', () => {
    const command2 = new StubCommand()
    const command3 = new StubCommand()
    subject.execute(command)
    subject.execute(command2)

    subject.undo()
    subject.execute(command3)

    expectCallSequence(command, ['execute'])
    expectCallSequence(command2, ['execute', 'undo'])
    expectCallSequence(command3, ['execute'])
  })
})
