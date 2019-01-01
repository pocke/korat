import * as React from 'react';

import * as styles from './EventBar.scss';
import IssueBox from './IssueBox';
import { Issue } from '../API';

interface Props {
  issues: Issue[];
  selectedAccountID: string;
  urlBase: string;
}

export default class EventBar extends React.Component<Props> {
  render() {
    return (
      <div className={styles.main}>
        <h2>Events</h2>
        {this.props.issues.map(issue => (
          <IssueBox
            key={issue.ID}
            issue={issue}
            urlBase={this.props.urlBase}
            selectedAccountID={this.props.selectedAccountID}
          />
        ))}
      </div>
    );
  }
}

export class EmptyEventBar extends React.Component {
  render() {
    return (
      <div className={styles.main}>
        <h2>Events</h2>
      </div>
    );
  }
}
