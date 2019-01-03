import * as React from 'react';

import * as styles from './SideBar.scss';
import { selectChannel, updateIssues } from '../Actions';
import { Account, Channel, fetchIssues } from '../API';

interface Props {
  accounts: Account[];
}

export default class Sidebar extends React.PureComponent<Props> {
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
    return (
      <div key={c.ID}>
        <div onClick={() => this.onSelectChannel(c.ID, accountID)} className={styles.channel}>
          <span>{c.DisplayName}</span>
          {c.UnreadCount ? (
            <span className={styles.unreadCount}>
              <span>{c.UnreadCount}</span>
            </span>
          ) : null}
        </div>
        <hr />
      </div>
    );
  }

  async onSelectChannel(selectedChannelID: number, selectedAccountID: number) {
    selectChannel(selectedChannelID, selectedAccountID);
    const issues = await fetchIssues(selectedChannelID);
    updateIssues(issues);
  }
}
