import * as React from 'react';
import { AccountsSettings } from './Accounts';
import * as styles from './TabController.scss';
import { Account } from '../../renderer/API';
import { setStateT } from '../state';

export type Tabs = 'accounts' | 'channels';

interface Props {
  selectedTab: Tabs;
  accounts: Account[];
  setState: setStateT;
  selectedAccountID: number | null;
}

export class TabController extends React.Component<Props> {
  render() {
    return (
      <div className={styles.tabController}>
        <TabHeader selectedTab={this.props.selectedTab} setState={this.props.setState} />
        <TabContent
          selectedTab={this.props.selectedTab}
          accounts={this.props.accounts}
          selectedAccountID={this.props.selectedAccountID}
          setState={this.props.setState}
        />
      </div>
    );
  }
}

interface HeaderProps {
  selectedTab: Tabs;
  setState: setStateT;
}

class TabHeader extends React.Component<HeaderProps> {
  render() {
    return (
      <div className={styles.tabHeaderContainer}>
        <div className={this.styleFor('accounts')} onClick={() => this.props.setState({ selectedTab: 'accounts' })}>
          Accounts
        </div>
        <div className={this.styleFor('channels')} onClick={() => this.props.setState({ selectedTab: 'channels' })}>
          Channels
        </div>
      </div>
    );
  }

  styleFor(t: Tabs) {
    return this.props.selectedTab === t ? styles.tabHeaderSelected : styles.tabHeader;
  }
}

interface ContentProps {
  selectedTab: Tabs;
  accounts: Account[];
  selectedAccountID: number | null;
  setState: setStateT;
}

class TabContent extends React.Component<ContentProps> {
  render() {
    switch (this.props.selectedTab) {
      case 'accounts':
        return (
          <AccountsSettings
            accounts={this.props.accounts}
            selectedAccountID={this.props.selectedAccountID}
            setState={this.props.setState}
          />
        );
      case 'channels':
        return null;
    }
  }
}
