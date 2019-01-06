import * as React from 'react';

import * as styles from './EventBar.scss';
import IssueBox from './IssueBox';
import { Issue } from '../API';
import { updateOnlyUnreadIssuesAction } from '../ActionCreator';
import { Store } from '../Store';

interface Props {
  issues: Issue[];
  urlBase: string;
  onlyUnreadIssue: boolean;
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

  private onChangeOnlyUnreadIssueCheckbox(ev: React.ChangeEvent<HTMLInputElement>) {
    Store.dispatch(updateOnlyUnreadIssuesAction(ev.target.checked));
  }
}
