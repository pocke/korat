import * as React from 'react';

import * as styles from './EventBar.scss';
import { IssueBox } from './IssueBox';
import { Issue } from '../API';
import { prefetchIssue } from '../../utils';

interface Props {
  issues: Issue[];
  urlBase: string;
}

export class EventBar extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.prefetchIssue = this.prefetchIssue.bind(this);
  }

  render() {
    return (
      <div className={styles.container}>
        <div>
          <h2>Events</h2>
        </div>
        <div className={styles.main}>
          {this.props.issues.map(issue => (
            <IssueBox key={issue.ID} issue={issue} urlBase={this.props.urlBase} prefetchIssue={this.prefetchIssue} />
          ))}
        </div>
        <div className={styles.rest} />
      </div>
    );
  }

  private prefetchIssue() {
    const i = this.props.issues.find(i => !i.cached);
    if (!i) return;
    prefetchIssue(i, this.props.urlBase);
  }
}
