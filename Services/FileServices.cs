using System.Diagnostics;
using System.IO;
using Microsoft.Win32;
using System.Windows.Media.Imaging;
using System.Drawing;
using System.Drawing.Imaging;

namespace ElectroImageViewer.Services
{
    public class FileService
    {
        private static ImageFormat GetImageFormat(string filePath)
        {
            string extension = Path.GetExtension(filePath).ToLower();
            return extension switch
            {
                ".jpg" or ".jpeg" => ImageFormat.Jpeg,
                ".bmp" => ImageFormat.Bmp,
                ".gif" => ImageFormat.Gif,
                ".png" => ImageFormat.Png,
                _ => ImageFormat.Png // Default to PNG if unsure
            };
        }

        public static Bitmap ConvertToPixelFormat(Bitmap source, System.Drawing.Imaging.PixelFormat format)
        {
            Bitmap clone = new Bitmap(source.Width, source.Height, format);
            using (Graphics gr = Graphics.FromImage(clone))
            {
                gr.DrawImage(source, new Rectangle(0, 0, clone.Width, clone.Height));
            }
            return clone;
        }
        public static BitmapImage BitmapToImageSource(Bitmap bitmap)
        {
            try
            {
                using (MemoryStream memory = new MemoryStream())
                {
                    Bitmap bmp = ConvertToPixelFormat(bitmap, System.Drawing.Imaging.PixelFormat.Format24bppRgb);
                    bmp.Save(memory, System.Drawing.Imaging.ImageFormat.Bmp);
                    memory.Position = 0;
                    BitmapImage bitmapImage = new BitmapImage();
                    bitmapImage.BeginInit();
                    bitmapImage.StreamSource = memory;
                    bitmapImage.CacheOption = BitmapCacheOption.OnLoad;
                    bitmapImage.EndInit();
                    bitmapImage.Freeze(); // Ensure the bitmap is usable across threads
                    return bitmapImage;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Failed to convert Bitmap to BitmapImage: " + ex.Message);
                return null;
            }
        }


        public static Bitmap? OpenFile(string filePath)
        {
            try
            {
                // Directly return a new Bitmap from the file
                using FileStream stream = File.OpenRead(filePath);
                return new Bitmap(stream);
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Error opening file: " + ex.Message);
                return null;
            }
        }

        public static bool WriteFile(Bitmap bitmap, string filePath)
        {
            try
            {
                // Determine image format from file extension
                ImageFormat format = GetImageFormat(filePath);
                if (File.Exists(filePath))
                    File.Delete(filePath);
                bitmap.Save(filePath, format);
                return true; // Return true if the file is saved successfully
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Error writing file: " + ex.Message);
                return false;
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
