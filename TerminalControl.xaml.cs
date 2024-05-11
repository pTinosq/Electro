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
    public partial class TerminalControl : UserControl
    {
        public TerminalControl()
        {
            InitializeComponent();
        }

        private void TerminalInput_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Key == Key.Enter)
            {
                terminalOutput.Text += "> New command output here...\n";

            }
        }
    }
}
