import React from 'react';
import {Map} from 'immutable';

const StyleControls = {};

export default StyleControls;

const StyleButton = React.createClass({
  onToggle(event) {
    event.preventDefault();
    this.props.onToggle(this.props.style);
  },

  render() {
    let className = 'richeditor-styleButton';
    if (this.props.active) {
      className += ' richeditor-activeButton';
    }
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  },
});


const BLOCK_TYPES = {
  h1: {label: 'h1', style: 'header-one'},
  h2: {label: 'h2', style: 'header-two'},
  h3: {label: 'h3', style: 'header-three'},
  h4: {label: 'h4', style: 'header-four'},
  h5: {label: 'h5', style: 'header-five'},
  h6: {label: 'h6', style: 'header-six'},
  quote: {label: 'quote', style: 'blockquote'},
  ul: {label: 'ul', style: 'unordered-list-item'},
  ol: {label: 'ol', style: 'ordered-list-item'},
};

StyleControls.Block = (props) => {
  const {editorState, require = []} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
  .getCurrentContent()
  .getBlockForKey(selection.getStartKey())
  .getType();

  return (
    <div className="richeditor-controls">
      {
        require.map(key => {
          const type = BLOCK_TYPES[key];
          if (!type)
            return null;
          return (
            <StyleButton
              key={type.label}
              active={type.style === blockType}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
            />
          );
        })
      }
    </div>
  );
};

const INLINE_STYLES = {
  b: {label: 'Bold', style: 'BOLD'},
  i: {label: 'Italic', style: 'ITALIC'},
  u: {label: 'Underline', style: 'UNDERLINE'},
};

StyleControls.Inline = (props) => {
  const {editorState, require = []} = props;
  var currentStyle = editorState.getCurrentInlineStyle();
  return (
    <div className="richeditor-controls">
      {
        require.map(key => {
          const type = INLINE_STYLES[key];
          if (!type)
            return null;
          return (
            <StyleButton
              key={type.label}
              active={currentStyle.has(type.style)}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
            />
          );
        })
      }
    </div>
  );
};
