import * as React from 'react';
import Octicon, { IssueOpened, GitPullRequest, CommentDiscussion } from '@githubprimer/octicons-react';

import * as styles from './IssueBox.scss';
import { openEvent, markAsRead as markAsReadAction } from '../Actions';
import { ipcRenderer } from 'electron';
import { IssuesMarkAsReadChannel } from '../../share/ipcChannels';
import { Issue, markAsRead as markAsReadRequest } from '../API';

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
        {/* <div className={styles.labelBox}>{issue.labels.map(label => this.renderLabel(label))}</div> */}
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

  // TODO
  // private renderLabel(label: any) {
  //   return (
  //     <span key={label.id} style={{ backgroundColor: label.color }} className={styles.label}>
  //       {label.name}
  //     </span>
  //   );
  // }

  private renderFooter() {
    const { issue, urlBase } = this.props;
    const { Comments, RepoOwner, RepoName } = issue;

    return (
      <div className={styles.footer}>
        <span>
          {/* this.userIcon(issue.user.avatar_url) */}
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

  // TODO
  private renderAssignees() {
    return null;
    // const { assignees } = this.props.issue;

    // if (assignees.length === 0) {
    //   return null;
    // }
    // return (
    //   <span>
    //     →
    //     {assignees.map(a => (
    //       <span key={a.id}>{this.userIcon(a.avatar_url)}</span>
    //     ))}
    //   </span>
    // );
  }

  private onClickIssue(ev: Event) {
    const { issue } = this.props;

    ev.preventDefault();
    markAsReadAction(issue.ID);
    markAsReadRequest(issue.ID);
    ipcRenderer.send(IssuesMarkAsReadChannel.Request, issue.ID, this.props.selectedAccountID);
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
