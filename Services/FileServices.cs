using System.Diagnostics;
using System.IO;
using Microsoft.Win32;
using System.Windows.Media.Imaging;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System;
using System.Threading.Tasks;

namespace ElectroImageViewer.Services
{
    public class FileService
    {
        public static ImageFormat GetImageFormat(string filePath)
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

        public static Bitmap ConvertToPixelFormat(Bitmap source, PixelFormat format)
        {
            Bitmap clone = new Bitmap(source.Width, source.Height, format);
            using (Graphics gr = Graphics.FromImage(clone))
            {
                gr.DrawImage(source, new Rectangle(0, 0, clone.Width, clone.Height));
            }
            return clone;
        }

        public static BitmapImage? BitmapToImageSource(Bitmap bitmap, ImageFormat format)
        {
            if (bitmap is null)
            {
                throw new ArgumentNullException(nameof(bitmap));
            }

            try
            {
                using MemoryStream memory = new();
                bitmap.Save(memory, format);
                memory.Position = 0;
                BitmapImage bitmapImage = new();
                bitmapImage.BeginInit();
                bitmapImage.StreamSource = memory;
                bitmapImage.CacheOption = BitmapCacheOption.OnLoad;
                bitmapImage.EndInit();
                return bitmapImage;
            }
            catch (Exception ex)
            {
                Debug.WriteLine("Failed to convert Bitmap to BitmapImage: " + ex.Message);
                return null;
            }
            finally
            {
                bitmap.Dispose(); // Explicitly dispose the bitmap
            }
        }

        public static Bitmap? OpenFile(string filePath)
        {
            try
            {
                using FileStream stream = File.OpenRead(filePath);
                return new Bitmap(stream); // Directly create the Bitmap from the stream
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
                ImageFormat format = GetImageFormat(filePath);
                if (File.Exists(filePath))
                    File.Delete(filePath);
                bitmap.Save(filePath, format);
                return true;
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
                string? sourceDirectory = Path.GetDirectoryName(sourcePath);
                if (string.IsNullOrEmpty(sourceDirectory))
                {
                    sourceDirectory = "./";
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
