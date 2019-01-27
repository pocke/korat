import * as React from 'react';
import * as styles from './NewAccount.scss';
import { Account as AccountOriginal, createAccount } from '../../../renderer/API';

interface Account extends AccountOriginal {
  AccessToken: string;
}

interface Props {}

interface State {
  account: Partial<Account>;
}

export class NewAccount extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      account: {
        DisplayName: '',
        AccessToken: '',
        UrlBase: 'https://github.com',
        ApiUrlBase: 'https://api.github.com',
      },
    };
  }

  render() {
    return (
      <div>
        <h2>Create New Account</h2>
        <div>
          <label>
            Display name:
            <input
              type="text"
              value={this.state.account.DisplayName}
              onChange={e => this.setAccount('DisplayName', e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            Access token:
            <input
              type="password"
              value={this.state.account.AccessToken}
              onChange={e => this.setAccount('AccessToken', e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            URL base
            <input type="text" disabled value={this.state.account.UrlBase} />
          </label>
        </div>

        <div>
          <label>
            API URL base
            <input type="text" disabled value={this.state.account.UrlBase} />
          </label>
        </div>

        <div>
          <span className={styles.saveButton} onClick={() => this.save()}>
            Save
          </span>
        </div>
      </div>
    );
  }

  setAccount(key: keyof State['account'], value: any) {
    const account = { ...this.state.account, [key]: value };
    this.setState({ account });
  }

  private async save() {
    const { DisplayName, AccessToken, ApiUrlBase, UrlBase } = this.state.account;
    if (!DisplayName) {
      return;
    }
    if (!AccessToken || AccessToken.length !== 40) {
      return;
    }
    if (!ApiUrlBase || !UrlBase) {
      return;
    }

    await createAccount({ DisplayName, AccessToken, ApiUrlBase, UrlBase });
  }
}
