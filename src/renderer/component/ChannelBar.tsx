import * as React from 'react';

import * as styles from './ChannelBar.scss';
import { Account } from '../API';
import { ChannelList } from './ChannelBar/ChannelList';
import { FilterController } from './ChannelBar/FilterController';
import { Filter } from '../AppState';

interface Props {
  accounts: Account[];
  selectedChannelID: number | undefined;
  onlyUnreadIssue: boolean;
  filter: Filter;
}

export class ChannelBar extends React.PureComponent<Props> {
  render() {
    const { accounts, selectedChannelID, onlyUnreadIssue, filter } = this.props;
    return (
      <div className={styles.container}>
        <ChannelList accounts={accounts} selectedChannelID={selectedChannelID} onlyUnreadIssue={onlyUnreadIssue} />
        <FilterController filter={filter} />
      </div>
    );
  }
}
