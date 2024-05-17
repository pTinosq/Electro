using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Windows.Controls;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands.FileCommands
{
    public class CopyCommand() : Command("Copy", "Description of the copy command", ["copy", "cp"], CommandCategory.FILE)
    {
        public override void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters)
        {
            // Show mini help message if no params given
            if (parameters.Count == 0)
            {
                terminalOutput.Text += "Copies the active image to a given directory. For more information run `help copy`\n";
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
                string? newPath = FileService.CopyFile(viewModel.WorkspaceImagePath, parameters[0]);

                if (newPath != null)
                {
                    terminalOutput.Text += "Copied file to " + newPath + " successfully\n";


                    if (parameters.Count > 1)
                    {
                        // Handle switch flag (cp ./ex.jpg -s)
                        if (parameters[1] == "-s")
                        {
                            viewModel.WorkspaceImagePath = newPath;
                            viewModel.WorkspaceBuffer = File.ReadAllBytes(newPath);
                            terminalOutput.Text += "Switched active image to copied image\n";
                        }
                    }

                }
                else
                {
                    terminalOutput.Text += "Failed to copy file to `" + parameters[0] + "`\n";
                }
            }
            else
            {
                terminalOutput.Text += "No image active in current space. Please load an image to continue.\n";
            }

        }
    }
}
