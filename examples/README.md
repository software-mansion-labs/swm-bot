# Examples

This directory contains YAML example workflows in batteries-included style 🔋⚡ with caching and cancelling ongoing actions. They can be copied'n'pasted to your project with the least amount of configuration needed.

Detailed documentation of the actions can be found in [the main README](../README.md).

## Actions structure

```yml
name: Action Name
# Conditions on which action is executed
on:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created, edited]

jobs:
  main:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Actions
        uses: actions/checkout@v2
        with:
# Repository within actions are implemented
          repository: 'software-mansion-labs/swmansion-bot'
# You can omit this to use actions from the main branch (not recommended)
          ref: stable

# Installation
      - name: Install Actions
        run: yarn install

# Action execution
      - name: Action Name
# Directory in which action is stored within repo eg. ./needs-repro
        uses: ./action-directory
# Action inputs
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          string-input: my-input
          semicolon-separated-input: 'Section1;Section2' 
          json-input: '{"key": "value"}'
```

This is a simplified example. We highly recommend caching installed packages with [@actions/cache](https://github.com/actions/cache).
