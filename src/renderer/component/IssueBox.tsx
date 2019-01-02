import * as React from 'react';
import Octicon, { IssueOpened, GitPullRequest, CommentDiscussion } from '@githubprimer/octicons-react';
import { sum } from 'lodash-es';

import * as styles from './IssueBox.scss';
import { openEvent, markAsRead as markAsReadAction } from '../Actions';
import { Issue, markAsRead as markAsReadRequest, Label } from '../API';

// HACK: Octicon is a JavaScript library, so tsc does not understand Octicon type.
//       So cast to any.
const O = Octicon as any;

interface Props {
  issue: Issue;
  selectedAccountID: string;
  urlBase: string;
}

export default class IssueBox extends React.Component<Props> {
  render() {
    const { issue } = this.props;

    const klass = issue.AlreadyRead ? styles.readEvent : styles.unreadEvent;
    const titleClass = issue.AlreadyRead ? styles.readEventTitle : styles.unreadEventTitle;
    return (
      <div key={issue.ID} className={klass} onClick={this.onClickIssue.bind(this)}>
        <h3 className={titleClass}>
          {this.renderIssueIcon()}
          {issue.Title} in {`${issue.RepoOwner}/${issue.RepoName}`}
        </h3>
        <div className={styles.labelBox}>{issue.Labels.map(label => this.renderLabel(label))}</div>
        {this.renderFooter()}
      </div>
    );
  }

  private renderIssueIcon() {
    const { issue } = this.props;

    const klass = issue.State === 'open' ? styles.openIcon : styles.closedIcon;

    if (issue.IsPullRequest) {
      return <O icon={GitPullRequest} className={klass} />;
    } else {
      return <O icon={IssueOpened} className={klass} />;
    }
  }

  private renderLabel(label: Label) {
    return (
      <span
        key={label.ID}
        style={{ backgroundColor: label.Color, color: this.labelTextColor(label.Color) }}
        className={styles.label}
      >
        {label.Name}
      </span>
    );
  }

  private labelTextColor(bg: string) {
    const color = bg
      .slice(1)
      .match(/../g)!
      .map(hex => parseInt(hex, 16));
    return sum(color) / 3 > 80 ? '#000000' : '#ffffff';
  }

  private renderFooter() {
    const { issue, urlBase } = this.props;
    const { Comments, RepoOwner, RepoName } = issue;

    return (
      <div className={styles.footer}>
        <span>
          {this.userIcon(issue.User.AvatarURL)}
          {this.renderAssignees()}
        </span>

        <span style={{ marginRight: '5px' }}>
          {this.userIcon(`${urlBase}/${RepoOwner}.png`)}
          {`${RepoOwner}/${RepoName}`}
        </span>
        <span>
          <O icon={CommentDiscussion} />
          {Comments}
        </span>
      </div>
    );
  }

  private renderAssignees() {
    const { Assignees } = this.props.issue;

    if (Assignees.length === 0) {
      return null;
    }
    return (
      <span>
        →
        {Assignees.map(a => (
          <span key={a.ID}>{this.userIcon(a.AvatarURL)}</span>
        ))}
      </span>
    );
  }

  private onClickIssue(ev: Event) {
    const { issue } = this.props;

    ev.preventDefault();
    markAsReadAction(issue.ID);
    markAsReadRequest(issue.ID);
    openEvent(this.buildURL());
  }

  private userIcon(url: string) {
    return <img src={url} alt="user icon" className={styles.userIcon} />;
  }

  private buildURL() {
    const { issue, urlBase } = this.props;
    const { Number, RepoOwner, RepoName } = issue;
    if (issue.IsPullRequest) {
      return `${urlBase}/${RepoOwner}/${RepoName}/issues/${Number}`;
    } else {
      return `${urlBase}/${RepoOwner}/${RepoName}/pull/${Number}`;
    }
  }
}
