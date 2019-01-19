import * as React from 'react';
import { AccountsSettings } from './Accounts';
import * as styles from './TabController.scss';

export type Tabs = 'accounts' | 'channels';

interface Props {
  selectedTab: Tabs;
  selectTab: (tab: Tabs) => void;
}

export class TabController extends React.Component<Props> {
  render() {
    return (
      <div className={styles.tabController}>
        <TabHeader selectedTab={this.props.selectedTab} selectTab={this.props.selectTab} />
        <TabContent selectedTab={this.props.selectedTab} />
      </div>
    );
  }
}

interface HeaderProps {
  selectedTab: Tabs;
  selectTab: (tab: Tabs) => void;
}

class TabHeader extends React.Component<HeaderProps> {
  render() {
    return (
      <div className={styles.tabHeaderContainer}>
        <div className={this.styleFor('accounts')} onClick={() => this.props.selectTab('accounts')}>
          Accounts
        </div>
        <div className={this.styleFor('channels')} onClick={() => this.props.selectTab('channels')}>
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
}

class TabContent extends React.Component<ContentProps> {
  render() {
    switch (this.props.selectedTab) {
      case 'accounts':
        return <AccountsSettings />;
      case 'channels':
        return null;
    }
  }
}
