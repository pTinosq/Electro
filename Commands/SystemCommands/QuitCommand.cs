using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Controls;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands.SystemCommands
{
    public class QuitCommand() : Command("Quit", "Description of the quit command", ["quit", "exit"], CommandCategory.SYSTEM)
    {
        public override void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters)
        {
            // Quits the app
            Environment.Exit(0);
        }

    }
}
