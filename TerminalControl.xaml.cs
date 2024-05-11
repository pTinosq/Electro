using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Packaging;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Path = System.IO.Path;

namespace ElectroImageViewer
{
    /// <summary>
    /// Interaction logic for TerminalControl.xaml
    /// </summary>
    /// 

    public partial class TerminalControl : UserControl
    {
        public static readonly DependencyProperty? ImageSourceProperty = DependencyProperty.Register(
            "ImageSource",
            typeof(ImageSource),
            typeof(TerminalControl),
            new PropertyMetadata(default(ImageSource))
        );

        public static readonly DependencyProperty? ControlVisibilityProperty = DependencyProperty.Register(
        "ControlVisibility",
        typeof(Visibility),
        typeof(TerminalControl),
        new PropertyMetadata(Visibility.Visible));

        public Visibility ControlVisibility
        {
            get { return (Visibility)GetValue(ControlVisibilityProperty); }
            set { SetValue(ControlVisibilityProperty, value); }
        }


        public ImageSource ImageSource
        {
            get { return (ImageSource)GetValue(ImageSourceProperty); }
            set { SetValue(ImageSourceProperty, value); }
        }

        public TerminalControl()
        {
            InitializeComponent();
        }

        private void TerminalInput_KeyDown(object sender, KeyEventArgs e)
        {
            if (DataContext is MainViewModel viewModel)
            {
                if (e.Key == Key.Enter)
                {
                    string? command = terminalInput.Text;
                    terminalOutput.Text += "> " + command + "\n";
                    terminalInput.Text = "";



                    if (command.ToLower() == "load")
                    {
                        OpenFileDialog();
                        terminalOutput.Text += "Loaded";
                    }

                    if (command == "clear")
                    {
                        // Clear the terminal output
                        terminalOutput.Text = "";
                    }

                    if (command == "close")
                    {
                        // Hide the terminal
                        //this.Visibility = Visibility.Collapsed;
                        this.ControlVisibility = Visibility.Collapsed;
                    }

                    if (command == "exit")
                    {
                        // Close the app
                        Application.Current.Shutdown();
                    }

                    if (command.StartsWith("rename "))
                    {
                        // Rename the loaded file
                        RenameFile(command);
                    }

                    if (command.StartsWith("cp ") || command.StartsWith("copy "))
                    {
                        // Rename the loaded file
                        CopyFile(command);
                    }


                    viewModel.CmdHistory.AddCommand(command);
                }
                if (e.Key == Key.Down)
                {
                    viewModel.CmdHistory.IncrementIndex();
                    terminalInput.Text = viewModel.CmdHistory.GetCommand();
                }
                else if (e.Key == Key.Up)
                {
                    viewModel.CmdHistory.DecrementIndex();
                    terminalInput.Text = viewModel.CmdHistory.GetCommand();
                }


            }

        }
        private void TerminalOutput_Loaded(object sender, RoutedEventArgs e)
        {
            // Reset the terminal output and input
            terminalOutput.Text = "";
            terminalInput.Text = "";
        }

        private void OpenFile(string filePath)
        {
            BitmapImage bi = new();
            // Load the image with a FileStream to avoid file locking
            using (FileStream stream = File.OpenRead(filePath))
            {
                bi.BeginInit();
                bi.CacheOption = BitmapCacheOption.OnLoad;
                bi.StreamSource = stream;
                bi.EndInit();
            }
            bi.Freeze();

            if (DataContext is MainViewModel viewModel)
            {
                viewModel.CurrentImagePath = filePath;
                viewModel.CurrentImage = bi;
            }

        }

        private void OpenFileDialog()
        {
            OpenFileDialog openFileDialog = new();
            if (openFileDialog.ShowDialog() == true)
            {
                OpenFile(openFileDialog.FileName);
            }
        }

        private void RenameFile(string command)
        {
            if (DataContext is MainViewModel viewModel && viewModel.CurrentImagePath != null)
            {
                string newName = command[7..]; // Get the name after "rename "
                string oldPath = viewModel.CurrentImagePath;
                string directory = Path.GetDirectoryName(oldPath) ?? "./";
                string newPath = Path.Combine(directory, newName);

                try
                {
                    viewModel.CurrentImage = null; // Unset the current image to release the file lock
                    File.Move(oldPath, newPath);
                    OpenFile(newPath);
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Failed to rename file: " + ex.Message);
                }
            }
        }

        private void CopyFile(string command)
        {
            if (DataContext is MainViewModel viewModel && viewModel.CurrentImagePath != null)
            {
                string targetPath = command[5..];
                string sourcePath = viewModel.CurrentImagePath;

                // Resolve the full path of the target based on the source directory
                string directory = Path.GetDirectoryName(sourcePath) ?? "./";
                string fullPath = Path.GetFullPath(Path.Combine(directory, targetPath));

                try
                {
                    // Copy the file to the new location
                    File.Copy(sourcePath, fullPath, overwrite: true);

                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Failed to copy file: " + ex.Message);
                }
            }
        }
    }
}
