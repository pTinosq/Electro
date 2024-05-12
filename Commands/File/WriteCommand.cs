using System.Windows.Controls;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands.File
{
    public class WriteCommand() : Command("Write", "Description of the write command", ["write", "save", "w"], CommandCategory.FILE)
    {
        public override void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters)
        {
            if (viewModel.CurrentImage == null || viewModel.CurrentImagePath == null)
            {
                terminalOutput.Text += "No image loaded. Please load an image with the `load` command\n";
                return;
            }
            /*{System.Drawing.Bitmap} WORKS
    Flags: 2
    FrameDimensionsList: {System.Guid[1]}
    Height: 2560
    HorizontalResolution: 96
    Palette: {System.Drawing.Imaging.ColorPalette}
    PhysicalDimension: {Width = 1920 Height = 2560}
    PixelFormat: Format32bppArgb
    PropertyIdList: {int[0]}
    PropertyItems: {System.Drawing.Imaging.PropertyItem[0]}
    RawFormat: {MemoryBMP}
    Size: {Width = 1920 Height = 2560}
    Tag: null
    VerticalResolution: 96
    Width: 1920
viewModel.CurrentImage
{System.Drawing.Bitmap} BREAKS
    Flags: 77840
    FrameDimensionsList: {System.Guid[1]}
    Height: 2560
    HorizontalResolution: 96
    Palette: {System.Drawing.Imaging.ColorPalette}
    PhysicalDimension: {Width = 1920 Height = 2560}
    PixelFormat: Format24bppRgb
    PropertyIdList: {int[0]}
    PropertyItems: {System.Drawing.Imaging.PropertyItem[0]}
    RawFormat: {Jpeg}
    Size: {Width = 1920 Height = 2560}
    Tag: null
    VerticalResolution: 96
    Width: 1920*/
            bool success = FileService.WriteFile(viewModel.CurrentImage, viewModel.CurrentImagePath);
            if (success)
            {
                terminalOutput.Text += "Wrote to `" + viewModel.CurrentImagePath + "`\n";
            }
            else
            {
                terminalOutput.Text += "Error writing to `" + viewModel.CurrentImagePath + "`\n";
            }



            //// Show mini help message if no params given
            //if (parameters.Count == 0)
            //{
            //    terminalOutput.Text += "Copies the active image to a given directory. For more information run `help copy`\n";
            //    return;
            //}

            //if (viewModel.CurrentImagePath != null)
            //{
            //    string? newPath = FileService.CopyFile(viewModel.CurrentImagePath, parameters[0]);
            //    if (newPath != null)
            //    {
            //        terminalOutput.Text += "Copied file to " + newPath + " successfully\n";


            //        if (parameters.Count > 1)
            //        {
            //            // Handle switch flag (cp ./ex.jpg -s)
            //            if (parameters[1] == "-s")
            //            {
            //                viewModel.CurrentImagePath = newPath;
            //                viewModel.CurrentImage = FileService.OpenFile(newPath);
            //                terminalOutput.Text += "Switched active image to copied image\n";
            //            }
            //        }

            //    }
            //    else
            //    {
            //        terminalOutput.Text += "Failed to copy file to `" + parameters[0] + "`\n";
            //    }
            //}
            //else
            //{
            //    terminalOutput.Text += "No image active in current space. Please load an image to continue.\n";
            //}

        }
    }
}
