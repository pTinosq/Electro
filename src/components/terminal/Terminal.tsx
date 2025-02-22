import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import "./styles.css";
import { useTerminalStore } from "../../stores/useTerminalStore";
import CommandRegistry from "../../commands/CommandRegistry";

export default function Terminal() {
	const { addHistory, history, isTerminalOpen, cwd } = useTerminalStore();
	const [_historyIndex, setHistoryIndex] = useState<number>(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const terminalHistoryRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isTerminalOpen) {
			inputRef.current?.focus();
		}
	}, [isTerminalOpen]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we want this to run when history updates (biome is not smart enough to know this)
	useEffect(() => {
		// Ensure scroll only happens when history updates
		if (terminalHistoryRef.current) {
			terminalHistoryRef.current.scrollTo({
				top: terminalHistoryRef.current.scrollHeight,
			});
		}
	}, [history]);

	const handleHistoryNavigation = useCallback(
		(direction: "up" | "down") => {
			const inputHistory = history.filter((entry) => entry.type === "input");

			if (inputHistory.length === 0) return;

			setHistoryIndex((prev) => {
				const newIndex =
					direction === "up"
						? Math.min(prev + 1, inputHistory.length - 1)
						: Math.max(prev - 1, -1);

				const historyEntry = inputHistory[inputHistory.length - (newIndex + 1)];

				if (historyEntry && inputRef.current) {
					inputRef.current.value = historyEntry.value.split("> ")[1];
				} else if (newIndex === -1 && inputRef.current) {
					inputRef.current.value = "";
				}

				return newIndex;
			});
		},
		[history],
	);

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
					const command =
						CommandRegistry.getInstance().getCommand(commandToken);
					if (command) {
						command.execute(...inputTokens.slice(1));
					} else {
						if (commandToken.trim() !== "") {
							addHistory({
								type: "output",
								value: `Command not found: ${commandToken}`,
							});
						}
					}
				}
				break;
			}
			case "ArrowUp": {
				e.preventDefault();
				handleHistoryNavigation("up");
				break;
			}
			case "ArrowDown": {
				e.preventDefault();
				handleHistoryNavigation("down");
				break;
			}
			case "Tab": {
				e.preventDefault();
				// For now we'll only provide autocomplete for the first token
				const inputValue = inputRef.current?.value.trim();
				const inputToken = inputValue?.split(" ")[0];
				if (inputToken) {
					const commands =
						CommandRegistry.getInstance().autocompleteCommand(inputToken);
					if (commands.length === 1 && inputRef.current) {
						inputRef.current.value = commands[0];
					} else if (commands.length > 1) {
						addHistory({ type: "output", value: `${commands.join(", ")}` });
					}
				}
			}
		}
	};

	const handleTerminalClick = (_: MouseEvent) => {
		// Prevent focus if text is being selected
		if (window.getSelection()?.toString().length) {
			return;
		}
		inputRef.current?.focus();
	};

	return isTerminalOpen ? (
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
		</div>
	) : null;
}
