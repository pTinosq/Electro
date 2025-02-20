import { useEffect, useRef, useState } from "preact/hooks";
import "./styles.css";
import { useTerminalStore } from "../../stores/useTerminalStore";
import CommandRegistry from "../../commands/CommandRegistry";

export default function Terminal() {
  const { addHistory, history, isTerminalOpen, cwd } = useTerminalStore()
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalHistoryRef = useRef<HTMLDivElement>(null);

  // On mount, focus the input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want this to run when history updates (biome is not smart enough to know this)
  useEffect(() => {
    // Ensure scroll only happens when history updates
    if (terminalHistoryRef.current) {
      terminalHistoryRef.current.scrollTo({
        top: terminalHistoryRef.current.scrollHeight,
      });
    }
  }, [history]);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Enter": {
        const inputValue = inputRef.current?.value.trim();
        const inputTokens = inputValue?.split(" ");

        // Add a prompt to the input value
        const formattedInputValue = `${cwd}> ${inputValue}`;
        addHistory({ type: "input", value: formattedInputValue });

        if (inputRef.current) {
          inputRef.current.value = "";
        }

        const commandToken = inputTokens?.[0];
        if (commandToken) {
          const command = CommandRegistry.getInstance().getCommand(commandToken);
          if (command) {
            command.execute(...(inputTokens.slice(1)));
          } else {
            if (commandToken.trim() !== "") {
              addHistory({ type: "output", value: `Command not found: ${commandToken}` });
            }
          }
        }
        break;
      }
      case "ArrowUp": {
        // Prevent moving cursor to start of input
        e.preventDefault();

        // Filter history to only show input entries
        const inputHistory = history.filter((entry) => entry.type === "input");
        // Get the last input entry (compared to the current history index)
        const lastInput = inputHistory[inputHistory.length - (historyIndex + 2)];
        setHistoryIndex((prev) => Math.min(prev + 1, inputHistory.length - 1));

        if (lastInput && inputRef.current) {
          inputRef.current.value = lastInput.value.split("> ")[1];
        }

        break;
      }
      case "ArrowDown": {
        // Prevent moving cursor to end of input
        e.preventDefault();

        // Filter history to only show input entries
        const inputHistory = history.filter((entry) => entry.type === "input");
        // Get the next input entry (compared to the current history index)
        const nextInput = inputHistory[inputHistory.length - historyIndex];
        setHistoryIndex((prev) => Math.max(prev - 1, -1));

        if (nextInput && inputRef.current) {
          inputRef.current.value = nextInput.value.split("> ")[1];
        }

        break;
      }
    }
  }


  const handleTerminalClick = (_: MouseEvent) => {
    // Prevent focus if text is being selected
    if (window.getSelection()?.toString().length) {
      return;
    }
    inputRef.current?.focus();
  };

  return (isTerminalOpen ? (
    <div id="terminal" onClick={handleTerminalClick}>
      <div ref={terminalHistoryRef} id="terminal-history">
        {history.map((line) => (
          <div key={Math.random()}>
            <span class={`terminal-history-${line.variant || "default"}`}>
              {line.value}
            </span>
          </div>
        ))}
      </div>
      <div class="terminal-line">
        <span id="terminal-path">{cwd}&gt;&nbsp;</span>
        <input
          ref={inputRef}
          type="text"
          id="terminal-input"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          spellcheck={false}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>) : null
  )
};
