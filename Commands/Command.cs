using System;
using System.Collections.Generic;
using System.Windows.Controls;

namespace ElectroImageViewer.Commands
{
    public enum CommandCategory
    {
        EFFECT,
        FILE,
        SYSTEM,
        OTHER
    }

    public abstract class Command(string name, string description = "No description provided", List<string>? aliases = null, CommandCategory category = CommandCategory.OTHER)
    {
        public string Name { get; private set; } = name;
        public string Description { get; private set; } = description;
        public List<string> Aliases { get; private set; } = aliases ?? [];
        public CommandCategory Category { get; private set; } = category;

        public abstract void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters);

    }
}
