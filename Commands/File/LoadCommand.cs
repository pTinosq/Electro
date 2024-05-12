using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Windows.Controls;
using System.Windows.Media.Imaging;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands.File
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

            // If running in interactive mode
            if (parameters[0] == "-i")
            {
                string? filePath = FileService.OpenFileDialog();
                if (!string.IsNullOrEmpty(filePath))
                {
                    viewModel.CurrentImagePath = filePath;
                    viewModel.CurrentImage = FileService.OpenFile(filePath);
                    terminalOutput.Text += "Loaded " + viewModel.CurrentImagePath + " to workspace\n";
                }
                else
                {
                    terminalOutput.Text += "No file loaded";
                }
            }
            else
            {
                // Attempt to load the image from the given directory
                Bitmap? img = FileService.OpenFile(parameters[0]);
                if (img != null)
                {
                    viewModel.CurrentImage = img;
                    viewModel.CurrentImagePath = parameters[0];
                    terminalOutput.Text += "Loaded " + viewModel.CurrentImagePath + " to workspace\n";
                }
                else
                {
                    terminalOutput.Text += "File not found: " + parameters[0] + "\n";
                }
            }
        }
    }
}
