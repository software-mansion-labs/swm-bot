import { graphql } from '@octokit/graphql';

async function didMaintainerChangeLabels({ issueData }, next) {
  const { owner, repo, issue_number: isseuNumber } = issueData;

  const { data } = await graphql({
    query: `query data($owner: String!, $repo: String!, $isseuNumber: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $isseuNumber) {
          timelineItems(first: 250) {
            edges {
              node {
                ... on LabeledEvent {
                  actor {
                    login
                    ... on Bot {
                      id
                    }
                  }
                }
                ... on UnlabeledEvent {
                  actor {
                    login
                    ... on Bot {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    owner,
    repo,
    isseuNumber,
  });

  const { timelineItems } = data.repository.issue;

  console.log(timelineItems);

  next();
}

export default didMaintainerChangeLabels;
