using System.Collections.Generic;
using System.Diagnostics;
using System.Windows.Controls;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands.File
{
    public class RenameCommand() : Command("Rename", "desci", ["rename"], CommandCategory.FILE)
    {
        public override void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters)
        {
            // Show mini help message if no params given
            if (parameters.Count == 0)
            {
                terminalOutput.Text += "Renames the active image. For more information run `help rename`\n";
                return;
            }

            if (viewModel.CurrentImagePath != null)
            {
                string? newPath = FileService.RenameFile(viewModel.CurrentImagePath, parameters[0]);
                if (newPath != null)
                {
                    viewModel.CurrentImagePath = newPath;
                    viewModel.CurrentImage = FileService.OpenFile(newPath);
                    terminalOutput.Text += "Renamed file successfully. New path: " + newPath + "\n";
                }
                else
                {
                    terminalOutput.Text += "Failed to rename active file to `" + parameters[0] + "`\n";
                }
            }
            else
            {
                terminalOutput.Text += "No image active in current space. Please load an image to continue.\n";
            }

        }
    }
}
