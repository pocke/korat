import { Issue } from './renderer/API';
export const issueURL = (issue: Issue, urlBase: string) => {
  const { Number, RepoOwner, RepoName } = issue;
  if (issue.IsPullRequest) {
    return `${urlBase}/${RepoOwner}/${RepoName}/pull/${Number}`;
  } else {
    return `${urlBase}/${RepoOwner}/${RepoName}/issues/${Number}`;
  }
};
