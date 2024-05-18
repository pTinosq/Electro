using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Controls;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands.SystemCommands
{
    public class CloseCommand() : Command("Close", "Description of the close command", ["close", "hide"], CommandCategory.SYSTEM)
    {
        public override void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters)
        {
            viewModel.TerminalVisibility = Visibility.Collapsed; // Or toggle based on current state
        }

    }
}
