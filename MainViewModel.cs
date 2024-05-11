using System;
using System.Windows.Media.Imaging;
using System.ComponentModel;

namespace ElectroImageViewer
{
    public class MainViewModel : INotifyPropertyChanged

    {
        private BitmapImage? _currentImage;
        private string? _currentImagePath;

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

        public event PropertyChangedEventHandler? PropertyChanged;
        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}