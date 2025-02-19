import { useEffect, useRef, useState } from "preact/hooks";
import "./styles.css";
import { useTerminalStore } from "../../stores/useTerminalStore";
import CommandRegistry from "../../commands/CommandRegistry";

export default function Terminal() {
  const { addHistory, history, isTerminalOpen } = useTerminalStore()
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalHistoryRef = useRef<HTMLDivElement>(null);

  function appendToHistory(line: string) {
    addHistory(line);
  }

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
        const formattedInputValue = `> ${inputValue}`;
        appendToHistory(formattedInputValue);

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
              appendToHistory(`Command not found: ${commandToken}`);
            }
          }
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
            <span>
              {line}
            </span>
          </div>
        ))}
      </div>
      <div class="terminal-line">
        <span id="terminal-path">&gt; &nbsp;</span>
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
