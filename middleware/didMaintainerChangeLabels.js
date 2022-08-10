const core = require('@actions/core');

/**
 * This middleware stops action execution (stops bot messing around with issue) when
 * maintainer changed the labels on the issue.
 */
async function didMaintainerChangeLabels({ octokit, issueData }, next) {
  const { owner, repo, issue_number: isseuNumber } = issueData;

  const { repository } = await octokit.graphql({
    query: `query timelineItems($owner: String!, $repo: String!, $isseuNumber: Int!) {
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

  const timelineItems = repository.issue.timelineItems.edges;

  if (timelineItems.length === 0) {
    return next();
  }

  // First label is always added by the issue author
  const firstTimelineItem = timelineItems[0];
  const author = firstTimelineItem.node.actor.login;

  console.log(author);

  const filteredTimelineItems = timelineItems.filter(({ node }) => Object.keys(node).length !== 0);

  console.log(filteredTimelineItems);

  const timelineItemsWithoutAuthor = filteredTimelineItems.filter(
    ({ node }) => node.actor.login !== author
  );

  console.log(timelineItemsWithoutAuthor);

  // we've filtered out all issue author and bot labeled & unlabeled events
  // so only maintainer events are left. With maintainer we mean all events
  // that are neither bot nor issue author events
  const maintainerTimelineItems = timelineItemsWithoutAuthor.filter(({ node }) => {
    const { id } = node.actor;
    // in this case if actor has id, it's a bot
    return id == null;
  });

  console.log(maintainerTimelineItems);

  if (maintainerTimelineItems.length !== 0) {
    core.notice('Maintainer changed labels on issue. Skipping...');
    return;
  }

  next();
}

module.exports = didMaintainerChangeLabels;
