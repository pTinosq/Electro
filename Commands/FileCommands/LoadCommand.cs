using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands.FileCommands
{
    public class LoadCommand() : Command("Load", "Description of the load command", ["load"], CommandCategory.FILE)
    {

        public override void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters)
        {
            // Show mini help message if no params given
            if (parameters.Count == 0)
            {
                terminalOutput.Text += "Loads an image to the workspace. For more information run `help load`\n";
                return;
            }

            if (viewModel.ActiveBuffer == ElectroBuffers.ELECTROBUFFERSPACE)
            {
                terminalOutput.Text += "File operations cannot be performed in Electro Buffer Space (EBS).\n";
                terminalOutput.Text += "You must either `buf pop` to push your EBS to your workspace buffer or `buf switch` to temporarily switch to your workspace buffer\n";
                return;
            }

            // If running in interactive mode
            if (parameters[0] == "-i")
            {
                string? filePath = FileService.OpenFileDialog();
                if (!string.IsNullOrEmpty(filePath))
                {
                    viewModel.WorkspaceImagePath = filePath;
                    byte[] imageData = File.ReadAllBytes(filePath);
                    viewModel.WorkspaceBuffer = imageData;
                    terminalOutput.Text += "Loaded " + viewModel.WorkspaceImagePath + " to workspace\n";
                }
                else
                {
                    terminalOutput.Text += "No file loaded";
                }
            }
            else
            {
                // Attempt to load the image from the given directory
                try
                {
                    byte[] imageData = File.ReadAllBytes(parameters[0]);
                    viewModel.WorkspaceBuffer = imageData;
                    viewModel.WorkspaceImagePath = parameters[0];
                    terminalOutput.Text += "Loaded " + viewModel.WorkspaceImagePath + " to workspace\n";
                }
                catch (DirectoryNotFoundException)
                {
                    terminalOutput.Text += "File not found: " + parameters[0] + "\n";
                }
                catch (Exception ex)
                {
                    terminalOutput.Text += "[ERR]: " + ex.Message + "\n";
                }

            }
        }
    }
}
