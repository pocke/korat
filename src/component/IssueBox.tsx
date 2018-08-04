import * as React from 'react';
import Octicon, { IssueOpened, GitPullRequest } from '@githubprimer/octicons-react';

import * as styles from './IssueBox.scss';
import { Item } from '../share/types/SearchIssuesResult';

// HACK: Octicon is a JavaScript library, so tsc does not understand Octicon type.
//       So cast to any.
const O = Octicon as any;

interface Props {
  issue: Item;
  openEvent: { (url: string): void };
  markAsRead: { (id: number): void };
}

export default class IssueBox extends React.Component<Props> {
  render() {
    const { issue } = this.props;

    const klass = issue.read ? styles.readEvent : styles.unreadEvent;
    const titleClass = issue.read ? styles.readEventTitle : styles.unreadEventTitle;
    return (
      <div key={issue.id} className={klass} onClick={this.onClickIssue.bind(this)}>
        <h3 className={titleClass}>
          {this.renderIssueIcon()}
          {issue.title} in {`${issue.repo.owner}/${issue.repo.name}`}
        </h3>
      </div>
    );
  }

  private renderIssueIcon() {
    const { issue } = this.props;

    const klass = issue.state === 'open' ? styles.openIcon : styles.closedIcon;

    if (issue.pull_request) {
      return <O as any icon={GitPullRequest} className={klass} />;
    } else {
      return <O as any icon={IssueOpened} className={klass} />;
    }
  }

  private onClickIssue(ev: Event) {
    const { issue } = this.props;

    ev.preventDefault();
    this.props.markAsRead(issue.id);
    this.props.openEvent(this.buildURL());
  }

  // TODO: GHE
  private buildURL() {
    const { issue } = this.props;
    const { number } = issue;
    const { owner, name } = issue.repo;
    if (issue.pull_request) {
      return `https://github.com/${owner}/${name}/issues/${number}`;
    } else {
      return `https://github.com/${owner}/${name}/pull/${number}`;
    }
  }
}
