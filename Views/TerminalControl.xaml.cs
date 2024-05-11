using ElectroImageViewer.Services;
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
                    string command = terminalInput.Text;
                    terminalOutput.Text += "> " + command + "\n";
                    terminalInput.Text = "";
                    ExecuteCommand(command, viewModel);
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

        private void ExecuteCommand(string command, MainViewModel viewModel)
        {
            switch (command.Split(' ')[0].ToLower())
            {
                case "load":
                    string? filePath = FileService.OpenFileDialog();
                    if (!string.IsNullOrEmpty(filePath))
                    {
                        viewModel.CurrentImagePath = filePath;
                        viewModel.CurrentImage = FileService.OpenFile(filePath);
                        terminalOutput.Text += "Loaded " + viewModel.CurrentImagePath;
                    } else
                    {
                        terminalOutput.Text += "No file loaded";
                    }
                    break;
                case "rename":
                    if (viewModel.CurrentImagePath == null) break;
                    if (FileService.RenameFile(viewModel.CurrentImagePath, command[7..]))
                    {
                        terminalOutput.Text += "Renamed successfully.";
                    }
                    break;
                case "copy":
                    if (viewModel.CurrentImagePath == null) break;
                    string destPath = command[5..];
                    if (FileService.CopyFile(viewModel.CurrentImagePath, destPath))
                    {
                        terminalOutput.Text += "Copied successfully.";
                    }
                    break;
                case "exit":
                    Application.Current.Shutdown();
                    break;

                case "clear":
                    terminalOutput.Text = "";
                    break;

                default:
                    terminalOutput.Text += "Command not recognized.";
                    break;
            }
            
            terminalOutput.Text += "\n";
            viewModel.CmdHistory.AddCommand(command);
        }
    }
}
