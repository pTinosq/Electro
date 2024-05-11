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
        public static readonly DependencyProperty ImageSourceProperty = DependencyProperty.Register(
            "ImageSource",
            typeof(ImageSource),
            typeof(TerminalControl),
            new PropertyMetadata(default(ImageSource))
        );

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
                string command = terminalInput.Text;
                terminalOutput.Text += "> " + command + "\n";
                terminalInput.Text = "";

                if (command.ToLower() == "load")
                {
                    OpenFileDialog op = new OpenFileDialog
                    {
                        Title = "Select a picture",
                        Filter = "All supported graphics|*.jpg;*.jpeg;*.png|JPEG (*.jpg;*.jpeg)|*.jpg;*.jpeg|Portable Network Graphic (*.png)|*.png"
                    };
                    if (op.ShowDialog() == true)
                    {
                        ImageSource = new BitmapImage(new Uri(op.FileName)); // Sets the Dependency Property
                    }

                    terminalOutput.Text += "Loaded " + op.FileName;
                }

                if (command == "clear")
                {
                    terminalOutput.Text = "";
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
    }
}
