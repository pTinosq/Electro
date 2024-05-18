using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Windows.Controls;

namespace ElectroImageViewer.Commands.EffectsCommands
{
    public class SaturateCommand() : Command("Saturate", "Description of the saturate command", ["saturate", "sat"], CommandCategory.EFFECT)
    {
        public override void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters)
        {
            if (parameters.Count == 0)
            {
                terminalOutput.Text += "Modifies the saturation of the active image. For more information run `help saturate`\n";
            }

            bool isFloat = int.TryParse(parameters[0], out int amount);

            if (isFloat)
            {

                if (viewModel.ActiveBuffer == ElectroBuffers.ELECTROBUFFERSPACE)
                {
                    viewModel.ElectrospaceBuffer = AdjustSaturation(viewModel.ElectrospaceBuffer, amount);
                }
                else
                {
                    viewModel.WorkspaceBuffer = AdjustSaturation(viewModel.WorkspaceBuffer, amount);

                }
            }
        }

        /*
         * Not a great implementation - should look into matrix transformations
         */
        public static byte[] AdjustSaturation(byte[] imageData, int saturationPercentage)
        {
            using var ms = new MemoryStream(imageData);
            using var original = new Bitmap(ms);
            int width = original.Width;
            int height = original.Height;

            // Lock the bitmap's bits.  
            Rectangle rect = new(0, 0, width, height);
            BitmapData bmpData = original.LockBits(rect, ImageLockMode.ReadWrite, original.PixelFormat);

            // Get the address of the first line.
            IntPtr ptr = bmpData.Scan0;

            // Declare an array to hold the bytes of the bitmap.
            int bytes = Math.Abs(bmpData.Stride) * height;
            byte[] rgbValues = new byte[bytes];

            // Copy the RGB values into the array.
            System.Runtime.InteropServices.Marshal.Copy(ptr, rgbValues, 0, bytes);

            float saturationScale = saturationPercentage / 100f;

            unsafe
            {
                fixed (byte* ptrRgb = rgbValues)
                {
                    for (int i = 0; i < rgbValues.Length; i += 3)
                    {
                        float b = ptrRgb[i];
                        float g = ptrRgb[i + 1];
                        float r = ptrRgb[i + 2];

                        float avg = (r + g + b) / 3;
                        r = avg + (r - avg) * saturationScale;
                        g = avg + (g - avg) * saturationScale;
                        b = avg + (b - avg) * saturationScale;

                        ptrRgb[i] = (byte)Math.Max(0, Math.Min(255, b));
                        ptrRgb[i + 1] = (byte)Math.Max(0, Math.Min(255, g));
                        ptrRgb[i + 2] = (byte)Math.Max(0, Math.Min(255, r));
                    }
                }
            }

            // Copy the RGB values back to the bitmap
            System.Runtime.InteropServices.Marshal.Copy(rgbValues, 0, ptr, bytes);

            // Unlock the bits.
            original.UnlockBits(bmpData);

            // Convert back to byte array
            using var stream = new MemoryStream();
            original.Save(stream, ImageFormat.Png);
            return stream.ToArray();
        }

    }
}
