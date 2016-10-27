import React from 'react';

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

const BLOCK_TYPES = [
  {label: '标题1', style: 'header-one'},
  {label: '标题2', style: 'header-two'},
  {label: '标题3', style: 'header-three'},
  {label: '标题4', style: 'header-four'},
  {label: '标题5', style: 'header-five'},
  {label: '标题6', style: 'header-six'},
  {label: '引用', style: 'blockquote'},
  {label: '无序列表', style: 'unordered-list-item'},
  {label: '有序列表', style: 'ordered-list-item'},
];

StyleControls.Block = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="richeditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

const INLINE_STYLES = [
  {label: '粗体', style: 'BOLD'},
  {label: '斜体', style: 'ITALIC'},
  {label: '下划线', style: 'UNDERLINE'},
];

StyleControls.Inline = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="richeditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
