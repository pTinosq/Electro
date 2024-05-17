using System.Collections.Generic;
using System.Windows.Controls;
using System.IO;
using ElectroImageViewer.Services;
using System;

namespace ElectroImageViewer.Commands.FileCommands
{
    public class WriteCommand : Command
    {
        public WriteCommand() : base("Write", "Description of the write command", ["write", "save", "w"], CommandCategory.FILE) { }

        public override void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters)
        {
            if (viewModel.WorkspaceImagePath == null)
            {
                terminalOutput.Text += "No image loaded. Please load an image with the `load` command\n";
                return;
            }

            if (viewModel.ActiveBuffer == ElectroBuffers.ELECTROBUFFERSPACE)
            {
                terminalOutput.Text += "File operations cannot be performed in Electro Buffer Space (EBS).\n";
                terminalOutput.Text += "You must either `buf pop` to push your EBS to your workspace buffer or `buf switch` to temporarily switch to your workspace buffer\n";
                return;
            }

            string targetPath = viewModel.WorkspaceImagePath;

            if (parameters.Count > 0)
            {
                string newPath = parameters[0];

                // If the path is relative, combine it with the directory of the workspace image path
                if (!Path.IsPathRooted(newPath))
                {
                    string workspaceDir = Path.GetDirectoryName(viewModel.WorkspaceImagePath);
                    targetPath = Path.Combine(workspaceDir, newPath);
                }
                else
                {
                    targetPath = newPath;
                }
            }

            try
            {
                File.WriteAllBytes(targetPath, viewModel.WorkspaceBuffer);
                terminalOutput.Text += "Wrote to `" + targetPath + "` using workspace buffer\n";
            }
            catch (Exception ex)
            {
                terminalOutput.Text += "[ERR]: " + ex.Message + "\n";
            }
        }
    }
}
