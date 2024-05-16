using ElectroImageViewer.Commands;
using System.Collections.Generic;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

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

                    string inputText = terminalInput.Text.Trim();
                    terminalOutput.Text += "> " + inputText + "\n";

                    if (string.IsNullOrEmpty(inputText))
                    {
                        terminalInput.Text = "";
                        return;
                    }


                    CommandParser commandParser = new(inputText);
                    List<ParsedCommand> parsedCommands = commandParser.Parse();
                    foreach (ParsedCommand parsedCommand in parsedCommands)
                    {
                        // Find the Command to execute based on the parsedCommand.Command
                        Command? execCmd = CommandRegistry.Instance.GetCommand(parsedCommand.Command);

                        if (execCmd != null)
                        {
                            execCmd.Execute(viewModel, terminalOutput, parsedCommand.Parameters);
                        }
                        else
                        {
                            terminalOutput.Text += "Command `" + parsedCommand.Command + "` not found.\n";
                        }
                    }


                    // Flush terminal input text box and add to history
                    terminalInput.Text = "";
                    viewModel.CmdHistory.AddCommand(inputText);
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

        //private void ExecuteCommand(string commandLine, MainViewModel viewModel)
        //{
        //    if (commandLine != null && commandLine != "")
        //    {
        //        var parts = commandLine.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
        //        var command = _commandFactory.GetCommand(parts[0]);
        //        if (command != null)
        //        {
        //            command.Execute(viewModel, parts.Length > 1 ? parts[1].Split(' ') : []);
        //        }
        //        else
        //        {
        //            terminalOutput.Text += "Command not recognized\n";
        //        }
        //    }
        //}
    }
}
