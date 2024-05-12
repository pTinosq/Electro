using System.Collections.Generic;
using System.Diagnostics;

namespace ElectroImageViewer.Commands
{
    public class CommandRegistry
    {
        private readonly Dictionary<string, Command> _commands = [];
        public static CommandRegistry Instance { get; } = new();

        private CommandRegistry()
        {
            // Register default commands within the private constructor
            Command[] cmds = [
                new RenameCommand(),
                new LoadCommand(),
                new ClearCommand(),
                new CopyCommand()
            ];

            foreach (Command c in cmds)
            {
                RegisterCommand(c);
            }
        }

        public void RegisterCommand(Command command)
        {
            _commands[command.Name.ToLower()] = command;
            if (command.Aliases != null)
            {
                foreach (var alias in command.Aliases)
                {
                    _commands[alias.ToLower()] = command;
                }
            }
        }

        public Command? GetCommand(string name)
        {
            _commands.TryGetValue(name.ToLower(), out var command);
            return command;
        }
    }
}
