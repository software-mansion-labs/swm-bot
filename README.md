# swmansion-bot

GitHub Actions for triaging issues in Software Mansion Open Source projects.

This project is fondly known within Software Mansion as Bot Szczepan (eng. Stephen) 🤖

`swmansion-bot` is a successor to the [issue-validator](https://github.com/karol-bisztyga/issue-validator) created by [@karol-bisztyga](https://github.com/karol-bisztyga) 🙌

## Repo layout

```bash
├── common # utility functions reused between actions
├── examples # yaml files showing how to use actions within your project
├── needs-more-info # action used for checking whether the issue template fields are filled
├── needs-repro # action used for checking whether issue has a snack, GitHub repo or a snippet of code
└── platforms # action that assigns labels to user-selected platforms in the issue template
```

Repository consists of a few GitHub Actions that are implemented in self-contained manner - each one should be independent of each other.

Each action is placed in a separate directory, and because they are implemented in JavaScript, they must have at least two files - `action.yml` and `index.js`. The `action.yml` file is the file that contains name, description and inputs that action can accept. The `index.js` is a code entry file. Logic that is not directly related to GitHub API manipulation (such as validation or formating) is split into separated files is the action directory.

## Actions

Examples of use can be found in [the examples/ directory](./examples/README.md).

### needs-more-info

```yml
name: Needs More Info
description: Checks whether the issue template fields are filled
inputs:
  github-token:
    description: A GitHub token.
    required: false
    default: ${{ github.token }}

  needs-more-info-label:
    description: Name of the 'needs-more-info' label used in the repo
    required: true
    default: needs-more-info

  required-sections:
    description: Semicolon separated list of names of required sections eg. 'Description;Reproduction;Platform'
    required: true

  needs-more-info-response:
    description: Start of GitHub Actions response when not enough information is provided
    required: true
```

### needs-repro

```yml
name: Needs Repro
description: Checks whether issue has a snack, GitHub repo or a snippet of code
inputs:
  github-token:
    description: A GitHub token.
    required: false
    default: ${{ github.token }}

  needs-repro-label:
    description: Name of the 'needs-repro' label used in the repo
    required: true
    default: needs-repro

  repro-provided-label:
    description: Name of the 'repro-provided' label used in the repo
    required: true
    default: repro-provided

  needs-repro-response:
    description: GitHub Actions response when no reproduction provided
    required: true
```

### platforms

```yml
name: Platforms
description: Assigns labels to user-selected platforms in the issue template
inputs:
  github-token:
    description: A GitHub token.
    required: false
    default: ${{ github.token }}

  platforms-with-labels:
    description: Dictionary with platforms and corresponding labels used in the repo
    # for example: '{"Android": "🤖android", "iOS": "🍎iOS"}'
    required: true
```
