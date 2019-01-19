import * as React from 'react';
import * as styles from './Accounts.scss';
import { Account } from '../../renderer/API';
import { AccountList } from './Accounts/List';
import { NewAccount } from './Accounts/NewAccount';
import { EditAccount } from './Accounts/Edit';
import { setStateT } from '../state';

interface Props {
  accounts: Account[];
  selectedAccountID: number | null;
  setState: setStateT;
}

export class AccountsSettings extends React.Component<Props> {
  render() {
    const { accounts, selectedAccountID } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.sideBarContainer}>
          <AccountList accounts={accounts} setState={this.props.setState} />
          {this.renderAddAccountButton()}
        </div>
        {selectedAccountID ? <EditAccount account={accounts.find(a => a.ID === selectedAccountID)!} /> : <NewAccount />}
      </div>
    );
  }

  private renderAddAccountButton() {
    return <div className={styles.addAccountButton}>+ Add account</div>;
  }
}
