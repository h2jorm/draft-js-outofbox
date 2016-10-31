import React from 'react';
import {Map} from 'immutable';
import * as Icons from './Icons';

const StyleControls = {};

export default StyleControls;

const StyleButton = React.createClass({
  onToggle(event) {
    event.preventDefault();
    this.props.onToggle(this.props.style);
  },

  render() {
    let className = 'draft-js-outofbox-toolicon';
    if (this.props.active) {
      className += ' draft-js-outofbox-active';
    }
    const Icon = Icons[this.props.label];
    return (
      <span className={className} onMouseDown={this.onToggle}>
        <Icon />
      </span>
    );
  },
});


const BLOCK_TYPES = {
  h1: {label: 'H1', style: 'header-one',},
  h2: {label: 'H2', style: 'header-two'},
  h3: {label: 'H3', style: 'header-three'},
  h4: {label: 'H4', style: 'header-four'},
  h5: {label: 'H5', style: 'header-five'},
  h6: {label: 'H6', style: 'header-six'},
  ul: {label: 'Ul', style: 'unordered-list-item'},
  ol: {label: 'Ol', style: 'ordered-list-item'},
  quote: {label: 'Quote', style: 'blockquote'},
};

StyleControls.Block = (props) => {
  const {editorState, require = []} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
  .getCurrentContent()
  .getBlockForKey(selection.getStartKey())
  .getType();

  return (
    <div className="draft-js-outofbox-controls">
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
  b: {label: 'B', style: 'BOLD'},
  i: {label: 'I', style: 'ITALIC'},
  u: {label: 'U', style: 'UNDERLINE'},
};

StyleControls.Inline = (props) => {
  const {editorState, require = []} = props;
  var currentStyle = editorState.getCurrentInlineStyle();
  return (
    <div className="draft-js-outofbox-controls">
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
