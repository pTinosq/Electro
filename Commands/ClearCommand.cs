using System.Collections.Generic;
using System.Diagnostics;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands
{
    public class ClearCommand() : Command("Clear", "Description of the clear command", ["clear", "cls"], CommandCategory.SYSTEM)
    {

        public override void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters)
        {
            terminalOutput.Clear();
        }
    }
}
