import * as React from 'react';

import * as styles from './EventBar.scss';
import IssueBox from './IssueBox';
import { Issue, Account } from '../API';
import { updateOnlyUnreadIssuesAction, refreshIssuesAction } from '../ActionCreator';
import { Store } from '../Store';

interface Props {
  issues: Issue[];
  urlBase: string;
  onlyUnreadIssue: boolean;
  selectedChannelID?: number;
  account?: Account;
}

export class EventBar extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onChangeOnlyUnreadIssueCheckbox = this.onChangeOnlyUnreadIssueCheckbox.bind(this);
  }

  render() {
    return (
      <div className={styles.container}>
        <div>
          <h2>Events</h2>
          <label>
            <input
              type="checkbox"
              checked={this.props.onlyUnreadIssue}
              onChange={this.onChangeOnlyUnreadIssueCheckbox}
            />
            Only unread issues
          </label>
        </div>
        <div className={styles.main}>
          {this.props.issues.map(issue => (
            <IssueBox key={issue.ID} issue={issue} urlBase={this.props.urlBase} />
          ))}
        </div>
      </div>
    );
  }

  private async onChangeOnlyUnreadIssueCheckbox(ev: React.ChangeEvent<HTMLInputElement>) {
    const onlyUnreadIssues = ev.target.checked;
    Store.dispatch(updateOnlyUnreadIssuesAction(onlyUnreadIssues));
    const { selectedChannelID, account } = this.props;
    if (selectedChannelID && account) {
      Store.dispatch(await refreshIssuesAction(selectedChannelID, onlyUnreadIssues, account.UrlBase));
    }
  }
}
