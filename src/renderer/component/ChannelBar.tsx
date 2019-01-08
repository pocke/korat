import * as React from 'react';

import * as styles from './ChannelBar.scss';
import { Account } from '../API';
import { ChannelList } from './ChannelBar/ChannelList';

interface Props {
  accounts: Account[];
  selectedChannelID: number | undefined;
  onlyUnreadIssue: boolean;
}

export class ChannelBar extends React.PureComponent<Props> {
  render() {
    const { accounts, selectedChannelID, onlyUnreadIssue } = this.props;
    return (
      <div className={styles.container}>
        <ChannelList accounts={accounts} selectedChannelID={selectedChannelID} onlyUnreadIssue={onlyUnreadIssue} />
      </div>
    );
  }
}
