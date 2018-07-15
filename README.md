# Korat - GitHub Notification Reader

It is under development, so everything may be changed.

# Configuration Example

```yaml
# ~/.config/korat.yaml
github-com:
  urlBase: 'https://github.com'
  apiUrlBase: 'https://api.github.com'
  # personal access token
  accessToken: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  categories:
    - displayName: 'Participating'
      # id should be an unique string
      id: 'Z6MWEoQUD'
      order: 1
      query:
        reason:
          $ne: 'subscribed'
    - displayName: 'Mention me and team'
      id: 'EseK8rQU8'
      order: 2
      query:
        reasons:
          $in: ['mention', 'team_memtion']
    - displayName: 'assigned'
      id: 'GViJTXgv-'
      order: 3
      query:
        reason: 'assign'
    - displayName: 'all'
      id: 'fsdafkdja'
      order: 4
      query: {}
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
