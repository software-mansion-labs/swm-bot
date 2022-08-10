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

  console.log(repository);

  const timelineItems = repository.issue.timelineItems.edges;

  console.log(timelineItems);

  // First label is always added by the issue author
  const firstTimelineItem = timelineItems[0].node;
  const author = firstTimelineItem.node.actor.login;

  console.log(author);

  const filteredTimelineItems = timelineItems.filter(({ node }) => Object.keys(node).length === 0);

  console.log(filteredTimelineItems);

  const timelineItemsWithoutAuthor = filteredTimelineItems.filter(
    ({ node }) => node.actor.login !== author
  );

  console.log(timelineItemsWithoutAuthor);

  const timelineItemsWithoutBotAndAuthor = timelineItemsWithoutAuthor.filter(({ node }) => {
    const { id } = node.actor;
    // if actor has id, it's a bot
    return id == null;
  });

  // we've filtered out all issue author and bot labeled & unlabeled events
  // so only maintainer events are left
  console.log(timelineItemsWithoutBotAndAuthor);

  next();
}

module.exports = didMaintainerChangeLabels;
