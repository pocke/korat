import * as React from 'react';
import { TabController } from './TabController';
import { fetchAccounts } from '../../renderer/API';
import { AppState as State, setStateT } from '../state';

interface Props {}

export class SettingApp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedTab: 'accounts',
      accounts: null,
      selectedAccountID: null,
    };
    this.setState = this.setState.bind(this);
  }

  async componentDidMount() {
    const accounts = await fetchAccounts();
    this.setState({ accounts });
  }

  render() {
    if (this.state.accounts) {
      return (
        <TabController
          selectedTab={this.state.selectedTab}
          setState={this.setState as setStateT}
          accounts={this.state.accounts}
          selectedAccountID={this.state.selectedAccountID}
        />
      );
    } else {
      return null;
    }
  }
}
