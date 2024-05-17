using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Windows.Controls;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands.FileCommands
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

            if (viewModel.ActiveBuffer == ElectroBuffers.ELECTROBUFFERSPACE)
            {
                terminalOutput.Text += "File operations cannot be performed in Electro Buffer Space (EBS).\n";
                terminalOutput.Text += "You must either `buf pop` to push your EBS to your workspace buffer or `buf switch` to temporarily switch to your workspace buffer\n";
                return;
            }

            if (viewModel.WorkspaceImagePath != null)
            {
                string? newPath = FileService.RenameFile(viewModel.WorkspaceImagePath, parameters[0]);
                if (newPath != null)
                {
                    viewModel.WorkspaceImagePath = newPath;
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
