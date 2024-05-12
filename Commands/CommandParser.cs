using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ElectroImageViewer.Commands
{
    public class ParsedCommand(string command, List<string>? parameters)
    {
        public string Command { get; set; } = command;
        public List<string> Parameters { get; set; } = parameters ?? [];
    }

    public class CommandParser(string commandLine)
    {
        private readonly string _commandLine = commandLine;

        public List<ParsedCommand> Parse()
        {
            string commandLine = _commandLine;

            // Trim whitespace
            commandLine = commandLine.Trim();

            // Split by pipes
            List<string> commandsToExecute = commandLine.Split('|').ToList();

            List<ParsedCommand> parsedCommands = [];

            foreach (string c in commandsToExecute)
            {
                List<string> splitCommand = c.Trim().Split(' ').ToList();
                // The command is the first split item in the list
                string command = splitCommand[0];

                // Create and populate the parameters list
                List<string> parameters = [];
                if (splitCommand.Count > 1)
                {
                    for (int i = 1; i < splitCommand.Count; i++)
                    {
                        parameters.Add(splitCommand[i].Trim());
                    }
                }

                ParsedCommand parsedCmd = new(command, parameters);
                parsedCommands.Add(parsedCmd);
            }

            return parsedCommands;
        }
    }
}
