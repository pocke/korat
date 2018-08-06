import { findAllIssues, updateIssueRead } from '../db';

export const issuesIndex = async (channel_id: string) => {
  return findAllIssues(channel_id);
};

export const issueMarkAsRead = async (issue_id: number, endpoint_id: string) => {
  await updateIssueRead(issue_id, endpoint_id, true);
  return 'ok';
};

export const issueMarkAsUnread = async (issue_id: number, endpoint_id: string) => {
  await updateIssueRead(issue_id, endpoint_id, false);
  return 'ok';
};
