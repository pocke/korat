import * as React from 'react';

import * as styles from './EventBar.scss';
import IssueBox from './IssueBox';
import { Issue } from '../API';

interface Props {
  issues: Issue[];
  urlBase: string;
}

export class EventBar extends React.Component<Props> {
  render() {
    return (
      <div className={styles.container}>
        <div>
          <h2>Events</h2>
        </div>
        <div className={styles.main}>
          {this.props.issues.map(issue => (
            <IssueBox key={issue.ID} issue={issue} urlBase={this.props.urlBase} />
          ))}
        </div>
      </div>
    );
  }
}
