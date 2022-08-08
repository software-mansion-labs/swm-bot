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
├── platforms # action that assigns labels to user-selected platforms in the issue template
└── close-when-stale # action that closes the issue with specified label after some time of inactivity
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

  check-issues-only-created-after:
    description: Creation date of the issues from which bot starts to reply when comment is added/edited/deleted. Date with format - YYYY-MM-DD
    required: false
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

  platforms-section-header:
    description: Name of the section on which platforms are stated in the issue template. Required for comma separated syntax
    required: false
    default: Affected platforms

  platforms-with-labels:
    description: Dictionary with platforms and corresponding labels used in the repo
    # for example: '{"Android": "🤖android", "iOS": "🍎iOS"}'
    required: true

  platforms-comma-separated:
    description: |
      Whether a checkbox syntax is used eg. '- [ ] iOS', or a comma-separated syntax eg. 'iOS, Android, Web'.
      Comma-separated syntax is used by dropdowns in new form-like GitHub issue templates
    required: false
    default: false
```

### close-when-stale

```yml
name: Close when stale
description: Closes the issue after the specified time if it has the specified label
inputs:
  github-token:
    description: A GitHub token.
    required: false
    default: ${{ github.token }}

  close-when-stale-label:
    description: Label which indicates which issues are considered to be closed
    required: true

  days-to-close:
    description: How many days will have to pass without activity in order to close the issue
    required: true
```
