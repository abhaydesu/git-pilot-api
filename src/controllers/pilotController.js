import { parse } from "shell-quote";
import { generate } from "../services/genai.js";
import { VALID_GIT_COMMANDS } from "../constants/validCommands.js";
import {
  commitPrompt,
  runPrompt,
  runRetryPrompt,
  branchPrompt,
} from "../prompts.js";

const ERROR_PREFIX = "Error:";
const UNSAFE_COMMAND = `${ERROR_PREFIX} Could not produce a valid Git command.`;

// Models sometimes wrap answers in backticks or code fences despite instructions.
const stripFences = (text) =>
  text
    .replace(/^```\w*\n?/, "")
    .replace(/\n?```$/, "")
    .replace(/^`|`$/g, "")
    .trim();

/** Returns the git subcommand if `command` is a plain `git <known-verb> ...`, else null. */
export function gitVerb(command) {
  const tokens = parse(command);
  // Non-string tokens are shell operators/globs/comments (;, &&, |, >, ...).
  if (tokens.some((t) => typeof t !== "string")) return null;
  const [bin, verb] = tokens;
  return bin === "git" && VALID_GIT_COMMANDS.has(verb) ? verb : null;
}

export async function pilotCommit(req, res) {
  const { intent, diff } = req.body;
  const message = await generate(commitPrompt({ intent, diff }));
  res.json({ message });
}

export async function pilotRun(req, res) {
  const { request } = req.body;

  let command = stripFences(await generate(runPrompt({ request })));
  if (command.startsWith(ERROR_PREFIX)) return res.json({ command });

  if (!gitVerb(command)) {
    const [, verb = command] = command.split(/\s+/);
    command = stripFences(
      await generate(runRetryPrompt({ request, previous: command, verb }))
    );
    if (command.startsWith(ERROR_PREFIX)) return res.json({ command });
    if (!gitVerb(command)) return res.json({ command: UNSAFE_COMMAND });
  }

  res.json({ command });
}

export async function pilotUndo(req, res) {
  const firstLine = req.body.reflog.split("\n")[0];

  if (firstLine.includes("merge")) {
    return res.json({
      command: "git reset --hard ORIG_HEAD",
      explanation:
        "This command resets your branch to the state it was in before the merge.",
    });
  }
  if (firstLine.includes("rebase")) {
    return res.json({
      command: "git rebase --abort",
      explanation:
        "This command completely cancels the current rebase operation.",
    });
  }
  if (firstLine.includes("commit")) {
    return res.json({
      command: "git reset --soft HEAD~1",
      explanation:
        "This command undoes your last commit but keeps all your changes staged.",
    });
  }

  res.json({
    command: null,
    explanation: "Couldn't determine a safe action to undo.",
  });
}

export async function pilotBranch(req, res) {
  const { description } = req.body;
  const branchName = await generate(branchPrompt({ description }));
  res.json({ branchName });
}
