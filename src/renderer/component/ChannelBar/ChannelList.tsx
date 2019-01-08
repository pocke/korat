import * as React from 'react';

import * as styles from './ChannelList.scss';
import { Account, Channel } from '../../API';
import { Store, StoreEvent } from '../../Store';
import { selectChannelAction } from '../../ActionCreator';

interface Props {
  accounts: Account[];
  selectedChannelID: number | undefined;
}

export class ChannelList extends React.Component<Props> {
  render() {
    return this.props.accounts.map(a => this.renderOneAccount(a));
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
    StoreEvent.emit('refresh-issues');
  }
}
