/**
 * Parses a command-line style input string, correctly handling quoted arguments.
 *
 * This function splits an input string into arguments, preserving spaces inside
 * quoted substrings (both single `'` and double `"` quotes are supported).
 *
 * Example:
 *  parseCommandInput('load "C:/Users/Public users/example"') 
 *  -> ['load', 'C:/Users/Public users/example']
 *
 * @param input - The raw input string from the terminal.
 * @returns An array of parsed arguments, with quotes removed.
 */
export function parseCommandInput(input: string): string[] {
  const args: string[] = [];
  let currentArg = "";
  let insideQuotes = false;
  let quoteChar: string | null = null;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '"' || char === "'") {
      // Toggle quote state if it's the start or end of a quoted section
      if (insideQuotes && char === quoteChar) {
        insideQuotes = false;
        quoteChar = null;
      } else if (!insideQuotes) {
        insideQuotes = true;
        quoteChar = char;
      }
    } else if (char === " " && !insideQuotes) {
      // If we encounter a space outside quotes, push the currentArg and reset
      if (currentArg !== "") {
        args.push(currentArg);
        currentArg = "";
      }
    } else {
      // Append character to current argument
      currentArg += char;
    }
  }

  // Push the last argument if any
  if (currentArg !== "") {
    args.push(currentArg);
  }

  return args;
}
