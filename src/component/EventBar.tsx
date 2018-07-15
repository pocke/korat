import * as React from 'react';

import * as styles from './EventBar.scss';
import { Notification } from '../mainProcess/models/Notification';

interface Props {
  notifications: Notification[];
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

  renderNotification(n: Notification) {
    return (
      <div key={n.id}>
        {n.subject.title} in {n.repository.full_name}
        <hr />
      </div>
    );
  }
}
