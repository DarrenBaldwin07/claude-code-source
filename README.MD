# decompiled claude code source

- got most of the code from this [repo](https://github.com/ghuntley/claude-code-source-code-deobfuscation). It was not working so i messed around with it and made changes until all the commands started working (required much more messing around to make it work than i thought)
- it has very minimal functionality compared to the actual Claude Code but its a start
- the webpack compiled code is here: https://www.npmjs.com/package/@anthropic-ai/claude-code?activeTab=code
- also messed around with [webcrack](https://github.com/j4k0xb/webcrack) and it came up with this:

## Local

1. Install dependencies

```bash
bun install
```

2. Build the project

```bash
bun run build
```

3. Get version

```bash
bun dist/src/cli.js version
```

4. Ask claude a question

```bash
bun dist/src/cli.js ask hello world
```
