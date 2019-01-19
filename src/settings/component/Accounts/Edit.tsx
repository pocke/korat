import * as React from 'react';
import { Account } from '../../../renderer/API';

interface Props {
  account: Account;
}

export class EditAccount extends React.Component<Props> {
  render() {
    return (
      <div>
        <div>
          <label>
            Display name:
            <input type="text" value={this.props.account.DisplayName} />
          </label>
        </div>

        <div>
          <label>
            Access token:
            <input type="password" />
          </label>
        </div>

        <div>
          <label>
            URL base
            <input type="text" disabled value={this.props.account.UrlBase} />
          </label>
        </div>

        <div>
          <label>
            API URL base
            <input type="text" disabled value={this.props.account.ApiUrlBase} />
          </label>
        </div>
      </div>
    );
  }

  // private save() {}
}
