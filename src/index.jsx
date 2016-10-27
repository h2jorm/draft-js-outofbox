import React from 'react';
import ReactDOM from 'react-dom';
import RichEditor from './Editor';

const defaultHTML = `
<h2>hello world</h2>
`;

const Root = React.createClass({
  handleChange(html) {
    console.log(html);
  },

  render() {
    return (
      <RichEditor
        defaultHTML={defaultHTML}
        onChange={this.handleChange}
      />
    );
  }
});

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
