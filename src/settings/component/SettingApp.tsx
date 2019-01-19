import * as React from 'react';
import { Tabs, TabController } from './TabController';

interface Props {}

interface State {
  selectedTab: Tabs;
}

export class SettingApp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedTab: 'accounts',
    };
    this.selectTab = this.selectTab.bind(this);
  }

  render() {
    return <TabController selectedTab={this.state.selectedTab} selectTab={this.selectTab} />;
  }

  private selectTab(tab: Tabs) {
    this.setState({ selectedTab: tab });
  }
}
