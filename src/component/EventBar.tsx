import * as React from 'react';

import * as styles from './EventBar.scss';
import { Notification } from '../mainProcess/models/Notification';

interface Props {
  notifications: Notification[];
  openEvent: { (url: string): void };
}

export default class EventBar extends React.Component<Props> {
  render() {
    return (
      <div className={styles.main}>
        <h2>Events</h2>
        {this.props.notifications.map(n => this.renderNotification(n))}
      </div>
    );
  }

  private renderNotification(n: Notification) {
    const boxClassNames = [styles.event];
    boxClassNames.push(n.unread ? styles.unreadEvent : styles.readEvent);
    const titleClassName = n.unread ? undefined : styles.readEventTitle;
    return (
      <div key={n.id} className={boxClassNames.join(' ')}>
        <a href="#" onClick={this.onClickNotification.bind(this, n)} className={titleClassName}>
          {n.subject.title} in {n.repository.full_name}
        </a>
      </div>
    );
  }

  private onClickNotification(n: Notification, ev: Event) {
    ev.preventDefault();
    this.props.openEvent(this.buildURL(n));
  }

  // TODO: GHE
  private buildURL(n: Notification) {
    const apiURL = n.subject.url;

    const matchPR = /^https:\/\/api\.github\.com\/repos\/([^\/]+)\/([^\/]+)\/pulls\/(\d+)$/.exec(apiURL);
    if (matchPR) {
      const owner = matchPR[1];
      const repo = matchPR[2];
      const num = matchPR[3];
      return `https://github.com/${owner}/${repo}/pull/${num}`;
    }

    const matchIssue = /^https:\/\/api\.github\.com\/repos\/([^\/]+)\/([^\/]+)\/issues\/(\d+)$/.exec(apiURL);
    if (matchIssue) {
      const owner = matchIssue[1];
      const repo = matchIssue[2];
      const num = matchIssue[3];
      return `https://github.com/${owner}/${repo}/issues/${num}`;
    }

    throw `Cannot get URL for ${apiURL}`;
  }
}
