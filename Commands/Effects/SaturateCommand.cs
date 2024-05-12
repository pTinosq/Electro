using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Windows.Controls;
using System.Windows.Media.Effects;
using System.Windows.Media.Imaging;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands.Effects
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

            if (isFloat && viewModel.CurrentImage != null)
            {

                viewModel.CurrentImage = AdjustSaturation(viewModel.CurrentImage, amount);

            }
        }

        public static Bitmap AdjustSaturation(Bitmap original, int saturationPercentage)
        {
            // Convert percentage saturation to a float scale (1.0 = 100%, 0.5 = 50%, etc.)
            float saturationScale = saturationPercentage / 100f;
            float saturationComplement = 1.0f - saturationScale;
            float saturationComplementR = 0.3086f * saturationComplement;
            float saturationComplementG = 0.6094f * saturationComplement;
            float saturationComplementB = 0.0820f * saturationComplement;

            ColorMatrix colorMatrix = new(
            [
                [saturationComplementR + saturationScale, saturationComplementR, saturationComplementR, 0, 0],
                [saturationComplementG, saturationComplementG + saturationScale, saturationComplementG, 0, 0],
                [saturationComplementB, saturationComplementB, saturationComplementB + saturationScale, 0, 0],
                [0, 0, 0, 1, 0],
                [0, 0, 0, 0, 1]
            ]);

            ImageAttributes attributes = new ImageAttributes();
            attributes.SetColorMatrix(colorMatrix);

            Point[] points =
            {
                new(0, 0),
                new(original.Width, 0),
                new(0, original.Height),
            };
            Rectangle rect = new(0, 0, original.Width, original.Height);

            // Create a new bitmap to which the color matrix will be applied
            Bitmap adjustedImage = new(original.Width, original.Height);
            using (Graphics g = Graphics.FromImage(adjustedImage))
            {
                g.DrawImage(original, points, rect, GraphicsUnit.Pixel, attributes);
            }

            return adjustedImage;
        }
    }
}
