import * as React from 'react';

import { ConfigForEndPoint, Category } from '../share/configuration';

type C = Pick<ConfigForEndPoint, 'categories'>;

interface ConfigurationInRenderer {
  [key: string]: C;
}

interface Props {
  configuration: ConfigurationInRenderer;
}

export default class Sidebar extends React.Component<Props> {
  render() {
    return (
      <div>
        {Object.keys(this.props.configuration).map((key: string) =>
          this.renderOneEndpoint(key, this.props.configuration[key]),
        )}
      </div>
    );
  }

  renderOneEndpoint(name: string, config: C) {
    return (
      <div key={name}>
        <h2>{name}</h2>
        {config.categories.map(category => this.renderCategory(category))}
      </div>
    );
  }

  renderCategory(c: Category) {
    return <div key={c.id}>{c.displayName}</div>;
  }
}
