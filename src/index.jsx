import React from 'react';
import ReactDOM from 'react-dom';
import RichEditor from './Editor';

const defaultHTML =
'<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
'<p>hello<a href="http://www.facebook.com">Example link</a></p><br /><br/ >' +
'<figure><img src="http://images.dtcj.com/DTCJ/6333c9fa9f073683d1d3853f2862d31cbb3925c8d863c4f1d33eedba5197118a.jpg" height="100" /></figure>';

const Root = React.createClass({
  handleChange(html) {
    // console.log(html);
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
