using Microsoft.Win32;
using System;
using System.Collections.Generic;
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
            if (e.Key == Key.Enter)
            {
                string? command = terminalInput.Text;
                terminalOutput.Text += "> " + command + "\n";
                terminalInput.Text = "";

                if (command.ToLower() == "load")
                {
                    OpenFile();
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
            }
        }
        private void TerminalOutput_Loaded(object sender, RoutedEventArgs e)
        {
            // Reset the terminal output and input
            terminalOutput.Text = "";
            terminalInput.Text = "";
        }

        private void OpenFile()
        {
            OpenFileDialog openFileDialog = new();
            if (openFileDialog.ShowDialog() == true)
            {
                if (DataContext is MainViewModel viewModel)
                {
                    viewModel.CurrentImagePath = openFileDialog.FileName;
                    viewModel.CurrentImage = new BitmapImage(new Uri(openFileDialog.FileName));
                }
            }
        }
    }
}
