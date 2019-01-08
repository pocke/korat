import * as React from 'react';
import Octicon, { IssueOpened, GitPullRequest, CommentDiscussion, GitMerge } from '@githubprimer/octicons-react';
import { sum } from 'lodash-es';
import { ipcRenderer } from 'electron';

import * as styles from './IssueBox.scss';
import { Issue, Label } from '../API';
import { issueURL } from '../../utils';
import { Store } from '../Store';
import { openIssueAction, markAsReadAction } from '../ActionCreator';

// HACK: Octicon is a JavaScript library, so tsc does not understand Octicon type.
//       So cast to any.
const O = Octicon as any;

interface Props {
  issue: Issue;
  urlBase: string;
  prefetchIssue: () => void;
}

export class IssueBox extends React.Component<Props> {
  private el: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.onContextmenu = this.onContextmenu.bind(this);
    this.el = React.createRef();
  }

  componentDidMount() {
    const current = this.el.current;
    if (current) {
      current.addEventListener('contextmenu', this.onContextmenu);
    }
  }

  componentWillUnmount() {
    const current = this.el.current;
    if (current) {
      current.removeEventListener('contextmenu', this.onContextmenu);
    }
  }

  render() {
    const { issue } = this.props;

    const klass = issue.AlreadyRead ? styles.readEvent : styles.unreadEvent;
    const titleClass = issue.AlreadyRead ? styles.readEventTitle : styles.unreadEventTitle;
    return (
      <div key={issue.ID} className={klass} onClick={this.onClickIssue.bind(this)} ref={this.el}>
        <h3 className={titleClass}>
          {this.renderIssueIcon()}
          {issue.Title}
        </h3>
        <div className={styles.labelBox}>{issue.Labels.map(label => this.renderLabel(label))}</div>
        {this.renderFooter()}
      </div>
    );
  }

  private renderIssueIcon() {
    const { issue } = this.props;

    if (issue.IsPullRequest) {
      let klass: string;
      let icon = GitPullRequest;
      if (issue.ClosedAt === null) {
        klass = styles.openIcon;
      } else if (issue.Merged === null) {
        klass = styles.undeterminedIcon;
      } else if (issue.Merged) {
        icon = GitMerge;
        klass = styles.mergedIcon;
      } else {
        klass = styles.closedIcon;
      }
      return <O icon={icon} className={klass} />;
    } else {
      const klass = issue.State === 'open' ? styles.openIcon : styles.closedIcon;
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
          {`${RepoOwner}/${RepoName}#${issue.Number}`}
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

  private onClickIssue(ev: React.MouseEvent<HTMLDivElement>) {
    const { issue, urlBase } = this.props;

    ev.preventDefault();
    Store.dispatch(openIssueAction(issueURL(issue, urlBase)));
    Store.dispatch(markAsReadAction(issue.ID));
    this.props.prefetchIssue();
  }

  private userIcon(url: string) {
    return <img src={url} alt="user icon" className={styles.userIcon} />;
  }

  private onContextmenu(ev: MouseEvent) {
    ev.preventDefault();
    ipcRenderer.send('issuebox-contextmenu', this.props.issue.ID);
  }
}
