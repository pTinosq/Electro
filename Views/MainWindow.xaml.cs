using System.Diagnostics;
using System.Windows;
using System.Windows.Input;

namespace ElectroImageViewer
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Window_KeyDown(object sender, System.Windows.Input.KeyEventArgs e)
        {
            if (e.Key == Key.F1)
            {
                // Toggle the visibility of the TerminalControl
                terminalControl.ControlVisibility = terminalControl.ControlVisibility == Visibility.Visible
                                                    ? Visibility.Collapsed
                                                    : Visibility.Visible;
                terminalControl.terminalInput.Focus();
            }
        }
    }
}