using System;
using System.Windows.Media.Imaging;
using System.ComponentModel;
using System.Drawing;
using System.Diagnostics;
using ElectroImageViewer.Services;
using System.IO;

namespace ElectroImageViewer
{
    public enum ElectroBuffers
    {
        WORKSPACEBUFFERSPACE,
        ELECTROBUFFERSPACE
    }

    public class MainViewModel : INotifyPropertyChanged
    {
        private BitmapImage? _workspaceDisplayImage;
        private byte[] _workspaceBuffer;
        private string? _workspaceImagePath;
        private byte[] _electrospaceBuffer;
        private CommandHistory _cmdHistory = new();
        private ElectroBuffers _activeBuffer = ElectroBuffers.WORKSPACEBUFFERSPACE;

        public BitmapImage? WorkspaceDisplayImage
        {
            get { return _workspaceDisplayImage; }
            private set
            {
                if (_workspaceDisplayImage != value)
                {
                    _workspaceDisplayImage = value;
                    OnPropertyChanged(nameof(WorkspaceDisplayImage));
                }
            }
        }

        public ElectroBuffers ActiveBuffer
        {
            get { return _activeBuffer; }
            set
            {
                if (_activeBuffer != value)
                {
                    _activeBuffer = value;
                    OnPropertyChanged(nameof(ActiveBuffer));
                }
            }
        }

        public byte[] WorkspaceBuffer
        {
            get { return _workspaceBuffer; }
            set
            {
                _workspaceBuffer = value;
                WorkspaceDisplayImage = ConvertToImageSource(value);
                OnPropertyChanged(nameof(WorkspaceBuffer));
            }
        }

        public string? WorkspaceImagePath
        {
            get { return _workspaceImagePath; }
            set
            {
                if (_workspaceImagePath != value)
                {
                    _workspaceImagePath = value;
                    OnPropertyChanged(nameof(WorkspaceImagePath));
                }
            }
        }

        public byte[] ElectrospaceBuffer
        {
            get { return _electrospaceBuffer; }
            set
            {
                _electrospaceBuffer = value;
                OnPropertyChanged(nameof(ElectrospaceBuffer));
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

        private BitmapImage ConvertToImageSource(byte[] imageData)
        {
            using (MemoryStream ms = new(imageData))
            {
                BitmapImage image = new BitmapImage();
                image.BeginInit();
                image.StreamSource = ms;
                image.CacheOption = BitmapCacheOption.OnLoad;
                image.EndInit();
                return image;
            }
        }
    }
}

