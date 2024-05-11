using System;
using System.Windows.Media.Imaging;
using System.ComponentModel;

namespace ElectroImageViewer
{
    public class MainViewModel : INotifyPropertyChanged

    {
        // Image data
        private BitmapImage? _currentImage;
        private string? _currentImagePath;

        // Terminal data
        private CommandHistory _cmdHistory = new();

        public BitmapImage? CurrentImage
        {
            get { return _currentImage; }
            set
            {
                _currentImage = value;
                OnPropertyChanged(nameof(CurrentImage));
            }
        }

        public string? CurrentImagePath
        {
            get { return _currentImagePath; }
            set
            {
                _currentImagePath = value;
                OnPropertyChanged(nameof(CurrentImagePath));
            }
        }

        public CommandHistory CmdHistory
        {
            get { return _cmdHistory; }
            set
            {
                _cmdHistory = value;
                OnPropertyChanged(nameof(CmdHistory));
            }
        }



        public event PropertyChangedEventHandler? PropertyChanged;
        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}