using System.Diagnostics;
using System.IO;
using Microsoft.Win32;
using System.Windows.Media.Imaging;

namespace ElectroImageViewer.Services
{
    public class FileService
    {
        public static BitmapImage? OpenFile(string filePath)
        {
            try
            {
                BitmapImage bi = new();
                using (FileStream stream = File.OpenRead(filePath))
                {
                    bi.BeginInit();
                    bi.CacheOption = BitmapCacheOption.OnLoad; // Load the image with a FileStream to avoid file locking
                    bi.StreamSource = stream;
                    bi.EndInit();
                }
                bi.Freeze(); // Make the BitmapImage thread-safe
                return bi;
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Error opening file: " + ex.Message);
                return null;
            }
        }

        public static string? OpenFileDialog()
        {
            OpenFileDialog openFileDialog = new();
            if (openFileDialog.ShowDialog() == true)
            {
                return openFileDialog.FileName;
            }
            return null;
        }

        public static string? RenameFile(string originalPath, string newName)
        {
            try
            {
                string directory = Path.GetDirectoryName(originalPath) ?? "./";
                string newPath = Path.Combine(directory, newName);
                File.Move(originalPath, newPath);
                return newPath;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public static string? CopyFile(string sourcePath, string destination)
        {
            try
            {
                // Resolve the full path of the target based on the sourcePath's directory
                string? sourceDirectory = Path.GetDirectoryName(sourcePath);
                if (string.IsNullOrEmpty(sourceDirectory))
                {
                    sourceDirectory = "./"; // Fallback to current directory if sourcePath has no directory
                }
                string fullPath = Path.GetFullPath(Path.Combine(sourceDirectory, destination));

                File.Copy(sourcePath, fullPath, overwrite: true);
                return fullPath;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
