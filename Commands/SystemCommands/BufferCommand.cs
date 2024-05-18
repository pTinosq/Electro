using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Controls;
using ElectroImageViewer.Services;

namespace ElectroImageViewer.Commands.SystemCommands
{
    public class BufferCommand() : Command("Buffer", "Description of the buffercommand", ["buffer", "buf"], CommandCategory.SYSTEM)
    {
        public override void Execute(MainViewModel viewModel, TextBox terminalOutput, List<string> parameters)
        {
            // Show active buffer if no params provided
            if (parameters.Count == 0)
            {
                if (viewModel.ActiveBuffer == ElectroBuffers.WORKSPACEBUFFERSPACE)
                {
                    terminalOutput.Text += "[WBS] Operating in Workspace Buffer\n";
                }
                else if (viewModel.ActiveBuffer == ElectroBuffers.ELECTROBUFFERSPACE)
                {
                    terminalOutput.Text += "[EBS] Operating in Electro Buffer\n";
                }
                else
                {
                    terminalOutput.Text += "[???] Operating in Unknown Buffer\n";
                }
                return;
            }

            string subCommand = parameters[0];

            if (subCommand == "switch")
            {
                SwitchBuffer(viewModel, terminalOutput);
            }

            if (subCommand == "stash")
            {
                if (viewModel.ActiveBuffer == ElectroBuffers.WORKSPACEBUFFERSPACE)
                {
                    viewModel.ElectrospaceBuffer = (byte[])viewModel.WorkspaceBuffer.Clone();
                    terminalOutput.Text += "WBS stashed into EBS\n";
                    SwitchBuffer(viewModel, terminalOutput);

                }
                else
                {
                    terminalOutput.Text += "Buffer can only be stashed downstream (WBS->EBS)\n";
                }
            }

            if (subCommand == "pop")
            {
                if (viewModel.ActiveBuffer == ElectroBuffers.WORKSPACEBUFFERSPACE)
                {
                    terminalOutput.Text += "Buffer can only be popped upsteam (EBS->WBS)\n";

                }
                else
                {

                    viewModel.WorkspaceBuffer = (byte[])viewModel.ElectrospaceBuffer.Clone();
                    terminalOutput.Text += "EBS stashed into WBS\n";
                    SwitchBuffer(viewModel, terminalOutput);
                }
            }
        }

        private void SwitchBuffer(MainViewModel viewModel, TextBox terminalOutput)
        {
            if (viewModel.ActiveBuffer == ElectroBuffers.WORKSPACEBUFFERSPACE)
            {
                viewModel.ActiveBuffer = ElectroBuffers.ELECTROBUFFERSPACE;
                terminalOutput.Text += "Switched to EBS\n";

            }
            else
            {
                viewModel.ActiveBuffer = ElectroBuffers.WORKSPACEBUFFERSPACE;
                terminalOutput.Text += "Switched to WBS\n";

            }
        }
    }
}
