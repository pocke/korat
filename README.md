# Korat - GitHub Notification Reader

It is under development, so everything may be changed.

# Configuration Example

```yaml
# ~/.config/korat.yaml
- displayName: GitHub.com
  urlBase: 'https://github.com'
  apiUrlBase: 'https://api.github.com'
  # personal access token
  accessToken: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  channels:
    - displayName: team
      system: team
      query:
        - 'team:/it-is-system-channel'
    - displayName: me
      query:
        - 'involves:pocke'
        - 'user:pocke'
    - displayName: RuboCop
      query:
        - 'user:rubocop-hq'
    - displayName: korat
      query:
        - 'repo:pocke/korat'
```

# Development

Install dependencies

```bash
$ yarn install
```

Build and watch TypeScript code

```bash
$ yarn start
```

Start electron application

```bash
$ yarn run electron
```

Before Commit

```bash
$ yarn run format
```
