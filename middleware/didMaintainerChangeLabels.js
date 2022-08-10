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

  // First label is always added by the issue author
  const firstTimelineItem = timelineItems[0].node;
  const author = firstTimelineItem.node.actor.login;

  const filteredTimelineItems = timelineItems.filter(({ node }) => node);

  const timelineItemsWithoutAuthor = filteredTimelineItems.filter(
    ({ node }) => node.actor.login !== author
  );

  const timelineItemsWithoutBotAndAuthor = timelineItemsWithoutAuthor.filter(({ node }) => {
    const { id } = node.actor;
    // if actor has id, it's a bot
    return id == null;
  });

  console.log(timelineItemsWithoutBotAndAuthor);

  next();
}

module.exports = didMaintainerChangeLabels;
