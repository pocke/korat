import * as React from 'react';

import * as styles from './SideBar.scss';
import { selectChannel, updateIssues } from '../Actions';
import { Account, Channel, fetchIssues } from '../API';

interface Props {
  accounts: Account[];
}

export default class Sidebar extends React.Component<Props> {
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
        <button onClick={() => this.onSelectChannel(c.ID, accountID)}>{c.DisplayName}</button>
        {c.UnreadCount ? <span>{c.UnreadCount}</span> : null}
      </div>
    );
  }

  async onSelectChannel(selectedChannelID: number, selectedAccountID: number) {
    selectChannel(selectedChannelID, selectedAccountID);
    const issues = await fetchIssues(selectedChannelID);
    updateIssues(issues);
  }
}
