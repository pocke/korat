export interface Notification {
  id: string;
  unread: boolean;
  reason:
    | 'assign'
    | 'author'
    | 'comment'
    | 'invitation'
    | 'manual'
    | 'mention'
    | 'state_change'
    | 'subscribed'
    | 'team_mention';
  updated_at: string;
  last_read_at?: string;
  subject: {
    title: string;
    url: string;
    latest_comment_url: string;
    type: string;
  };
  repository: any; //TODO
  url: string;
  subscription_url: string;
}
