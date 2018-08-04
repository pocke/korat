import * as React from 'react';
import Octicon, { IssueOpened, GitPullRequest, CommentDiscussion } from '@githubprimer/octicons-react';

import * as styles from './IssueBox.scss';
import { Item, Label } from '../share/types/SearchIssuesResult';

// HACK: Octicon is a JavaScript library, so tsc does not understand Octicon type.
//       So cast to any.
const O = Octicon as any;

interface Props {
  issue: Item;
  openEvent: { (url: string): void };
  markAsRead: { (id: number): void };
  urlBase: string;
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
        <div className={styles.labelBox}>{issue.labels.map(label => this.renderLabel(label))}</div>
        {this.renderFooter()}
      </div>
    );
  }

  private renderIssueIcon() {
    const { issue } = this.props;

    const klass = issue.state === 'open' ? styles.openIcon : styles.closedIcon;

    if (issue.pull_request) {
      return <O icon={GitPullRequest} className={klass} />;
    } else {
      return <O icon={IssueOpened} className={klass} />;
    }
  }

  private renderLabel(label: Label) {
    return (
      <span key={label.id} style={{ backgroundColor: label.color }} className={styles.label}>
        {label.name}
      </span>
    );
  }

  private renderFooter() {
    const { issue } = this.props;
    const { comments } = issue;
    const { owner, name } = issue.repo;

    return (
      <div className={styles.footer}>
        <span>
          {this.userIcon(issue.user.avatar_url)}
          {this.renderAssignees()}
        </span>

        <span style={{ marginRight: '5px' }}>
          {this.userIcon(issue.user.avatar_url)}
          {`${owner}/${name}`}
        </span>
        <span>
          <O icon={CommentDiscussion} />
          {comments}
        </span>
      </div>
    );
  }

  private renderAssignees() {
    const { assignees } = this.props.issue;

    if (assignees.length === 0) {
      return null;
    }
    return (
      <span>
        →
        {assignees.map(a => (
          <span key={a.id}>{this.userIcon(a.avatar_url)}</span>
        ))}
      </span>
    );
  }

  private onClickIssue(ev: Event) {
    const { issue } = this.props;

    ev.preventDefault();
    this.props.markAsRead(issue.id);
    this.props.openEvent(this.buildURL());
  }

  private userIcon(url: string) {
    return <img src={url} alt="user icon" className={styles.userIcon} />;
  }

  private buildURL() {
    const { issue, urlBase } = this.props;
    const { number } = issue;
    const { owner, name } = issue.repo;
    if (issue.pull_request) {
      return `${urlBase}/${owner}/${name}/issues/${number}`;
    } else {
      return `${urlBase}/${owner}/${name}/pull/${number}`;
    }
  }
}
