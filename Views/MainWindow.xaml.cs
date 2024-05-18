using System.Diagnostics;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;

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

        private void Window_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.F1)
            {
                if (DataContext is MainViewModel viewModel)
                {
                    viewModel.TerminalVisibility = viewModel.TerminalVisibility == Visibility.Visible
                                                   ? Visibility.Collapsed
                                                   : Visibility.Visible;

                    // Optionally, focus the terminal input if the terminal is visible
                    if (viewModel.TerminalVisibility == Visibility.Visible)
                    {
                        terminalControl.terminalInput.Focus();
                    }
                }
            }
        }
    }
}
