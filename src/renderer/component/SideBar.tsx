import * as React from 'react';

import * as styles from './SideBar.scss';
import { Account, Channel } from '../API';
import { Store } from '../Store';
import { refreshIssuesAction, selectChannelAction } from '../ActionCreator';

interface Props {
  accounts: Account[];
  selectedChannelID: number | undefined;
  onlyUnreadIssue: boolean;
}

export class SideBar extends React.PureComponent<Props> {
  render() {
    return <div className={styles.main}>{this.props.accounts.map(a => this.renderOneAccount(a))}</div>;
  }

  renderOneAccount(account: Account) {
    return (
      <div key={account.ID}>
        <h2>{account.DisplayName}</h2>
        {account.Channels.map(ch => this.renderChannel(ch, account.ID))}
      </div>
    );
  }

  renderChannel(c: Channel, accountID: number) {
    const classes = [styles.channel];
    if (c.ID == this.props.selectedChannelID) {
      classes.push(styles.selectedChannel);
    }
    return (
      <div key={c.ID}>
        <div onClick={() => this.onSelectChannel(c.ID, accountID)} className={classes.join(' ')}>
          <span>{c.DisplayName}</span>
          {c.UnreadCount ? (
            <span className={styles.unreadCount}>
              <span>{c.UnreadCount}</span>
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  async onSelectChannel(selectedChannelID: number, selectedAccountID: number) {
    Store.dispatch(selectChannelAction(selectedChannelID, selectedAccountID));
    const urlBase = this.props.accounts.find(a => a.ID === selectedAccountID)!.UrlBase;
    Store.dispatch(await refreshIssuesAction(selectedChannelID, this.props.onlyUnreadIssue, urlBase));
  }
}
