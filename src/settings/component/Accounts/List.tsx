import * as React from 'react';
import * as styles from './List.scss';
import { Account } from '../../../renderer/API';
import { setStateT } from '../../state';

interface Props {
  accounts: Account[];
  setState: setStateT;
}

export class AccountList extends React.Component<Props> {
  render() {
    return <ul>{this.props.accounts.map(a => this.renderAccount(a))}</ul>;
  }

  private renderAccount(a: Account) {
    return (
      <li className={styles.account} onClick={() => this.onClickAccount(a.ID)}>
        {a.DisplayName}
      </li>
    );
  }

  private onClickAccount(accountID: number) {
    this.props.setState({ selectedAccountID: accountID });
  }
}
