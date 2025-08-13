## Dependencies

- [Deno](https://deno.land/)

## Useful tools

- [Deno extension for VS Code](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
  - see `.vscode/extensions.json` for recommeded extensions

## Hosting

The web app is meant to be hosted by [Deno Deploy](https://deno.com/deploy).

This project uses an [ahead-of-time build](https://fresh.deno.dev/docs/concepts/ahead-of-time-builds), which
necessitates the use of GitHub Actions. These are configured by `.github/workflows/deploy.yml`.

## Main tasks

- `deno task pre-commit` (linting, testing, formatting, and artifact creation)
- `deno task build-mock-data`
- `deno task web-app-start`

See `deno.json` for all tasks.

## Committing to `master`

The `pre-commit` task should be successfully executed before committing to ensure that the code is linted, correct, and
formatted, and that the artifacts are kept in-sync with the source.

Commit messages should follow the following pattern:

```
type(scope): details

more details (optional)
```

Where `type` is one of:

- `feat` — for user-facing functionality additions and improvements
- `fix` — for bug fixes
- `refactor` — for code refactoring that does not substantially change user-facing functionality
- `chore` — for non-user-facing changes such build or configuration changes, or dependency updates
- `style` — for merely cosmetic code changes
- `docs` — for documentation changes
