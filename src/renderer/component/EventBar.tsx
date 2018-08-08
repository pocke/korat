import * as React from 'react';

import * as styles from './EventBar.scss';
import { Item } from '../../share/types/SearchIssuesResult';
import IssueBox from './IssueBox';

interface Props {
  issues: Item[];
  selectedEndpointID: string;
  urlBase: string;
}

export default class EventBar extends React.Component<Props> {
  render() {
    return (
      <div className={styles.main}>
        <h2>Events</h2>
        {this.props.issues.map(issue => (
          <IssueBox
            key={issue.id}
            issue={issue}
            urlBase={this.props.urlBase}
            selectedEndpointID={this.props.selectedEndpointID}
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
