# Context7 performance rule

When using Context7 MCP:

- Prefer direct `query-docs` when a known library ID is available.
- Do not call `resolve-library-id` for React unless the user explicitly asks.
- For React documentation, use Context7 library ID `/reactjs/react.dev` directly.
- For simple documentation lookups, do not run terminal commands or read local files.
- After answering the requested docs question, stop. Do not continue thinking, resolving more libraries, or repeating the same answer.
- If multiple Context7 library candidates appear, pick the official/high-reputation documentation source and proceed instead of stalling.

Known library IDs:
- React docs: `/reactjs/react.dev`
