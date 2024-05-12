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

        private void Window_MouseWheel(object sender, MouseWheelEventArgs e)
        {
            UpdateViewBox((e.Delta > 0) ? 5 : -5);
            //if (electroImage.RenderTransform is TransformGroup transformGroup)
            //{
            //    ScaleTransform? scaleTransform = transformGroup.Children
            //        .OfType<ScaleTransform>().FirstOrDefault();

            //    if (scaleTransform != null)
            //    {
            //        // Calculate the scaling factor based on the Delta
            //        double scaleFactor = e.Delta > 0 ? 1.1 : 0.9;  // 10% increase or decrease

            //        // Apply the scaling factor
            //        scaleTransform.ScaleX *= scaleFactor;
            //        scaleTransform.ScaleY *= scaleFactor;

            //        // Optionally, clamp the scale values to prevent excessive zoom
            //        scaleTransform.ScaleX = Math.Max(0.01, Math.Min(250.0, scaleTransform.ScaleX));
            //        scaleTransform.ScaleY = Math.Max(0.01, Math.Min(250.0, scaleTransform.ScaleY));

            //        // Logging the current scale values
            //        Debug.WriteLine($"Adjusted ScaleX: {scaleTransform.ScaleX}, Adjusted ScaleY: {scaleTransform.ScaleY}");
            //    }
            //}
        }
        private void UpdateViewBox(int newValue)
        {
            //if ((ZoomViewbox.Width >= 0) && ZoomViewbox.Height >= 0)
            //{
            //    ZoomViewbox.Width += newValue;
            //    ZoomViewbox.Height += newValue;
            //}
        }
        private Point? _lastDragPoint;
        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            //if (e.ChangedButton == MouseButton.Left)
            //{
            //    _lastDragPoint = e.GetPosition(this);
            //    //electroImage.CaptureMouse();
            //}
        }

        private void Window_MouseUp(object sender, MouseButtonEventArgs e)
        {
            ////electroImage.ReleaseMouseCapture();
            //_lastDragPoint = null;

            //// Update the transform origin
            //if (electroImage?.RenderTransform is TransformGroup transformGroup)
            //{
            //    TranslateTransform? translateTransform = transformGroup.Children
            //        .OfType<TranslateTransform>().FirstOrDefault();



            //}
        }

        private void Window_MouseMove(object sender, MouseEventArgs e)
        {
            //if (e.LeftButton == MouseButtonState.Pressed && _lastDragPoint.HasValue)
            //{
            //    if (electroImage?.RenderTransform is TransformGroup transformGroup)
            //    {
            //        TranslateTransform? translateTransform = transformGroup.Children
            //            .OfType<TranslateTransform>().FirstOrDefault();
            //        ScaleTransform? scaleTransform = transformGroup.Children
            //            .OfType<ScaleTransform>().FirstOrDefault();

            //        if (translateTransform != null && scaleTransform != null)
            //        {
            //            var currentPoint = e.GetPosition(this); // Get position relative to the window
            //            var scaledDx = (currentPoint.X - _lastDragPoint.Value.X);
            //            var scaledDy = (currentPoint.Y - _lastDragPoint.Value.Y);

            //            translateTransform.X += scaledDx;
            //            translateTransform.Y += scaledDy;

            //            _lastDragPoint = currentPoint;
            //        }


            //        //electroImage.RenderTransformOrigin;
            //        double q = (translateTransform?.X ?? 1) / electroMain.ActualWidth;
            //        double w = (translateTransform?.Y ?? 1) / electroMain.ActualHeight;
            //        electroImage.RenderTransformOrigin = new Point(0.5 - q, 0.5 - w);
            //    }
            //}
        }
    }
}