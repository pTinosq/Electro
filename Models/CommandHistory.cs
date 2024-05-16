using System.Collections.Generic;

namespace ElectroImageViewer
{
    public class CommandHistory
    {
        private List<string> _history = [];
        private int _index = 0;

        public CommandHistory() { }

        public void AddCommand(string command)
        {
            _history.Add(command);
            _index = _history.Count;
        }

        public string GetCommand()
        {
            // Fetches the command at the current index
            if (_index < _history.Count && _index > -1)
            {
                return _history[_index];
            }

            return "";
        }

        public int IncrementIndex()
        {
            if (_index < _history.Count)
            {
                _index++;
            }

            return _index;
        }

        public int DecrementIndex()
        {
            if (_index > 0)
            {
                _index--;
            }

            return _index;
        }
    }
}
