import * as React from 'react';

import * as styles from './EventBar.scss';
import { Item } from '../share/types/SearchIssuesResult';

interface Props {
  issues: Item[];
  openEvent: { (url: string): void };
  markAsRead: { (id: number): void };
}

export default class EventBar extends React.Component<Props> {
  render() {
    return (
      <div className={styles.main}>
        <h2>Events</h2>
        {this.props.issues.map(n => this.renderIssue(n))}
      </div>
    );
  }

  private renderIssue(issue: Item) {
    const klass = issue.read ? styles.readEvent : styles.unreadEvent;
    const titleClass = issue.read ? styles.readEventTitle : styles.unreadEventTitle;
    return (
      <div key={issue.id} className={klass}>
        <a href="#" className={titleClass} onClick={this.onClickIssue.bind(this, issue)}>
          {issue.title} in {`${issue.repo.owner}/${issue.repo.name}`}
        </a>
      </div>
    );
  }

  private onClickIssue(issue: Item, ev: Event) {
    ev.preventDefault();
    this.props.markAsRead(issue.id);
    this.props.openEvent(this.buildURL(issue));
  }

  // TODO: GHE
  private buildURL(issue: Item) {
    if (issue.pull_request) {
      return `https://github.com/${issue.repo.owner}/${issue.repo.name}/issues/${issue.number}`;
    } else {
      return `https://github.com/${issue.repo.owner}/${issue.repo.name}/pull/${issue.number}`;
    }
  }
}
