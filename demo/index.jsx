import React from 'react';
import ReactDOM from 'react-dom';
import {Map} from 'immutable';
import RichEditor from '../src';

const defaultHTML =
'<b>Bold text</b>, <i>Italic text</i><br/ ><br />' +
'<p>hello<a href="http://www.facebook.com">Example link</a></p><br /><br/ >' +
'<figure><img src="http://cf.dtcj.com/Fp7FCDZpSct1bJgfgkbTYLrHdxq7" height="100" /></figure>';

const Root = React.createClass({
  getInitialState() {
    setTimeout(() => {
      this.setState({value: defaultHTML});
    }, 1000);
    return {
      value: '',
      link: 'http://www.facebook.com',
      image: 'http://cf.dtcj.com/Fp7FCDZpSct1bJgfgkbTYLrHdxq7',
    };
  },

  handleChange(html) {
    this.setState({value: html});
  },

  renderConfigPanel() {
    const {link, image} = this.state;
    return (
      <div style={{marginBottom: 20}}>
        <div>
          <label>link</label>
          <input value={link} onChange={e => this.setState({'link': e.target.value.trim()})} />
        </div>
        <div>
          <label>image</label>
          <input value={image} onChange={e => this.setState({'image': e.target.value.trim()})} />
        </div>
      </div>
    );
  },

  config() {
    const {state} = this;
    return {
      style: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'quote', 'ol', 'ul', 'b', 'i', 'u',
      ],
      plugins: {
        imgUpload(next) {
          Promise.resolve()
          .then(imgUrl => {
            next(state.image);
          });
        },
        toggleLink(next) {
          next(function (href) {
            // no op
          })(state.link);
        },
      },
    };
  },

  render() {
    return (
      <div>
        {
          this.renderConfigPanel()
        }
        <RichEditor
          value={this.state.value}
          onChange={this.handleChange}
          config={this.config()}
        />
      </div>
    );
  }
});

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
