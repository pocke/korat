import * as React from "react";
import * as ReactDOM from "react-dom";

interface Props {
}

class App extends React.Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <h1>Hello, React!</h1>;
  }
}

ReactDOM.render(<App />, document.getElementById("appmain"));
