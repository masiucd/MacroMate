# GitHub Copilot Instructions

## Commit message standard (Conventional Commits v1.0.0)

When drafting commit messages for this project, always use the Conventional Commits format:

```
<type>(optional scope): <short summary>

[optional body]

[optional footer(s)]
```

### Rules
- **`type` is required** and must be one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **`scope` is optional** and should be a concise noun (e.g., `auth`, `ui`, `api`).
- **`short summary` is required** and should:
  - be written in the imperative mood (e.g., "add", "fix", "update")
  - be lowercase
  - not end with a period
- **Breaking changes** must be indicated by:
  - appending `!` to the type/scope, **or**
  - adding a footer line `BREAKING CHANGE: <details>`

### Examples
- `feat(auth): add oauth login flow`
- `fix(ui): handle empty state in list view`
- `docs: update deployment guide`
- `refactor!: remove legacy payment hooks`
- `chore: bump biome config`
- `feat(api): add batch endpoint\n\nBREAKING CHANGE: batch responses are now paginated`





