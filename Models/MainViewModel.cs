using System;
using System.Windows.Media.Imaging;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using System.Diagnostics;
using ElectroImageViewer.Services;

namespace ElectroImageViewer
{
    public class MainViewModel : INotifyPropertyChanged
    {
        private BitmapImage? _workspaceDisplayImage;
        private Bitmap? _workspaceImage;
        private Bitmap? _bufferImage;
        private Bitmap? _currentImage;
        private string? _currentImagePath;
        private CommandHistory _cmdHistory = new();

        public Bitmap? CurrentImage
        {
            get { return _currentImage; }
            set
            {
                if (_currentImage != value)
                {
                    _currentImage = value;
                    OnPropertyChanged(nameof(CurrentImage));
                    WorkspaceDisplayImage = FileService.BitmapToImageSource(value);  // Convert and update display image
                }
            }
        }

        public BitmapImage? WorkspaceDisplayImage
        {
            get { return _workspaceDisplayImage; }
            private set  // Make setter private if only VM should update this
            {
                if (_workspaceDisplayImage != value)
                {
                    _workspaceDisplayImage = value;
                    OnPropertyChanged(nameof(WorkspaceDisplayImage));
                }
            }
        }

        public string? CurrentImagePath
        {
            get { return _currentImagePath; }
            set
            {
                if (_currentImagePath != value)
                {
                    _currentImagePath = value;
                    OnPropertyChanged(nameof(CurrentImagePath));
                }
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
