import * as React from 'react';
import { Filter } from '../../AppState';
import { updateFilterAction } from '../../ActionCreator';
import { Store, StoreEvent } from '../../Store';

interface Props {
  filter: Filter;
}

export class FilterController extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        <h3>Filters</h3>

        <h4>Type</h4>
        <label>
          issue
          {this.renderCheckbox('issue')}
        </label>
        <label>
          pull request
          {this.renderCheckbox('pullRequest')}
        </label>

        <h4>read</h4>
        <label>
          read
          {this.renderCheckbox('read')}
        </label>
        <label>
          unread
          {this.renderCheckbox('unread')}
        </label>

        <h4>Status</h4>
        <label>
          open
          {this.renderCheckbox('open')}
        </label>
        <label>
          closed
          {this.renderCheckbox('closed')}
        </label>
        <label>
          merged
          {this.renderCheckbox('merged')}
        </label>
      </div>
    );
  }

  private renderCheckbox(key: keyof Filter) {
    return (
      <input
        checked={this.props.filter[key]}
        onChange={ev => this.onChange({ [key]: ev.target.checked })}
        type="checkbox"
      />
    );
  }

  private async onChange(f: Partial<Filter>) {
    Store.dispatch(updateFilterAction(f));
    StoreEvent.emit('refresh-issues');
  }
}
